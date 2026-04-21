export default function PayPage() {
  return (
    <main className="flex min-h-screen flex-col p-5">
      <header className="mb-4">
        <div className="text-xs text-muted-foreground">Payslip</div>
        <div className="text-lg font-bold">Apr 2026</div>
      </header>

      <div className="rounded-xl border border-border bg-gradient-to-br from-turmeric-50 to-turmeric-50/50 p-6 text-center">
        <div className="text-xs text-muted-foreground">NET PAY</div>
        <div className="mt-1 font-brand text-4xl font-bold text-primary">₹14,323</div>
        <div className="mt-1 text-xs text-muted-foreground">credits to account ···4421 on 30 Apr</div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-card p-4 text-sm">
        <Row label="Days worked" value="26" />
        <Row label="Wage rate" value="₹650/d" />
        <Row label="Gross" value="₹16,900" />
        <Row label="PF (12%)" value="-₹2,028" />
        <Row label="ESIC (3.25%)" value="-₹549" />
        <div className="my-2 border-t border-border" />
        <Row label={<strong>Net</strong>} value={<strong className="text-primary">₹14,323</strong>} />
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Signed payslip will land in WhatsApp on 30 Apr. Phase 3 feature.
      </p>
    </main>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
