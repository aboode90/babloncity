import { NextResponse } from 'next/server';
import { GetTitleData, SetTitleData, ExecuteCloudScript } from '@/lib/playfab';

// This is a simple admin check. In a real app, use a more robust role-based system.
// For now, we are not checking for admin role, assuming the route is protected.
// Middleware should handle auth, but we could add a check for a specific admin PlayFabId.

export async function POST() {
  try {
    // 1. Get the current raffle data
    const titleDataResult = await GetTitleData({ Keys: ["CurrentRaffle"] });
    const raffleString = titleDataResult.data.Data?.CurrentRaffle;

    if (!raffleString) {
      return NextResponse.json({ error: "لا يوجد سحب نشط لإنهاءه." }, { status: 404 });
    }

    const raffle = JSON.parse(raffleString);

    if (raffle.winner) {
        return NextResponse.json({ error: "هذا السحب قد انتهى بالفعل." }, { status: 400 });
    }

    if (!raffle.participants || raffle.participants.length === 0) {
      return NextResponse.json({ error: "لا يوجد مشاركون في السحب." }, { status: 400 });
    }

    // 2. Execute CloudScript to choose winner and grant prize
    const result = await ExecuteCloudScript({
        FunctionName: 'EndRaffleAndGrantPrize',
        FunctionParameter: {
            raffleData: raffle
        },
        // This makes the script run with full permissions
        GeneratePlayStreamEvent: true, 
    });

    if (result.data.Error) {
        // CloudScript returned a business logic error
        return NextResponse.json({ error: result.data.Error.Message }, { status: 400 });
    }
    
    const { winner, prizeAmount } = result.data.FunctionResult;

    // 3. Update the title data with the winner info
    const updatedRaffle = {
        ...raffle,
        winner: winner,
        endedDate: new Date().toISOString()
    };

    await SetTitleData({
        Key: 'CurrentRaffle',
        Value: JSON.stringify(updatedRaffle)
    });
    
    // Optionally: Create the next day's raffle here.
    // For now, we'll let it be created on-demand.
    
    return NextResponse.json({ winner, prizeAmount }, { status: 200 });

  } catch (error: any) {
    console.error('PlayFab End Raffle API Error:', error);
    const errorMessage = error?.response?.data?.errorMessage || 'حدث خطأ غير متوقع أثناء إنهاء السحب.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
