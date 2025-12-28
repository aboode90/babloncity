import { NextResponse } from 'next/server';
import { PlayFabServer } from 'playfab-sdk';

async function getAllUsers() {
     const allUsers: any[] = [];
     let continuationToken: string | null = null;
 
     // A simple pagination loop to get all players.
     // WARNING: This is very inefficient for a large number of players.
     // In a production scenario, use segments or a dedicated analytics solution.
     do {
         const request: PlayFabServerModels.GetPlayersInSegmentRequest = {
             SegmentId: 'DB0E5739E3A47535', // 'All Players' segment ID
             ContinuationToken: continuationToken,
             MaxBatchSize: 1000
         };
 
         const result = await new Promise<any>((resolve, reject) => {
             PlayFabServer.GetPlayersInSegment(request, (error, result) => {
                 if (error) reject(error);
                 else resolve(result);
             });
         });
 
         allUsers.push(...result.data.PlayerProfiles);
         continuationToken = result.data.ContinuationToken;
 
     } while (continuationToken);
 
     return allUsers;
}


async function getAllUserInventories(playerIds: string[]) {
    const inventories = await Promise.all(playerIds.map(playfabId => {
        return new Promise<any>((resolve) => {
            PlayFabServer.GetUserInventory({ PlayFabId: playfabId }, (error, result) => {
                if (error) resolve(null); // Resolve with null on error
                else resolve(result.data.VirtualCurrency);
            });
        });
    }));
    return inventories.filter(inv => inv !== null); // Filter out failed requests
}


export async function GET() {
  try {
    const allUsers = await getAllUsers();

    const totalUsers = allUsers.length;

    // Active Users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = allUsers.filter(u => u.LastLogin && new Date(u.LastLogin) > thirtyDaysAgo).length;

    // New Users (last 7 days)
    const today = new Date();
    const pastWeek = new Array(7).fill(0).map((_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        return { date: d.toISOString().split('T')[0], users: 0 };
    }).reverse();
    
    allUsers.forEach(user => {
        if(user.Created) {
            const createdDate = new Date(user.Created).toISOString().split('T')[0];
            const dayEntry = pastWeek.find(d => d.date === createdDate);
            if(dayEntry) {
                dayEntry.users++;
            }
        }
    });

    // Total currencies
    const inventories = await getAllUserInventories(allUsers.map(u => u.PlayerId));
    let totalTickets = 0;
    let totalPoints = 0;
    inventories.forEach(inv => {
        totalTickets += inv.TK || 0;
        totalPoints += inv.PT || 0;
    });

    const stats = {
        totalUsers,
        activeUsers,
        totalTickets,
        totalPoints,
        newUsersByDay: pastWeek,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Failed to get stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats', message: error.response?.data?.errorMessage }, { status: 500 });
  }
}
