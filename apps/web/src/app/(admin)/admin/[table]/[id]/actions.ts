'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertSuperAdmin, createAdminClient } from '../../_lib/admin-client';
import { isAllowedTable } from '../../_lib/table-list';

type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateRow(
  table: string,
  id: string,
  pkColumn: string,
  jsonString: string,
): Promise<ActionResult> {
  try {
    await assertSuperAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  if (!isAllowedTable(table)) {
    return { ok: false, error: 'table_not_allowed' };
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonString) as Record<string, unknown>;
  } catch {
    return { ok: false, error: 'invalid_json' };
  }
  if (typeof parsed !== 'object' || Array.isArray(parsed) || parsed === null) {
    return { ok: false, error: 'invalid_json_shape' };
  }

  // Strip the PK from the payload — changing PKs invites orphans.
  // We keep the original `id` (which is the value of pkColumn, not necessarily 'id')
  // as the WHERE target. Drop both 'id' and pkColumn to be safe in case the row
  // had both (e.g. a table with 'code' as PK but an 'id' column that's not the PK).
  delete parsed.id;
  delete parsed[pkColumn];

  const admin = createAdminClient();

  // Last-super_admin guard. Two paths into lockout: edit own profile to
  // set is_super_admin=false, or delete own profile entirely. Block both.
  if (table === 'profiles' && parsed.is_super_admin === false) {
    const lockoutCheck = await checkLastSuperAdmin(admin, id, pkColumn);
    if (lockoutCheck) return { ok: false, error: lockoutCheck };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.from(table as any) as any).update(parsed).eq(pkColumn, id);
  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/${table}/${id}`);
  revalidatePath(`/admin/${table}`);
  return { ok: true };
}

export async function deleteRow(
  table: string,
  id: string,
  pkColumn: string,
): Promise<ActionResult> {
  try {
    await assertSuperAdmin();
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  if (!isAllowedTable(table)) {
    return { ok: false, error: 'table_not_allowed' };
  }

  const admin = createAdminClient();

  // Last-super_admin guard for delete: if the target row IS a super_admin
  // AND it's the only one, deleting it locks everyone out.
  if (table === 'profiles') {
    const lockoutCheck = await checkLastSuperAdmin(admin, id, pkColumn);
    if (lockoutCheck) return { ok: false, error: lockoutCheck };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin.from(table as any) as any).delete().eq(pkColumn, id);
  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/admin/${table}`);
  // Redirect back to the list — the row no longer exists.
  redirect(`/admin/${table}`);
}

// Returns an error string if the operation would lock everyone out
// (or if we can't confirm the lockout state), or null if it's safe.
async function checkLastSuperAdmin(
  admin: ReturnType<typeof createAdminClient>,
  targetProfileId: string,
  pkColumn: string,
): Promise<string | null> {
  // For profiles, pkColumn is always 'id' (profiles has no 'code' override),
  // but we accept it as a parameter for consistency with the call sites.
  const { data: target, error: targetErr } = (await admin
    .from('profiles')
    .select('is_super_admin')
    .eq(pkColumn, targetProfileId)
    .maybeSingle()) as {
    data: { is_super_admin: boolean | null } | null;
    error: { message: string } | null;
  };

  // Fail closed on lookup error — refusing one destructive op is much
  // cheaper than locking the platform out of admin.
  if (targetErr) {
    return `lockout_check_failed: ${targetErr.message}`;
  }

  // If target isn't a super_admin, no lockout risk from this operation.
  if (!target?.is_super_admin) return null;

  const { count, error: countErr } = await admin
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('is_super_admin', true);

  if (countErr) {
    return `lockout_check_failed: ${countErr.message}`;
  }

  if ((count ?? 0) <= 1) {
    return 'last_super_admin: refusing to leave the platform with zero super_admins';
  }
  return null;
}
