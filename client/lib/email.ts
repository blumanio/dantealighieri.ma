import { Resend } from 'resend';

const FROM = 'StudentItaly.it <hello@studentitaly.it>';

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// ─── Shared result type ────────────────────────────────────────────────────────

interface EmailResult {
  success: boolean;
  error?: string;
}

// ─── 1. Cold lead — free resources ────────────────────────────────────────────

export async function sendColdLeadEmail(
  to: string,
  name: string,
): Promise<EmailResult> {
  console.log('[EMAIL] Attempting to send to:', to, 'key present:', !!process.env.RESEND_API_KEY);
  const resend = getClient();
  if (!resend) return { success: false, error: 'RESEND_API_KEY not set' };

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Your free guide to studying in Italy 🇮🇹',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
          <h2 style="color:#ea580c">Hi ${name},</h2>
          <p>Here are the best free resources to start your Italian university journey:</p>
          <ul style="line-height:2">
            <li>
              📋 <a href="https://studentitaly.it/blog" style="color:#ea580c">
                How to use Universitaly step-by-step
              </a>
            </li>
            <li>
              🎓 <a href="https://studentitaly.it/scholarships" style="color:#ea580c">
                DSU Scholarship guide
              </a>
            </li>
            <li>
              📖 <a href="https://gum.co/studentitaly" style="color:#ea580c">
                Complete Italy study guide
              </a>
            </li>
          </ul>
          <p style="margin-top:24px">
            When you're ready for personalised guidance, our Starter package starts at <strong>€297</strong>.
          </p>
          <a
            href="https://studentitaly.it/pricing#pricing"
            style="display:inline-block;margin-top:12px;padding:12px 24px;background:#ea580c;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold"
          >
            See packages →
          </a>
          <p style="margin-top:32px;color:#64748b;font-size:13px">
            — The StudentItaly.it team
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.log('[EMAIL] Error:', JSON.stringify(err));
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] sendColdLeadEmail failed:', message);
    return { success: false, error: message };
  }
}

// ─── 2. Hot/warm lead — book a call ───────────────────────────────────────────

export async function sendHotLeadEmail(
  to: string,
  name: string,
): Promise<EmailResult> {
  console.log('[EMAIL] Attempting to send to:', to, 'key present:', !!process.env.RESEND_API_KEY);
  const resend = getClient();
  if (!resend) return { success: false, error: 'RESEND_API_KEY not set' };

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Your university matches are ready — next step',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
          <h2 style="color:#ea580c">Hi ${name},</h2>
          <p>
            Based on your profile, you qualify for our full guidance programme.
          </p>
          <p>
            We recommend: <strong>Full Guidance Package (€497)</strong>
          </p>
          <p style="margin-top:24px">
            Book your free 20-minute strategy call:
          </p>
          <a
            href="https://calendly.com/dantema/dante"
            style="display:inline-block;margin-top:8px;padding:12px 24px;background:#ea580c;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold"
          >
            Book Now →
          </a>
          <p style="margin-top:24px">
            Or reach us directly on WhatsApp:
            <a href="https://wa.me/393519000615" style="color:#16a34a;font-weight:bold">
              +39 351 900 0615
            </a>
          </p>
          <p style="margin-top:32px;color:#64748b;font-size:13px">
            — The StudentItaly.it team
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.log('[EMAIL] Error:', JSON.stringify(err));
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] sendHotLeadEmail failed:', message);
    return { success: false, error: message };
  }
}

// ─── 3. Owner alert ───────────────────────────────────────────────────────────

interface LeadAlert {
  name: string;
  email: string;
  whatsapp?: string;
  country?: string;
  tag: string;
}

export async function sendOwnerAlert(lead: LeadAlert): Promise<EmailResult> {
  const ownerEmail = process.env.OWNER_EMAIL ?? 'med@studentitaly.it';
  console.log('[EMAIL] Attempting to send to:', ownerEmail, 'key present:', !!process.env.RESEND_API_KEY);
  const resend = getClient();
  if (!resend) return { success: false, error: 'RESEND_API_KEY not set' };

  try {
    await resend.emails.send({
      from: FROM,
      to: ownerEmail,
      subject: `🔥 New ${lead.tag} lead: ${lead.name} from ${lead.country ?? 'unknown'}`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#1e293b">
          <h2>New lead captured</h2>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tbody>
              ${[
                ['Name', lead.name],
                ['Email', lead.email],
                ['WhatsApp', lead.whatsapp ?? '—'],
                ['Country', lead.country ?? '—'],
                ['Tag', `<strong style="color:#ea580c">${lead.tag}</strong>`],
              ]
                .map(
                  ([label, value]) => `
                <tr>
                  <td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8fafc;font-weight:600;width:120px">${label}</td>
                  <td style="padding:8px 12px;border:1px solid #e2e8f0">${value}</td>
                </tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `,
    });
    return { success: true };
  } catch (err) {
    console.log('[EMAIL] Error:', JSON.stringify(err));
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] sendOwnerAlert failed:', message);
    return { success: false, error: message };
  }
}
