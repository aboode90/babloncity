import { PlayFabServer, PlayFabClient } from "playfab-sdk";

const {
    NEXT_PUBLIC_PLAYFAB_TITLE_ID,
    PLAYFAB_SECRET_KEY
} = process.env;

if (!NEXT_PUBLIC_PLAYFAB_TITLE_ID) {
    throw new Error("Missing NEXT_PUBLIC_PLAYFAB_TITLE_ID environment variable");
}
if (!PLAYFAB_SECRET_KEY) {
    throw new Error("Missing PLAYFAB_SECRET_KEY environment variable");
}

PlayFabServer.settings.titleId = NEXT_PUBLIC_PLAYFAB_TITLE_ID;
PlayFabServer.settings.developerSecretKey = PLAYFAB_SECRET_KEY;

PlayFabClient.settings.titleId = NEXT_PUBLIC_PLAYFAB_TITLE_ID;

// Promisify PlayFab Methods
function promisify<T extends (request: any, callback: (error: any, result: any) => void) => void>(fn: T) {
    return (request: Parameters<T>[0]): Promise<any> => {
        return new Promise((resolve, reject) => {
            fn(request, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

// Client API
export const RegisterPlayFabUser = promisify(PlayFabClient.RegisterPlayFabUser);
export const LoginWithEmailAddress = promisify(PlayFabClient.LoginWithEmailAddress);

// Server API
export const GetUserInventory = promisify(PlayFabServer.GetUserInventory);
export const AddUserVirtualCurrency = promisify(PlayFabServer.AddUserVirtualCurrency);
export const SubtractUserVirtualCurrency = promisify(PlayFabServer.SubtractUserVirtualCurrency);
export const ExecuteCloudScript = promisify(PlayFabServer.ExecuteCloudScript);
export const GetUsers = promisify(PlayFabServer.GetUsers);

export { PlayFabServer, PlayFabClient };
