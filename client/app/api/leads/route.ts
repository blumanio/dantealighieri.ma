import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Lead, { LeadTag } from '@/lib/models/Lead';
import {
  sendColdLeadEmail,
  sendHotLeadEmail,
  sendOwnerAlert,
} from '@/lib/email';

function computeTag(answers?: Record<string, string>): LeadTag {
  if (!answers) return 'WARM';

  const budget = answers.budget ?? '';
  const timeline = answers.timeline ?? '';

  const isLowBudget = budget.startsWith('Under €200');
  const isJustExploring = timeline.startsWith('Just exploring');
  const isUrgent = timeline.includes('urgent') || timeline.includes('September 2026');
  const isHighBudget = budget.startsWith('€400') || budget.startsWith('€700') || budget.startsWith('€200–€400');

  if (isLowBudget && isJustExploring) return 'COLD';
  if (isHighBudget && isUrgent) return 'HOT';
  return 'WARM';
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, email, whatsapp, country, answers } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const tag = computeTag(answers);

    const lead = await Lead.create({
      name,
      email,
      whatsapp,
      country,
      quiz_answers: answers,
      tag,
    });

    console.log('[LEADS API] Lead saved:', lead._id, 'tag:', tag);

    // Send emails in parallel — failures must not block the API response
    const leadAlert = { name: name ?? '', email, whatsapp, country, tag };

    Promise.all([
      tag === 'COLD'
        ? sendColdLeadEmail(email, name ?? '')
        : sendHotLeadEmail(email, name ?? ''),
      sendOwnerAlert(leadAlert),
    ]).then((emailResults) => {
      console.log('[LEADS API] Email results:', JSON.stringify(emailResults));
    }).catch((err) => {
      console.error('[leads/route] background email error:', err);
    });

    return NextResponse.json({ success: true, tag: lead.tag }, { status: 201 });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
