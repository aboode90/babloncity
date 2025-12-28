import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { GetUserAccountInfo } from '@/lib/playfab';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'غير مصرح به' }, { status: 401 });
  }

  const playfabId = session.user.id;

  try {
    const result = await GetUserAccountInfo({ PlayFabId: playfabId });
    
    if (result.data.UserInfo) {
         return NextResponse.json(result.data.UserInfo, { status: 200 });
    } else {
        return NextResponse.json({ error: 'لم يتم العثور على معلومات الحساب.' }, { status: 404 });
    }

  } catch (error: any) {
    console.error('PlayFab Get Account Info API Error:', error);
    const errorMessage = error?.response?.data?.errorMessage || 'حدث خطأ غير متوقع أثناء جلب معلومات الحساب.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
