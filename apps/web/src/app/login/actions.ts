'use server';

import { createClient } from '@farmheaven/db/server';

function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (input.startsWith('+')) return `+${digits}`;
  return `+${digits}`;
}

export async function requestOtp(phone: string) {
  const supabase = await createClient();
  const e164 = normalizePhone(phone);

  const { error } = await supabase.auth.signInWithOtp({
    phone: e164,
    options: { channel: 'sms' },
  });

  if (error) {
    return { error: error.message };
  }
  return { ok: true as const };
}

export async function verifyOtp(phone: string, token: string) {
  const supabase = await createClient();
  const e164 = normalizePhone(phone);

  const { error } = await supabase.auth.verifyOtp({
    phone: e164,
    token,
    type: 'sms',
  });

  if (error) {
    return { error: error.message };
  }
  return { ok: true as const };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
