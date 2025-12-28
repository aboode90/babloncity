import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ExecuteCloudScript } from '@/lib/playfab';

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'غير مصرح به. يرجى تسجيل الدخول.' }, { status: 401 });
  }

  const playfabId = session.user.id;

  try {
    const result = await ExecuteCloudScript({
        PlayFabId: playfabId,
        FunctionName: 'SpinLuckyWheel',
        FunctionParameter: {
            ticketsRequired: 1, // The cost of one spin
        }
    });

    if (result.data.Error) {
        // The CloudScript function returned a business logic error (e.g., not enough tickets)
        return NextResponse.json({ error: result.data.Error.Message }, { status: 400 });
    }

    // The result from the CloudScript is in FunctionResult
    return NextResponse.json(result.data.FunctionResult, { status: 200 });

  } catch (error: any) {
    console.error('PlayFab Spin API Error:', error);
    const errorMessage = error?.response?.data?.errorMessage || 'حدث خطأ غير متوقع أثناء الاتصال بـ PlayFab.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
