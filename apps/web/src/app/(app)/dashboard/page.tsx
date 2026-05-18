import { getCurrentFarmId, getUser } from '@farmheaven/db/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard-shell';

export default async function HomePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  // No farm yet → send the user through onboarding.
  const farmId = await getCurrentFarmId();
  if (!farmId) redirect('/onboarding');

  return <DashboardShell farmId={farmId} user={user} />;
}
