export default function GrievancePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-brand text-3xl font-bold">Grievance Officer</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        As required under DPDPA 2023 Rule 14 and the IT Rules 2021.
      </p>
      <div className="mt-8 rounded-lg border border-border bg-card p-6 text-base">
        <div className="font-semibold">Suprameds (Founder & Grievance Officer)</div>
        <div className="mt-3 space-y-1 text-muted-foreground">
          <div>Email: <a href="mailto:grievance@farmheaven.in" className="underline">grievance@farmheaven.in</a></div>
          <div>Phone: +91 98XX XX0001</div>
          <div>Address: FarmHeaven Pvt Ltd, Hyderabad, Telangana 500075</div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Response SLA: within 30 days of a written complaint.
        </div>
      </div>
    </main>
  );
}
