import { NextResponse } from 'next/server';
import { RegisterPlayFabUser, ExecuteCloudScript } from '@/lib/playfab';

export async function POST(req: Request) {
  try {
    const { email, password, username, referralCode } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: 'الرجاء إدخال جميع الحقول المطلوبة.' }, { status: 400 });
    }

    // Step 1: Register the user in PlayFab
    const registrationResult = await RegisterPlayFabUser({
      Email: email,
      Password: password,
      Username: username,
      DisplayName: username,
      // We can also pass the referral code here for tracking if needed, but the cloud script handles it
    });

    if (registrationResult.data.SessionTicket) {
      const playfabId = registrationResult.data.PlayFabId;

      // Step 2: Call a Cloud Script function to initialize the player's referral data.
      // This is done asynchronously and we don't need to wait for the result.
      ExecuteCloudScript({
          PlayFabId: playfabId,
          FunctionName: 'postRegistrationSetup',
          FunctionParameter: {
            referralCode: referralCode // Pass the referral code provided during registration
          }
      }).catch(error => {
        // Log the error but don't fail the registration process
        console.error('Error in postRegistrationSetup Cloud Script:', error.response?.data);
      });

      return NextResponse.json({ success: true, message: 'تم إنشاء الحساب بنجاح.' }, { status: 200 });
    
    } else {
      // This case should ideally not be hit if an error isn't thrown
      return NextResponse.json({ error: 'حدث خطأ غير معروف أثناء التسجيل.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('PlayFab Registration API Error:', error);
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
