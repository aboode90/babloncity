
// =================================================================================================
//          UNIVERSAL HANDLER
// =================================================================================================
// This is a best practice for Cloud Script, allowing you to have one function
// defined in the PlayFab dashboard that can call many different functions in your script.
handlers.callFunction = (args, context) => {
    if (args && args.functionName && handlers[args.functionName]) {
        return handlers[args.functionName](args, context);
    } else {
        throw 'functionName parameter was not provided or the function does not exist.';
    }
};

// =================================================================================================
//          REFERRAL SYSTEM
// =================================================================================================

// Helper function to generate a random alphanumeric string for referral codes
const generateRandomCode = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Helper function to determine the referral commission rate based on the number of referrals
const getCommissionRate = (referralCount) => {
    if (referralCount >= 100) return 0.15;
    if (referralCount >= 50) return 0.10;
    if (referralCount >= 25) return 0.07;
    if (referralCount >= 10) return 0.05;
    if (referralCount >= 5) return 0.02;
    if (referralCount >= 2) return 0.01;
    return 0; // No commission if less than 2 referrals
};

/*
*   Called from the registration API after a new player is created in PlayFab.
*   It sets up the new player's referral data and processes the referral if one was provided.
*   EXPECTS:
*   - context.callerEntityProfile.Lineage.MasterPlayerAccountId: The PlayFab ID of the new user.
*   - (Optional) args.referralCode: The referral code of the user who referred this new player.
*/
handlers.postRegistrationSetup = (args, context) => {
    const newPlayFabId = context.callerEntityProfile.Lineage.MasterPlayerAccountId;
    const providedReferralCode = args.referralCode;

    // 1. Generate a unique referral code for the new player.
    const personalReferralCode = generateRandomCode(8);

    // 2. Initialize the new player's internal data.
    server.UpdateUserInternalData({
        PlayFabId: newPlayFabId,
        Data: {
            'referralCode': personalReferralCode,
            'referredBy': 'None',
            'totalReferrals': 0
        }
    });

    // 3. Add the new user's code to the title-wide referral map for easy lookups.
    // NOTE: This has a practical limit of ~30k users before the JSON object gets too big (~1MB).
    // For larger scales, a dedicated database or a different lookup mechanism is needed.
    const titleData = server.GetTitleInternalData({ Keys: ["referralCodeMap"] });
    const referralMap = titleData.Data["referralCodeMap"] ? JSON.parse(titleData.Data["referralCodeMap"]) : {};
    referralMap[personalReferralCode] = newPlayFabId;
    server.SetTitleInternalData({
        Key: "referralCodeMap",
        Value: JSON.stringify(referralMap)
    });

    // 4. If the new player was referred by someone, process the referral.
    if (providedReferralCode) {
        // Find the referrer's ID in the map we just fetched.
        const referrerId = referralMap[providedReferralCode];
        if (referrerId) {
            try {
                // Link the new player to the referrer.
                server.UpdateUserInternalData({
                    PlayFabId: newPlayFabId,
                    Data: { 'referredBy': referrerId }
                });

                // Increment the referrer's totalReferrals count.
                // This is a safe read-modify-write operation.
                const referrerData = server.GetUserInternalData({ PlayFabId: referrerId, Keys: ['totalReferrals'] });
                const currentReferrals = referrerData.Data['totalReferrals'] ? parseInt(referrerData.Data['totalReferrals'].Value) : 0;
                server.UpdateUserInternalData({
                    PlayFabId: referrerId,
                    Data: { 'totalReferrals': currentReferrals + 1 }
                });

            } catch (e) {
                log.error("Error processing referral link for referrer " + referrerId, e);
            }
        } else {
            log.info(`Provided referral code ${providedReferralCode} was not found in the map.`);
        }
    }

    return { status: 'OK', personalReferralCode: personalReferralCode };
};


/*
*   Retrieves the referral statistics for the current player.
*/
handlers.getReferralStats = (args, context) => {
    const playfabId = context.playerProfile.PlayerId;

    const userData = server.GetUserInternalData({
        PlayFabId: playfabId,
        Keys: ['referralCode', 'totalReferrals']
    });

    const referralCode = userData.Data['referralCode'] ? userData.Data['referralCode'].Value : 'N/A';
    const totalReferrals = userData.Data['totalReferrals'] ? parseInt(userData.Data['totalReferrals'].Value) : 0;

    // NOTE: Getting detailed, time-based earnings requires querying PlayFab events,
    // which is a more advanced feature and can incur costs.
    // For this implementation, we will mock the earnings data.
    const earnings = {
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        allTime: 0 // A real implementation would query event history.
    };
    
    // NOTE: Populating a list of referred users also requires a more complex query.
    // For now, we return an empty list.
    const referredUsers = []; 

    return {
        referralCode: referralCode,
        totalReferrals: totalReferrals,
        earnings: earnings,
        referredUsers: referredUsers
    };
};

// =================================================================================================
//          GAMEPLAY & CURRENCY
// =================================================================================================

/*
*   Handles a player spinning the lucky wheel.
*   Grants the player a random prize and distributes referral earnings if applicable.
*/
handlers.spinLuckyWheel = (args, context) => {
    const playfabId = context.playerProfile.PlayerId;

    const grantResult = server.EvaluateRandomResultTable({
        PlayFabId: playfabId,
        TableId: "LuckyWheelPrizes"
    });

    // Assuming the prize is virtual currency. Adjust if items can be won.
    const grantedCurrency = grantResult.ResultItem.VirtualCurrency;
    const currencyCode = Object.keys(grantedCurrency)[0];
    const amountWon = grantedCurrency[currencyCode];

    // If the player won tickets, check for and distribute referral commission.
    if (currencyCode === 'TK' && amountWon > 0) {
        handlers.distributeReferralCommission({ refereeId: playfabId, amountWon: amountWon }, context);
    }

    return {
        success: true,
        message: "Congratulations! You won a prize.",
        grantedVirtualCurrency: grantedCurrency
    };
};

/*
*   Distributes a percentage of a player's earnings to their referrer.
*   This is called internally by other functions when a player earns tickets.
*   EXPECTS:
*   - args.refereeId: The PlayFab ID of the player who earned the currency.
*   - args.amountWon: The amount of tickets the referee won.
*/
handlers.distributeReferralCommission = (args, context) => {
    const { refereeId, amountWon } = args;
    
    const refereeData = server.GetUserInternalData({
        PlayFabId: refereeId,
        Keys: ['referredBy']
    });

    const referrerId = refereeData.Data['referredBy'] ? refereeData.Data['referredBy'].Value : null;

    if (referrerId && referrerId !== 'None') {
        const referrerData = server.GetUserInternalData({
            PlayFabId: referrerId,
            Keys: ['totalReferrals']
        });
        const totalReferrals = referrerData.Data['totalReferrals'] ? parseInt(referrerData.Data['totalReferrals'].Value) : 0;

        const commissionRate = getCommissionRate(totalReferrals);
        if (commissionRate > 0) {
            const commissionAmount = Math.floor(amountWon * commissionRate);

            if (commissionAmount > 0) {
                server.AddUserVirtualCurrency({
                    PlayFabId: referrerId,
                    VirtualCurrency: 'TK',
                    Amount: commissionAmount
                });

                // Log an event for analytics and potential future transaction history features.
                 server.WriteTitleEvent({
                    EventName: 'referral_commission_granted',
                    Body: {
                        referrerId: referrerId,
                        refereeId: refereeId,
                        commissionAmount: commissionAmount,
                        originalAmount: amountWon,
                        commissionRate: commissionRate
                    }
                });
            }
        }
    }
};

/*
*   Enters the current player into the raffle.
*/
handlers.enterRaffle = (args, context) => {
    const { raffleId, ticketCost, currencyCode } = args;
    const playfabId = context.playerProfile.PlayerId;

    if (!raffleId || ticketCost === undefined || !currencyCode) {
        throw "Missing required arguments: raffleId, ticketCost, and currencyCode are required.";
    }

    server.SubtractUserVirtualCurrency({
        PlayFabId: playfabId,
        VirtualCurrency: currencyCode,
        Amount: ticketCost
    });

    // In a real scenario, you would record the entry in Title Data or a database.
    return { success: true, message: `Successfully entered raffle ${raffleId}.` };
};

/*
*   Placeholder for transaction history.
*/
handlers.getUserTransactions = (args, context) => {
    log.info(`GetUserTransactions called for player ${context.playerProfile.PlayerId}. Returning placeholder data.`);
    return [];
};
