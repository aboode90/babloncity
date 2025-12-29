// app/api/user/account/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { GetUserInventory } from '@/lib/playfab';

// IMPORTANT: Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log('📥 Request received for user account');
  const session = await auth();

  const playfabId = (session?.user as any)?.id;

  if (!playfabId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  console.log('🔑 PlayFabId:', playfabId);

  try {
    const inventoryResult = await GetUserInventory({ PlayFabId: playfabId });

    const virtualCurrency = inventoryResult.data.VirtualCurrency || {};
    const tickets = virtualCurrency.TK || 0;

    console.log('💰 Fresh VirtualCurrency from PlayFab:', virtualCurrency);
    console.log('🎫 TK Balance:', tickets);

    const accountInfo = {
      PlayFabId: playfabId,
      VirtualCurrency: virtualCurrency,
    };

    return NextResponse.json(accountInfo, { 
        status: 200,
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        }
    });

  } catch (error: any) {
    console.error('PlayFab GetUserInventory error:', error);
    const errorMessage = error?.response?.data?.errorMessage || 'An unexpected error occurred while fetching the account info.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}