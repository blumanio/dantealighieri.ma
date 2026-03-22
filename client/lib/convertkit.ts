/**
 * ConvertKit integration — WARM and HOT leads only.
 *
 * COLD leads are intentionally excluded: they get one Resend email
 * with free resources and nothing more. Adding cold leads to sequences
 * burns sending quota and raises the unsubscribe rate.
 *
 * ─── ConvertKit sequence setup (do once in the dashboard) ────────────────
 *
 * WARM sequence — tag "warm-lead", 3 emails over 7 days:
 *   Day 0  "Your university matches are ready"   (Resend already handles this)
 *   Day 3  "The #1 mistake North African students make applying to Italy"
 *           → blog post excerpt + soft pitch for Starter package (€297)
 *           → CTA: https://studentitaly.it/en/pricing
 *   Day 7  "Last chance — September 2026 deadline is approaching"
 *           → urgency copy + link to pricing
 *           → CTA: https://studentitaly.it/en/pricing
 *
 * HOT sequence — tag "hot-lead", 2 emails over 3 days:
 *   Day 0  "Book your strategy call"             (Resend already handles this)
 *   Day 2  "Still thinking? Here's what our students say"
 *           → 2–3 testimonials + Calendly link
 *           → CTA: https://calendly.com/dantema/dante
 *
 * In ConvertKit:
 *   1. Create both sequences above.
 *   2. Create tags "warm-lead" and "hot-lead".
 *   3. Add an automation: when tag "warm-lead" is added → start WARM sequence.
 *   4. Add an automation: when tag "hot-lead" is added  → start HOT sequence.
 * ─────────────────────────────────────────────────────────────────────────
 */

const CK_API_KEY = process.env.CONVERTKIT_API_KEY;
const CK_FORM_ID = process.env.CONVERTKIT_FORM_ID;

const CK_BASE = 'https://api.convertkit.com/v3';

interface SubscribeResult {
  success: boolean;
  error?: string;
}

/**
 * Subscribe a WARM or HOT lead to the ConvertKit form and apply the
 * appropriate tag so the matching automation sequence kicks off.
 *
 * Fire-and-forget: the caller should NOT await this.
 */
export async function subscribeToConvertKit(
  email: string,
  firstName: string,
  tag: 'WARM' | 'HOT',
): Promise<SubscribeResult> {
  if (!CK_API_KEY || !CK_FORM_ID) {
    console.warn('[ConvertKit] CONVERTKIT_API_KEY or CONVERTKIT_FORM_ID not set — skipping');
    return { success: false, error: 'env vars not set' };
  }

  const ckTag = tag === 'HOT' ? 'hot-lead' : 'warm-lead';

  try {
    // 1. Subscribe to the form (creates or updates the subscriber)
    const formRes = await fetch(`${CK_BASE}/forms/${CK_FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: CK_API_KEY,
        email,
        first_name: firstName || undefined,
        tags: [ckTag],
      }),
    });

    if (!formRes.ok) {
      const body = await formRes.text().catch(() => '');
      throw new Error(`ConvertKit form subscribe returned ${formRes.status}: ${body}`);
    }

    console.log(`[ConvertKit] Subscribed ${email} with tag "${ckTag}"`);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[ConvertKit] subscribeToConvertKit failed:', message);
    return { success: false, error: message };
  }
}
