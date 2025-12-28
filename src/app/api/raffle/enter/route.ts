import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ExecuteCloudScript } from '@/lib/playfab';

export async function POST() {
  const session = await auth();

  if (!(session?.user as any)?.id) {
    return NextResponse.json({ error: 'غير مصرح به. يرجى تسجيل الدخول.' }, { status: 401 });
  }

  const playfabId = (session.user as any).id;

  try {
    const result = await ExecuteCloudScript({
        PlayFabId: playfabId,
        FunctionName: 'EnterRaffle',
        // The CloudScript itself defines the ticket cost, so no params needed
    });

    if (result.data.Error) {
        // Business logic error from CloudScript (e.g., not enough tickets, already entered)
        return NextResponse.json({ error: result.data.Error.Message }, { status: 400 });
    }

    return NextResponse.json(result.data.FunctionResult, { status: 200 });

  } catch (error: any) {
    console.error('PlayFab Enter Raffle API Error:', error);
    const errorMessage = error?.response?.data?.errorMessage || 'حدث خطأ غير متوقع أثناء محاولة دخول السحب.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
