import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-brand text-4xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: 21 April 2026</p>

      <section className="prose prose-neutral mt-8 max-w-none">
        <p>
          By using FarmHeaven you agree to these terms. If you don't, please don't use our service.
        </p>

        <h2 className="mt-6 text-xl font-bold">1. Orders and delivery</h2>
        <p>
          Orders placed before 3 PM are dispatched next morning within Hyderabad city limits.
          Perishables (milk, eggs, vegetables) are delivered cold. We reserve the right to cancel
          and refund in full if supply fails (e.g. an animal under antibiotic withdrawal — see our
          quarantine policy on the <a href="/traceability">Traceability page</a>).
        </p>

        <h2 className="mt-6 text-xl font-bold">2. Subscriptions</h2>
        <p>
          Weekly and fortnightly boxes renew automatically via UPI autopay (Razorpay e-mandate). You
          can pause, skip, or cancel any time from your account. Cancellations take effect on the
          next billing cycle.
        </p>

        <h2 className="mt-6 text-xl font-bold">3. Returns</h2>
        <p>
          If a product arrives damaged or unfit for consumption, message us on WhatsApp with a photo
          within 24 hours and we'll refund or replace. No questions, no forms.
        </p>

        <h2 className="mt-6 text-xl font-bold">4. Pricing</h2>
        <p>
          Prices are inclusive of GST where applicable (most agricultural produce is GST-exempt).
          Delivery is free on orders above ₹500 within Hyderabad.
        </p>

        <h2 className="mt-6 text-xl font-bold">5. Limitations</h2>
        <p>
          Our liability is limited to the amount you paid for the affected order. We disclaim any
          indirect, incidental, or consequential damages.
        </p>

        <h2 className="mt-6 text-xl font-bold">6. Dispute resolution</h2>
        <p>
          Disputes are governed by Indian law. Jurisdiction lies with the courts in Hyderabad,
          Telangana.
        </p>

        <h2 className="mt-6 text-xl font-bold">7. Contact</h2>
        <p>
          Questions? Email <a href="mailto:hello@farmheaven.in">hello@farmheaven.in</a> or WhatsApp
          +91 98XX XX0001.
        </p>
      </section>
    </main>
  );
}
