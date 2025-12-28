import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ExecuteCloudScript } from '@/lib/playfab';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }

  const playfabId = session.user.id;

  try {
    const result = await ExecuteCloudScript({
        PlayFabId: playfabId,
        FunctionName: 'GetUserTransactions',
    });

    if (result.data.Error) {
        return NextResponse.json({ error: result.data.Error.Message }, { status: 400 });
    }

    const transactions = result.data.FunctionResult ?? [];
    
    // Sort transactions by date, most recent first
    transactions.sort((a: any, b: any) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());

    return NextResponse.json(transactions, { status: 200 });

  } catch (error: any)
  {
    console.error('PlayFab Get Transactions API Error:', error);
    const errorMessage = error?.response?.data?.errorMessage || 'حدث خطأ غير متوقع أثناء جلب سجل المعاملات.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
