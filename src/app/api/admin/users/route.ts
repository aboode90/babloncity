
import { NextResponse } from 'next/server';
import { PlayFabServer } from 'playfab-sdk';
import { AddUserVirtualCurrency, GetUserAccountInfo, GetUserInventory, SubtractUserVirtualCurrency } from '@/lib/playfab';

// This is a simplified function to get all users.
// PlayFab's GetPlayersInSegment is more efficient for large numbers of users,
// but for simplicity, we search for recently logged-in users.
async function getAllUsers() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return new Promise((resolve, reject) => {
        PlayFabServer.SearchForPlayers({
            "SearchQuery": `lastLogin ge '${thirtyDaysAgo.toISOString()}'`,
        }, async (error, result) => {
            if (error) {
                return reject(error);
            }
            
            const playerProfiles = result.data.PlayerProfiles || [];

            // Enrich profiles with inventory and email
            const enrichedProfiles = await Promise.all(playerProfiles.map(async (profile: any) => {
                try {
                    const inventoryPromise = GetUserInventory({ PlayFabId: profile.PlayerId });
                    const accountInfoPromise = GetUserAccountInfo({ PlayFabId: profile.PlayerId });

                    const [inventoryResult, accountInfoResult] = await Promise.all([inventoryPromise, accountInfoPromise]);

                    return {
                        PlayFabId: profile.PlayerId,
                        DisplayName: profile.DisplayName,
                        LastLogin: profile.LastLogin,
                        Created: accountInfoResult.data.UserInfo.Created,
                        Email: accountInfoResult.data.UserInfo.PrivateInfo.Email,
                        VirtualCurrency: inventoryResult.data.VirtualCurrency,
                    };
                } catch (e) {
                    // If a call fails for one user, return null for that user
                    return null;
                }
            }));
            
            // Filter out any null results from failed API calls
            resolve(enrichedProfiles.filter(p => p !== null));
        });
    });
}


export async function GET() {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Failed to get users:', error);
    return NextResponse.json({ error: 'Failed to fetch user data', message: error.response?.data?.errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
        const { playFabId, currencyCode, amount } = await req.json();

        if (!playFabId || !currencyCode || amount === undefined) {
            return NextResponse.json({ error: 'Missing required fields: playFabId, currencyCode, amount' }, { status: 400 });
        }

        const parsedAmount = parseInt(amount, 10);
        if (isNaN(parsedAmount)) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        let result;
        if (parsedAmount > 0) {
            result = await AddUserVirtualCurrency({
                PlayFabId: playFabId,
                VirtualCurrency: currencyCode,
                Amount: parsedAmount,
            });
        } else {
            result = await SubtractUserVirtualCurrency({
                PlayFabId: playFabId,
                VirtualCurrency: currencyCode,
                Amount: Math.abs(parsedAmount),
            });
        }

        return NextResponse.json(result.data);

    } catch (error: any) {
        console.error('Failed to update currency:', error);
        return NextResponse.json({ error: 'Failed to update currency', message: error.response?.data?.errorMessage }, { status: 500 });
    }
}
