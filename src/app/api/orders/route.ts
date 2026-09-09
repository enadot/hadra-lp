import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/orders';
import { orderInputSchema } from '@/lib/validation';
import { getCampaign } from '@/content/campaigns';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'בקשה לא תקינה' }, { status: 400 });
  }

  const parsed = orderInputSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'בקשה לא תקינה';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const input = parsed.data;

  if (!getCampaign(input.campaign)) {
    return NextResponse.json({ error: 'קמפיין לא מוכר' }, { status: 400 });
  }

  // Honeypot filled in — accept silently so the bot learns nothing.
  if (input.company) {
    return NextResponse.json({ ok: true });
  }

  try {
    const order = await createOrder(input);
    // A failed webhook is not the buyer's problem: the order is stored and
    // visible in /admin, so the form still confirms.
    return NextResponse.json({ ok: true, id: order.id });
  } catch {
    return NextResponse.json(
      { error: 'אירעה תקלה בשמירת ההזמנה. נסו שוב או צרו קשר טלפונית.' },
      { status: 500 },
    );
  }
}
