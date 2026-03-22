import { Resend } from 'resend';

const FROM = 'StudentItaly.it <hello@studentitaly.it>';

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// ─── Shared pieces ─────────────────────────────────────────────────────────────

interface EmailResult {
  success: boolean;
  error?: string;
}

const FOOTER = `
  <p style="font-size:11px;color:#999;margin-top:32px">
    You received this because you submitted a form on
    <a href="https://studentitaly.it" style="color:#999">studentitaly.it</a>.
  </p>`;

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
          ${FOOTER}
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
            href="https://calendly.com/dantema/dante-alighieri-consulting"
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
          ${FOOTER}
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
  quiz_answers?: Record<string, string | string[]>;
  createdAt?: Date;
}

export async function sendOwnerAlert(lead: LeadAlert): Promise<EmailResult> {
  const ownerEmail = process.env.OWNER_EMAIL ?? 'med@studentitaly.it';
  console.log('[EMAIL] Attempting to send to:', ownerEmail, 'key present:', !!process.env.RESEND_API_KEY);
  const resend = getClient();
  if (!resend) return { success: false, error: 'RESEND_API_KEY not set' };

  const qa = lead.quiz_answers ?? {};
  const dateStr = lead.createdAt
    ? lead.createdAt.toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
      })
    : new Date().toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: false,
      });

  const waNumber = lead.whatsapp ? lead.whatsapp.replace(/\s+/g, '') : '';
  const waLink = waNumber
    ? `<a href="https://wa.me/${waNumber.replace(/^\+/, '')}" style="color:#16a34a;font-weight:bold">${lead.whatsapp}</a>`
    : 'Not provided';

  const helpNeeded = qa.helpNeeded;
  const helpNeededStr = Array.isArray(helpNeeded)
    ? helpNeeded.join(', ')
    : (helpNeeded as string | undefined) ?? '—';

  const rows: [string, string][] = [
    ['Name', lead.name || '—'],
    ['Email', lead.email],
    ['WhatsApp', waLink],
    ['Country', lead.country || '—'],
    ['Tag', `<strong style="color:#ea580c">${lead.tag}</strong>`],
    ['Timeline', (qa.timeline as string | undefined) || '—'],
    ['Challenge', (qa.challenge as string | undefined) || '—'],
    ['Budget', (qa.budget as string | undefined) || '—'],
    ['Help needed', helpNeededStr || '—'],
    ['Date', dateStr],
  ];

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
              ${rows
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
          ${FOOTER}
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

// ─── 4. Student confirmation ───────────────────────────────────────────────────

export async function sendStudentConfirmation(
  to: string,
  name: string,
  tag: string,
): Promise<EmailResult> {
  console.log('[EMAIL] Attempting to send to:', to, 'key present:', !!process.env.RESEND_API_KEY);
  const resend = getClient();
  if (!resend) return { success: false, error: 'RESEND_API_KEY not set' };

  const isCold = tag === 'COLD';

  const html = isCold
    ? `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
        <h2 style="color:#ea580c">Hi ${name},</h2>
        <p>Thank you for reaching out to StudentItaly.it.</p>
        <p>We've put together free resources to help you get started:</p>
        <ul style="line-height:2">
          <li>📖 <a href="https://studentitaly.it/en/blog" style="color:#ea580c">Complete guide</a></li>
          <li>🎓 <a href="https://studentitaly.it/en/scholarships" style="color:#ea580c">Scholarship info</a></li>
          <li>🏫 <a href="https://studentitaly.it/en/universities" style="color:#ea580c">University search</a></li>
        </ul>
        <p style="margin-top:24px">
          When you're ready for personalized guidance, our packages start at <strong>€297</strong>.
        </p>
        <a
          href="https://studentitaly.it/en/pricing"
          style="display:inline-block;margin-top:12px;padding:12px 24px;background:#ea580c;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold"
        >
          See Packages →
        </a>
        <p style="margin-top:32px;color:#64748b;font-size:13px">— The StudentItaly.it Team</p>
        ${FOOTER}
      </div>`
    : `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b">
        <h2 style="color:#ea580c">Hi ${name},</h2>
        <p>Thank you — we've received your profile.</p>
        <p>Based on your answers, you qualify for our guidance program.</p>
        <p style="margin-top:24px"><strong>Next step:</strong> Book your free 20-minute strategy call:</p>
        <a
          href="https://calendly.com/dantema/dante-alighieri-consulting"
          style="display:inline-block;margin-top:8px;padding:12px 24px;background:#ea580c;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold"
        >
          Book Now →
        </a>
        <p style="margin-top:24px">
          Or message us directly on WhatsApp:<br/>
          <a href="https://wa.me/393519000615" style="color:#16a34a;font-weight:bold">
            https://wa.me/393519000615
          </a>
        </p>
        <p style="margin-top:24px">We'll respond within 24 hours.</p>
        <p style="margin-top:32px;color:#64748b;font-size:13px">— The StudentItaly.it Team</p>
        ${FOOTER}
      </div>`;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'We received your request — StudentItaly.it 🇮🇹',
      html,
    });
    return { success: true };
  } catch (err) {
    console.log('[EMAIL] Error:', JSON.stringify(err));
    const message = err instanceof Error ? err.message : String(err);
    console.error('[email] sendStudentConfirmation failed:', message);
    return { success: false, error: message };
  }
}
