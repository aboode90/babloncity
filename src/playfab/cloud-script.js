
// ================== Daily Reward System ==================

const REWARD_CONFIG = {
    CURRENCY: "TK",
    REWARDS: [10, 20, 30, 40, 100], // Rewards for Day 1 to 5
    PLAYER_DATA_KEY: "dailyRewardState"
};

// Utility to safely parse JSON
function safeParse(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        return null;
    }
}

handlers.getDailyRewardState = function(args, context) {
    const playfabId = args.playfabId;
    if (!playfabId) return { error: "Player PlayFabID is required." };

    const playerData = server.GetUserData({ 
        PlayFabId: playfabId, 
        Keys: [REWARD_CONFIG.PLAYER_DATA_KEY]
    }).Data;

    const state = playerData[REWARD_CONFIG.PLAYER_DATA_KEY] 
        ? safeParse(playerData[REWARD_CONFIG.PLAYER_DATA_KEY].Value) 
        : { streak: 0, lastClaimed: null, lastBalance: null };

    // Logic to reset streak if a day is missed
    if (state.lastClaimed) {
        const lastClaimDate = new Date(state.lastClaimed);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // Check if the last claim was before yesterday. If so, reset streak.
        if (lastClaimDate.toDateString() !== today.toDateString() && lastClaimDate.toDateString() !== yesterday.toDateString()) {
            state.streak = 0;
            state.lastBalance = null; // Reset balance check as well
        }
    }
    
    // If streak is at max, reset it for the next cycle
    if (state.streak >= REWARD_CONFIG.REWARDS.length) {
        state.streak = 0;
        state.lastBalance = null;
    }

    // Check for activity
    const canClaim = canClaimReward(playfabId, state);

    return { 
        state: { 
            streak: state.streak, 
            canClaim: canClaim 
        }
    };
};

handlers.claimDailyReward = function(args, context) {
    const playfabId = args.playfabId;
    if (!playfabId) return { error: "Player PlayFabID is required." };

    const playerData = server.GetUserData({ 
        PlayFabId: playfabId, 
        Keys: [REWARD_CONFIG.PLAYER_DATA_KEY]
    }).Data;

    let state = playerData[REWARD_CONFIG.PLAYER_DATA_KEY] 
        ? safeParse(playerData[REWARD_CONFIG.PLAYER_DATA_KEY].Value) 
        : { streak: 0, lastClaimed: null, lastBalance: null };

    // Recalculate streak state for security
    if (state.lastClaimed) {
        const lastClaimDate = new Date(state.lastClaimed);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastClaimDate.toDateString() !== today.toDateString() && lastClaimDate.toDateString() !== yesterday.toDateString()) {
            state.streak = 0;
            state.lastBalance = null;
        }
    }
    
    if (state.streak >= REWARD_CONFIG.REWARDS.length) {
        state.streak = 0;
        state.lastBalance = null;
    }
    
    // Check if already claimed today
    if (state.lastClaimed && new Date(state.lastClaimed).toDateString() === new Date().toDateString()) {
        return { error: "لقد استلمت مكافأتك لهذا اليوم بالفعل." };
    }

    // THE SMART ACTIVITY CHECK
    if (!canClaimReward(playfabId, state)) {
        return { error: "يجب أن تكون نشطًا في اللعبة للمطالبة بالمكافأة. رصيدك لم يتغير منذ آخر مكافأة." };
    }

    // Grant the reward
    const rewardAmount = REWARD_CONFIG.REWARDS[state.streak];
    server.AddUserVirtualCurrency({
        PlayFabId: playfabId,
        VirtualCurrency: REWARD_CONFIG.CURRENCY,
        Amount: rewardAmount
    });

    // Get current balance AFTER getting the reward
    const balance = server.GetUserInventory({PlayFabId: playfabId}).VirtualCurrency[REWARD_CONFIG.CURRENCY];

    // Update state for the next day
    const newState = {
        streak: state.streak + 1,
        lastClaimed: new Date().toISOString(),
        lastBalance: balance // Store the new balance
    };

    server.UpdateUserData({
        PlayFabId: playfabId,
        Data: { [REWARD_CONFIG.PLAYER_DATA_KEY]: JSON.stringify(newState) },
        Permission: "Private"
    });
    
    // Write event for analytics
    server.WritePlayerEvent({
        PlayFabId: playfabId,
        EventName: "player_claimed_daily_reward",
        Body: {
            streak: newState.streak,
            reward: rewardAmount
        }
    });

    return { message: `تهانينا! لقد حصلت على ${rewardAmount} تذكرة.` };
};

// This is the core function for the smart activity check
function canClaimReward(playfabId, state) {
    // If it's the very first claim (streak 0), they can always claim.
    if (state.streak === 0) {
        return true;
    }
    
    // If lastBalance is not stored, they can claim (e.g., first time after this feature update)
    if (state.lastBalance === null || state.lastBalance === undefined) {
        return true;
    }

    // Get current currency balance
    const inventory = server.GetUserInventory({PlayFabId: playfabId});
    const currentBalance = inventory.VirtualCurrency[REWARD_CONFIG.CURRENCY];

    // If the balance is different, they are active and can claim.
    return currentBalance !== state.lastBalance;
}



// ================== Referral System ==================

const REFERRAL_CONFIG = {
    COMMISSION_RATE: 0.1, // 10% commission
    CURRENCY: "TK",
    EVENT_NAME: "player_won_game"
};

handlers.postRegistrationSetup = function(args, context) {
    const inviterId = args.inviterId;
    if (!inviterId) return;

    const playfabId = context.playerProfile.PlayerId;

    // Store who invited this player
    server.UpdateUserData({ 
        PlayFabId: playfabId, 
        Data: { "InvitedBy": inviterId },
        Permission: "Private"
    });
    
    // Store that this player has invited a new player
    const inviterData = server.GetUserData({ PlayFabId: inviterId, Keys: ["InvitedPlayers"] }).Data;
    let invitedList = inviterData["InvitedPlayers"] ? JSON.parse(inviterData["InvitedPlayers"].Value) : [];
    invitedList.push(playfabId);
    
    server.UpdateUserData({ 
        PlayFabId: inviterId,
        Data: { "InvitedPlayers": JSON.stringify(invitedList) }
    });
};

handlers.distributeReferralCommission = function(args, context) {
    const winnerId = args.winnerId;
    const prizeAmount = args.prizeAmount;

    const inviterData = server.GetUserData({ PlayFabId: winnerId, Keys: ["InvitedBy"] }).Data;
    if (!inviterData || !inviterData["InvitedBy"]) return; // No inviter

    const inviterId = inviterData["InvitedBy"].Value;
    const commission = Math.floor(prizeAmount * REFERRAL_CONFIG.COMMISSION_RATE);

    if (commission > 0) {
        server.AddUserVirtualCurrency({
            PlayFabId: inviterId,
            VirtualCurrency: REFERRAL_CONFIG.CURRENCY,
            Amount: commission
        });

        // Write an event for analytics
        server.WritePlayerEvent({
            PlayFabId: inviterId,
            EventName: "referral_commission_received",
            Body: { 
                fromPlayer: winnerId, 
                commission: commission 
            }
        });
    }
};

handlers.getReferralStats = function(args, context) {
    const playfabId = args.playfabId;

    const userData = server.GetUserData({ PlayFabId: playfabId, Keys: ["InvitedPlayers"] }).Data;
    const invitedList = userData["InvitedPlayers"] ? JSON.parse(userData["InvitedPlayers"].Value) : [];

    return { count: invitedList.length };
};
