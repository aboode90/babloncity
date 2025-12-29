
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
import { ExecuteCloudScript } from '@/lib/playfab';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.playfabId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const response = await ExecuteCloudScript({
            FunctionName: 'claimDailyReward',
            FunctionParameters: { playfabId: session.user.playfabId },
            GeneratePlayStreamEvent: true,
        });

        if (response.Error || response.FunctionResult.error) {
             return NextResponse.json({ error: response.Error?.Message || response.FunctionResult.error }, { status: 400 });
        }

        return NextResponse.json({ message: response.FunctionResult.message });

    } catch (error: any) {
        console.error("PlayFab API call failed:", error);
        return NextResponse.json({ error: 'Failed to claim reward.', details: error.message }, { status: 500 });
    }
}
