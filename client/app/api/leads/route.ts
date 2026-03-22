import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Lead, { LeadTag } from '@/lib/models/Lead';

function computeTag(answers?: Record<string, string>): LeadTag {
  if (!answers) return 'WARM';

  const budget = answers.budget ?? '';
  const timeline = answers.timeline ?? '';

  const isLowBudget = budget === 'Under €200';
  const isJustExploring = timeline === 'Just exploring';
  const isUrgent = timeline === 'This year' || timeline === 'Next 3 months';
  const isHighBudget = budget === '€400+' || budget === '€200-€400';

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

    return NextResponse.json({ success: true, tag: lead.tag }, { status: 201 });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
