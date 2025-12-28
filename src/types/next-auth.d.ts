import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // This is the PlayFabId
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string; // This is the PlayFabId
  }
}
