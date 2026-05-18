import { getUser } from '@farmheaven/db/server';
import { Logo } from '@farmheaven/ui/components/app/logo';
import { redirect } from 'next/navigation';
import { OnboardingForm } from './onboarding-form';

export default async function OnboardingPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-elev-2">
          <h1 className="text-2xl font-bold tracking-tight">Set up your farm</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Just the basics — you can change anything later.
          </p>

          <div className="mt-6">
            <OnboardingForm />
          </div>
        </div>
      </div>
    </main>
  );
}
