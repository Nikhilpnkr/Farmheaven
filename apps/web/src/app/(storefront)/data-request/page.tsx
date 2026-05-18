import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Data · DPDPA request',
  description: 'Access, correct, or erase your personal data under DPDPA 2023',
};

export default function DataRequestPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-brand text-4xl font-bold">My Data</h1>
      <p className="mt-2 text-base text-muted-foreground">
        Your rights as a Data Principal under India's DPDPA 2023.
      </p>

      <div className="mt-8 space-y-4">
        <RequestOption
          title="Download all my data"
          description="A JSON export of everything we have about you: profile, orders, addresses, delivery history, subscription, consent log."
          action="Request export"
        />
        <RequestOption
          title="Correct my data"
          description="Update name, phone, email, or address if it's wrong."
          action="Correct"
        />
        <RequestOption
          title="Delete my data"
          description="Erase your account. Order records legally required by tax law (8 years) will be retained only as long as required."
          action="Request erasure"
        />
        <RequestOption
          title="Withdraw marketing consent"
          description="Stop receiving WhatsApp and SMS messages. You'll still get essential order updates."
          action="Withdraw"
        />
      </div>

      <div className="mt-10 rounded-lg border border-border bg-muted p-5 text-sm">
        <div className="font-semibold">Need to talk to someone?</div>
        <div className="mt-2">
          Email <a href="mailto:grievance@farmheaven.in" className="underline">grievance@farmheaven.in</a>{' '}
          or WhatsApp +91 98XX XX0001. Our Grievance Officer responds within 30 days. If you're not
          satisfied, you may escalate to the Data Protection Board of India.
        </div>
      </div>
    </main>
  );
}

function RequestOption({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-5">
      <div>
        <div className="font-semibold">{title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-md border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        {action}
      </button>
    </div>
  );
}
