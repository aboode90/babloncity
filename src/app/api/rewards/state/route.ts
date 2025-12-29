
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth";
import { ExecuteCloudScript } from '@/lib/playfab';

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.playfabId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const response = await ExecuteCloudScript({
            FunctionName: 'getDailyRewardState',
            FunctionParameters: { playfabId: session.user.playfabId },
            GeneratePlayStreamEvent: true,
        });

        if (response.Error) {
            throw new Error(response.Error.Message);
        }

        return NextResponse.json(response.FunctionResult);

    } catch (error: any) {
        console.error("PlayFab API call failed:", error);
        return NextResponse.json({ error: 'Failed to get reward state.', details: error.message }, { status: 500 });
    }
}
