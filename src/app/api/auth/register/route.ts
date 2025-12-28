import { NextResponse } from 'next/server';
import { RegisterPlayFabUser } from '@/lib/playfab';

export async function POST(req: Request) {
  try {
    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: 'الرجاء إدخال جميع الحقول المطلوبة.' }, { status: 400 });
    }

    const result = await RegisterPlayFabUser({
      Email: email,
      Password: password,
      Username: username,
      DisplayName: username,
      // Require both username and email
      RequireBothUsernameAndEmail: true
    });

    if (result.data.SessionTicket) {
      return NextResponse.json({ success: true, message: 'تم إنشاء الحساب بنجاح.' }, { status: 200 });
    } else {
        // This case should ideally not be hit if an error isn't thrown
        return NextResponse.json({ error: 'حدث خطأ غير معروف أثناء التسجيل.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('PlayFab Registration Error:', error);
    // PlayFab error messages are nested. Let's extract them.
    const pfError = error?.response?.data;
    if (pfError?.errorCode === 1010) { // EmailAddressNotAvailable
        return NextResponse.json({ error: 'هذا البريد الإلكتروني مسجل بالفعل.' }, { status: 409 });
    }
     if (pfError?.errorCode === 1011) { // UserNameNotAvailable
        return NextResponse.json({ error: 'اسم المستخدم هذا غير متاح.' }, { status: 409 });
    }
    const errorMessage = pfError?.errorMessage || 'حدث خطأ غير متوقع.';
    return NextResponse.json({ error: errorMessage }, { status: pfError?.code || 500 });
  }
}
