import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ExecuteCloudScript } from '@/lib/playfab';

export async function GET() {
  const session = await auth();

  if (!(session?.user as any)?.id) {
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }

  const playfabId = (session.user as any).id;

  try {
    const result = await ExecuteCloudScript({
        PlayFabId: playfabId,
        FunctionName: 'getReferralStats',
    });

    if (result.data.Error) {
        return NextResponse.json({ error: result.data.Error.Message }, { status: 400 });
    }

    return NextResponse.json(result.data.FunctionResult, { status: 200 });

  } catch (error: any)
  {
    console.error('PlayFab Get Referral Stats API Error:', error);
    const errorMessage = error?.response?.data?.errorMessage || 'حدث خطأ غير متوقع أثناء جلب إحصائيات الإحالة.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
