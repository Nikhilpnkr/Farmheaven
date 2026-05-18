// Send SMS hook for Supabase Auth.
//
// Wired to Authentication → Hooks → Send SMS hook in the Supabase dashboard.
// Supabase Auth calls this function with the phone + OTP whenever a phone-auth
// flow needs to deliver a code. We forward the SMS through TextBee
// (https://textbee.dev) which routes through a real Indian SIM, bypassing DLT
// registration and giving us reliable delivery to Indian numbers.
//
// Required secrets (set via `supabase secrets set` or the dashboard):
//   SEND_SMS_HOOK_SECRET  — generated when you enable the hook (v1,whsec_…)
//   TEXTBEE_API_KEY       — TextBee account API key
//   TEXTBEE_DEVICE_ID     — the gateway device ID for the Android sender
//
// Deploy with verify_jwt=false. The function is authenticated by the
// Standard Webhooks signature (HMAC-SHA256), not a Supabase JWT.

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';

const hookSecret = Deno.env.get('SEND_SMS_HOOK_SECRET');
const textbeeApiKey = Deno.env.get('TEXTBEE_API_KEY');
const textbeeDeviceId = Deno.env.get('TEXTBEE_DEVICE_ID');

type SendSmsPayload = {
  user: { id: string; phone: string };
  sms: { otp: string };
};

function jsonError(status: number, message: string): Response {
  return new Response(
    JSON.stringify({ error: { http_code: status, message } }),
    { status, headers: { 'Content-Type': 'application/json' } },
  );
}

// India-only. Strip all non-digits, take the last 10, prepend +91.
// Handles "+919876543210", "919876543210", "9876543210", "+91 98765 43210".
function normalizeIndianPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 10) return null;
  return `+91${digits.slice(-10)}`;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return jsonError(405, 'Method not allowed');
  }

  if (!hookSecret || !textbeeApiKey || !textbeeDeviceId) {
    console.error('Missing required secret(s)', {
      hasHookSecret: Boolean(hookSecret),
      hasTextbeeApiKey: Boolean(textbeeApiKey),
      hasTextbeeDeviceId: Boolean(textbeeDeviceId),
    });
    return jsonError(500, 'Function misconfigured: missing required secret(s)');
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);

  // Supabase stores the hook secret as `v1,whsec_<base64>` but the
  // standardwebhooks library expects just the base64 part. Strip the prefix
  // defensively (no-op if it's already stripped).
  const normalizedSecret = hookSecret.startsWith('v1,whsec_')
    ? hookSecret.slice('v1,whsec_'.length)
    : hookSecret.replace(/^v1,/, '');

  let event: SendSmsPayload;
  try {
    const wh = new Webhook(normalizedSecret);
    event = wh.verify(payload, headers) as SendSmsPayload;
  } catch (err) {
    console.error('Invalid webhook signature', err);
    return jsonError(401, 'Invalid webhook signature');
  }

  const rawPhone = event.user?.phone;
  const otp = event.sms?.otp;

  if (!rawPhone || !otp) {
    console.error('Hook payload missing phone or otp', {
      hasPhone: Boolean(rawPhone),
      hasOtp: Boolean(otp),
    });
    return jsonError(400, 'Hook payload missing phone or otp');
  }

  const phone = normalizeIndianPhone(rawPhone);
  if (!phone) {
    console.error('Invalid phone format', { rawPhone });
    return jsonError(400, 'Invalid phone format');
  }

  // Keep message ASCII-only so it stays GSM-7 (160 chars/segment) instead of
  // UCS-2 (70 chars/segment, 2-3x cost). No Rs/INR symbols, em-dashes, smart
  // quotes, or other Unicode here. If the template grows past 160 chars it
  // becomes multi-segment (153 chars/segment) and cost rises proportionally.
  const message = `Your FarmHeaven code is ${otp}. Valid for 5 minutes. Do not share.`;

  const url = `https://api.textbee.dev/api/v1/gateway/devices/${textbeeDeviceId}/send-sms`;
  const sendResp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': textbeeApiKey,
    },
    body: JSON.stringify({ recipients: [phone], message }),
  });

  if (!sendResp.ok) {
    const body = await sendResp.text();
    console.error('TextBee send-sms failed', { status: sendResp.status, body });
    return jsonError(502, `TextBee SMS delivery failed: ${sendResp.status}`);
  }

  return new Response('{}', { headers: { 'Content-Type': 'application/json' } });
});
