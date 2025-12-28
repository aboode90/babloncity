'use server';
import { NextResponse } from 'next/server';
import { GetTitleData } from '@/lib/playfab';

export async function GET() {
  try {
    const result = await GetTitleData({ Keys: ["CurrentRaffle"] });
    const raffleDataString = result.data.Data?.CurrentRaffle;

    if (raffleDataString) {
        const raffleData = JSON.parse(raffleDataString);
        return NextResponse.json(raffleData);
    } else {
        // No active raffle found in Title Data.
        // We can create a default one for demonstration if needed.
         const defaultRaffle = {
            id: `RAFFLE_${new Date().toISOString().split('T')[0]}`,
            prizeAmount: 10000,
            prizeType: 'Tickets',
            ticketCost: 1,
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Ends in 24 hours
            participants: [],
            winner: null,
        };
       return NextResponse.json(defaultRaffle);
    }
  } catch (error) {
    console.error('Failed to get current raffle:', error);
    return NextResponse.json({ error: 'Failed to fetch raffle data' }, { status: 500 });
  }
}
