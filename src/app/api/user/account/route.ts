import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GetUserInventory } from '@/lib/playfab';

export async function GET() {
  const session = await auth();

  if (!(session?.user as any)?.id) {
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }

  const playfabId = (session.user as any).id;

  try {
    const result = await GetUserInventory({ PlayFabId: playfabId });

    if (result.data) {
      return NextResponse.json({
        PlayFabId: playfabId,
        VirtualCurrency: result.data.VirtualCurrency || { TK: 0, PT: 0 },
        Inventory: result.data.Inventory || [],
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'لم يتم العثور على معلومات الحساب.' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('PlayFab Get Inventory Error:', error);
    const errorMessage = error?.response?.data?.errorMessage || 'حدث خطأ غير متوقع أثناء جلب معلومات الحساب.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}