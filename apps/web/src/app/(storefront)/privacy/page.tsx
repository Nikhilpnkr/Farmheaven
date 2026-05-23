import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'FarmHeaven privacy policy — DPDPA 2023 compliant',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-brand text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: 21 April 2026 · Effective from DPDPA 2023 notification
      </p>

      <section className="prose prose-neutral mt-8 max-w-none">
        <h2 className="mt-8 text-xl font-bold">1. Who we are</h2>
        <p className="mt-2 text-base text-foreground/90">
          FarmHeaven Pvt Ltd ("FarmHeaven", "we", "us") is a private limited company registered in
          Hyderabad, Telangana. We run a 72-acre organic farm and deliver farm produce directly to
          customers. This policy explains how we handle personal data under India's Digital Personal
          Data Protection Act, 2023 ("DPDPA").
        </p>

        <h2 className="mt-8 text-xl font-bold">2. Data we collect</h2>
        <ul className="mt-2 list-disc pl-6 text-base text-foreground/90">
          <li>
            <strong>Identity</strong>: name, phone number, email. We never ask for Aadhaar, PAN, or
            government IDs from customers.
          </li>
          <li>
            <strong>Delivery</strong>: address, geo-coordinates, delivery notes.
          </li>
          <li>
            <strong>Order history</strong>: what you bought, when, how you paid.
          </li>
          <li>
            <strong>Communication</strong>: WhatsApp / SMS opt-ins; we never message you without
            consent.
          </li>
          <li>
            <strong>Technical</strong>: device type, browser, IP address (via our analytics
            provider, PostHog).
          </li>
        </ul>

        <h2 className="mt-8 text-xl font-bold">3. Purpose of processing</h2>
        <p className="mt-2 text-base text-foreground/90">
          We process your personal data only for the purposes for which you provided it: to fulfill
          your order, send delivery updates, process payments via Razorpay, respond to your
          questions, run this website, and (with your explicit consent) send marketing.
        </p>

        <h2 className="mt-8 text-xl font-bold">4. Your rights as a Data Principal</h2>
        <p className="mt-2 text-base text-foreground/90">Under DPDPA you have the right to:</p>
        <ul className="mt-2 list-disc pl-6 text-base text-foreground/90">
          <li>
            <strong>Access</strong> a copy of the personal data we hold about you.
          </li>
          <li>
            <strong>Correct</strong> inaccurate, incomplete, or misleading data.
          </li>
          <li>
            <strong>Erase</strong> your data, subject to legal retention requirements (e.g. tax
            invoices).
          </li>
          <li>
            <strong>Withdraw consent</strong> at any time.
          </li>
          <li>
            <strong>Nominate</strong> another person to exercise your rights in case of death or
            incapacity.
          </li>
          <li>
            <strong>Grievance redressal</strong> — write to our Grievance Officer (below).
          </li>
        </ul>

        <p className="mt-4 text-base text-foreground/90">
          Make any of these requests on our{' '}
          <a href="/data-request" className="underline">
            My Data page
          </a>
          . We respond within 30 days.
        </p>

        <h2 className="mt-8 text-xl font-bold">5. Who we share data with</h2>
        <p className="mt-2 text-base text-foreground/90">We share only what's required:</p>
        <ul className="mt-2 list-disc pl-6 text-base text-foreground/90">
          <li>
            <strong>Razorpay</strong> — to process payments.
          </li>
          <li>
            <strong>Supabase</strong> (hosted in Singapore) — our database + file storage.
          </li>
          <li>
            <strong>Meta / WhatsApp Cloud API</strong> — to send you delivery updates, only with
            consent.
          </li>
          <li>
            <strong>MSG91</strong> — for OTP delivery when you sign in.
          </li>
          <li>
            <strong>Delivery partners</strong> — minimum information to fulfil your order.
          </li>
        </ul>
        <p className="mt-2 text-base text-foreground/90">
          We do not sell your data. We do not share it with advertisers.
        </p>

        <h2 className="mt-8 text-xl font-bold">6. Retention</h2>
        <p className="mt-2 text-base text-foreground/90">
          We retain order records for 8 years (GST / tax law), delivery addresses while your
          subscription is active plus 2 years, and marketing consent until you withdraw it. On
          erasure request we delete everything not legally required.
        </p>

        <h2 className="mt-8 text-xl font-bold">7. Security</h2>
        <p className="mt-2 text-base text-foreground/90">
          Data in transit is protected by TLS 1.3. Data at rest is encrypted by Supabase on
          Postgres. Access to production data is limited to two people (founder + accountant) and
          audited.
        </p>

        <h2 className="mt-8 text-xl font-bold">8. Children</h2>
        <p className="mt-2 text-base text-foreground/90">
          Our services are not directed at children under 18. We do not knowingly collect data from
          minors. If we learn we have, we delete it.
        </p>

        <h2 className="mt-8 text-xl font-bold">9. Changes</h2>
        <p className="mt-2 text-base text-foreground/90">
          We will notify you of material changes 30 days before they take effect.
        </p>

        <h2 className="mt-8 text-xl font-bold">10. Grievance Officer</h2>
        <div className="mt-2 rounded-lg border border-border bg-card p-4 text-base text-foreground/90">
          <div>
            <strong>Name</strong>: Suprameds (Founder)
          </div>
          <div>
            <strong>Email</strong>: grievance@farmheaven.in
          </div>
          <div>
            <strong>Phone</strong>: +91 98XX XX0001
          </div>
          <div>
            <strong>Address</strong>: FarmHeaven Pvt Ltd, Hyderabad, Telangana 500075
          </div>
          <div>
            <strong>Response SLA</strong>: within 30 days, per DPDPA Rule 14.
          </div>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          This policy is drafted in good faith per the DPDPA 2023. For the legal text, refer to the
          Act on MeitY's website. If you believe your rights are violated, you may approach the Data
          Protection Board of India.
        </p>
      </section>
    </main>
  );
}
