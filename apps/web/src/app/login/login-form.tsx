'use client';

import { Button } from '@farmheaven/ui/components/ui/button';
import { Input } from '@farmheaven/ui/components/ui/input';
import { Label } from '@farmheaven/ui/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { requestOtp, verifyOtp } from './actions';

type Step = 'phone' | 'otp';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/dashboard';

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [pending, setPending] = useState(false);

  const onRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const result = await requestOtp(phone);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Code sent. Check your SMS.');
    setStep('otp');
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const result = await verifyOtp(phone, otp);
    setPending(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    router.push(nextPath);
  };

  if (step === 'phone') {
    return (
      <form onSubmit={onRequestOtp} className="space-y-4">
        <div>
          <Label htmlFor="phone" className="mb-1 block">
            Phone number
          </Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98XX XX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            autoFocus
          />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : null}
          Send code
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={onVerifyOtp} className="space-y-4">
      <div>
        <Label htmlFor="otp" className="mb-1 block">
          Enter the 6-digit code
        </Label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          autoFocus
          className="text-center font-mono text-lg tracking-[0.5em]"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Sent to <span className="font-mono">{phone}</span>.{' '}
          <button
            type="button"
            onClick={() => setStep('phone')}
            className="underline hover:text-foreground"
          >
            Change
          </button>
        </p>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : null}
        Verify and continue
      </Button>
    </form>
  );
}
