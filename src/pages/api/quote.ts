/**
 * POST /api/quote
 *
 * Astro API endpoint — handles contact form submissions from src/pages/contact.astro.
 * Served by the Cloudflare Worker (adapter @astrojs/cloudflare, Workers Assets mode).
 * Sends an email via Resend to sales@sharkjaw.net and cc josuncn@gmail.com,
 * then 303-redirects back to /contact/?sent=1.
 *
 * Required Cloudflare Workers secrets (Dashboard → Workers → sharkjaw-net → Settings → Variables):
 *   RESEND_API_KEY   — required, Resend API key (re_xxx)
 *   QUOTE_TO         — optional, default sales@sharkjaw.net
 *   QUOTE_CC         — optional, default josuncn@gmail.com
 *   QUOTE_FROM       — optional, default "SharkJaw <noreply@sharkjaw.net>" (domain must be Resend-verified)
 *
 * See docs/api-quote-setup.md for full setup walkthrough.
 */

import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const DEFAULT_TO = 'sales@sharkjaw.net';
const DEFAULT_CC = 'josuncn@gmail.com';
const DEFAULT_FROM = 'SharkJaw <noreply@sharkjaw.net>';

interface QuoteEnv {
  RESEND_API_KEY?: string;
  QUOTE_TO?: string;
  QUOTE_CC?: string;
  QUOTE_FROM?: string;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  );

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const redirect = (origin: string, qs: string) =>
  new Response(null, {
    status: 303,
    headers: { Location: `${origin}/contact/${qs}` },
  });

export const POST: APIRoute = async ({ request }) => {
  const origin = new URL(request.url).origin;
  const cfEnv = env as unknown as QuoteEnv;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirect(origin, '?error=bad_request');
  }

  // Honeypot: bots fill the hidden "website" input, humans don't.
  const honey = (form.get('website') as string | null)?.trim();
  if (honey) return redirect(origin, '?sent=1');

  const name = ((form.get('name') as string | null) || '').trim();
  const email = ((form.get('email') as string | null) || '').trim();
  const company = ((form.get('company') as string | null) || '').trim();
  const phone = ((form.get('phone') as string | null) || '').trim();
  const vesselType = ((form.get('vessel_type') as string | null) || '').trim();
  const swl = ((form.get('swl') as string | null) || '').trim();
  const quantity = ((form.get('quantity') as string | null) || '').trim();
  const message = ((form.get('message') as string | null) || '').trim();
  const classification = form.getAll('classification[]').map((v) => String(v));

  if (!name || !email || !isEmail(email)) {
    return redirect(origin, '?error=invalid');
  }

  if (!cfEnv.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured');
    return redirect(origin, '?error=server');
  }

  const to = cfEnv.QUOTE_TO || DEFAULT_TO;
  const cc = cfEnv.QUOTE_CC || DEFAULT_CC;
  const from = cfEnv.QUOTE_FROM || DEFAULT_FROM;

  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const country =
    (request.headers.get('cf-ipcountry') as string | null) || 'unknown';
  const ua = request.headers.get('user-agent') || 'unknown';

  const subject = `[SharkJaw Quote] ${name}${company ? ` — ${company}` : ''}${
    vesselType ? ` (${vesselType})` : ''
  }`;

  const rows: Array<[string, string]> = [
    ['Name', name],
    ['Company', company || '—'],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Vessel Type', vesselType || '—'],
    ['Required SWL', swl || '—'],
    ['Quantity', quantity || '—'],
    ['Classification', classification.length ? classification.join(', ') : '—'],
  ];

  const html = `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:680px;margin:0 auto;padding:24px;color:#0a1929">
  <h2 style="color:#0a1929;border-bottom:3px solid #f5c842;padding-bottom:8px;margin-top:0">New Quote Request — SharkJaw</h2>
  <table style="width:100%;border-collapse:collapse;margin:16px 0">
    ${rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 12px;border-bottom:1px solid #e8eef5;font-weight:600;color:#1e3a5f;width:180px">${escapeHtml(
            k
          )}</td><td style="padding:8px 12px;border-bottom:1px solid #e8eef5">${escapeHtml(
            v
          )}</td></tr>`
      )
      .join('')}
  </table>
  ${
    message
      ? `<div style="margin:16px 0"><div style="font-weight:600;color:#1e3a5f;margin-bottom:6px">Message</div><div style="padding:14px;background:#f5f7fa;border-left:3px solid #f5c842;white-space:pre-wrap">${escapeHtml(
          message
        )}</div></div>`
      : ''
  }
  <hr style="border:0;border-top:1px solid #e8eef5;margin:24px 0">
  <div style="font-size:12px;color:#667;line-height:1.6">
    Submitted from sharkjaw.net · IP ${escapeHtml(ip)} · Country ${escapeHtml(
    country
  )}<br>
    <span style="color:#999">UA: ${escapeHtml(ua)}</span>
  </div>
</body></html>`;

  const text = [
    `New Quote Request — SharkJaw`,
    ``,
    ...rows.map(([k, v]) => `${k}: ${v}`),
    ``,
    `Message:`,
    message || '(none)',
    ``,
    `---`,
    `IP: ${ip} · Country: ${country}`,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfEnv.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        cc: [cc],
        reply_to: email,
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('Resend send failed', res.status, detail);
      return redirect(origin, '?error=send_failed');
    }
  } catch (err) {
    console.error('Resend fetch threw', err);
    return redirect(origin, '?error=network');
  }

  return redirect(origin, '?sent=1');
};

export const GET: APIRoute = () =>
  new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'POST' },
  });
