import { NextResponse } from 'next/server';
import { createClickEvent } from '@/lib/events';
import { clickEventSchema } from '@/lib/validation';
import { getCampaign } from '@/content/campaigns';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Button clicks from the landing page (sent with navigator.sendBeacon). */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'בקשה לא תקינה' }, { status: 400 });
  }

  const parsed = clickEventSchema.safeParse(body);
  if (!parsed.success || !getCampaign(parsed.data.campaign)) {
    return NextResponse.json({ error: 'בקשה לא תקינה' }, { status: 400 });
  }

  try {
    const event = await createClickEvent(parsed.data);
    return NextResponse.json({ ok: true, id: event.id });
  } catch {
    return NextResponse.json({ error: 'שגיאה בשמירה' }, { status: 500 });
  }
}
