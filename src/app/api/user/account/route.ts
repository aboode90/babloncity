import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();

  if (!(session?.user as any)?.id) {
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }

  const playfabId = (session.user as any).id;
  const tickets = (session.user as any).tickets;

  try {
    return NextResponse.json({
      PlayFabId: playfabId,
      VirtualCurrency: { TK: tickets || 0 },
    }, { status: 200 });

  } catch (error: any) {
    console.error('PlayFab Get Inventory Error:', error);
    const errorMessage = error?.response?.data?.errorMessage || 'حدث خطأ غير متوقع أثناء جلب معلومات الحساب.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}