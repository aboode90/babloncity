
// Universal handler for all functions
// This is a best practice for Cloud Script, allowing you to have one function
// defined in the PlayFab dashboard that can call many different functions in your script.
handlers.callFunction = (args, context) => {
    // The 'functionName' parameter should be provided in the request's FunctionParameter
    if (args && args.functionName) {
        if (handlers[args.functionName]) {
            // Call the requested function and pass along the arguments and context
            return handlers[args.functionName](args, context);
        } else {
            throw `Function with name ${args.functionName} was not found.`;
        }
    } else {
        throw 'functionName parameter was not provided.';
    }
};


/*
*   Handles a player spinning the lucky wheel.
*   Grants the player a random prize from a predefined drop table.
*   EXPECTS:
*   - A Drop Table named "LuckyWheelPrizes" to be defined in PlayFab Title Data.
*     The drop table should contain items (virtual currency, catalog items) and their weights.
*   RETURNS:
*   - The result of the prize evaluation (what the player won).
*/
handlers.spinLuckyWheel = (args, context) => {
    const playerProfile = context.playerProfile;
    const playfabId = playerProfile.PlayerId;

    // Evaluate the drop table to get a prize
    const grantResult = server.EvaluateRandomResultTable({
        PlayFabId: playfabId,
        TableId: "LuckyWheelPrizes" // IMPORTANT: This drop table must exist in your Title Data
    });

    return {
        success: true,
        message: "Congratulations! You won a prize.",
        grantedItems: grantResult.ResultItem.Item, // This depends on the structure of your drop table result
        grantedVirtualCurrency: grantResult.ResultItem.VirtualCurrency // Adjust if necessary
    };
};


/*
*   Enters the current player into the raffle.
*   It subtracts a fixed amount of virtual currency (tickets) as an entry fee.
*   EXPECTS:
*   - args.raffleId: A unique identifier for the raffle they are entering.
*   - args.ticketCost: The number of tickets required to enter.
*   - args.currencyCode: The code for the virtual currency to use (e.g., "TC").
*   RETURNS:
*   - A success message and the new ticket balance.
*/
handlers.enterRaffle = (args, context) => {
    const { raffleId, ticketCost, currencyCode } = args;
    const playerProfile = context.playerProfile;
    const playfabId = playerProfile.PlayerId;

    if (!raffleId || !ticketCost || !currencyCode) {
        throw "Missing required arguments: raffleId, ticketCost, and currencyCode are required.";
    }

    // First, check the player's current ticket balance
    const inventoryResult = server.GetUserInventory({ PlayFabId: playfabId });
    const currentTickets = inventoryResult.VirtualCurrency[currencyCode] || 0;

    if (currentTickets < ticketCost) {
        throw `Not enough tickets. You have ${currentTickets}, but need ${ticketCost}.`;
    }

    // Subtract the currency for the raffle entry
    const subtractResult = server.SubtractUserVirtualCurrency({
        PlayFabId: playfabId,
        VirtualCurrency: currencyCode,
        Amount: ticketCost
    });

    // Here you would typically add logic to record the player's entry.
    // For now, we will just confirm the ticket deduction.
    // A more advanced implementation would use Player Data or a custom data store.

    return {
        success: true,
        message: `Successfully entered raffle ${raffleId}.`,
        newBalance: subtractResult.Balance
    };
};


/*
*   Retrieves a history of the player's virtual currency transactions.
*   NOTE: PlayFab does not provide a built-in transaction history API.
*   This is a mock implementation that returns an empty array.
*   A real implementation requires logging every currency change to a separate system
*   or using PlayFab Events and querying them, which is a much more advanced topic.
*   For now, this will prevent the website from crashing.
*   RETURNS:
*   - An empty array.
*/
handlers.getUserTransactions = (args, context) => {
    // This is a placeholder. A real implementation is complex.
    // See the function description for more details.
    log.info(`GetUserTransactions called for player ${context.playerProfile.PlayerId}. Returning placeholder data.`);
    return [];
};
