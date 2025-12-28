import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginWithEmailAddress } from './playfab';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          const result = await LoginWithEmailAddress({
            Email: credentials.email,
            Password: credentials.password,
            InfoRequestParameters: {
              GetUserAccountInfo: true,
            },
          });
          
          if (result.data.SessionTicket && result.data.PlayFabId) {
            const user: User = {
                id: result.data.PlayFabId,
                email: result.data.InfoResultPayload.AccountInfo.PrivateInfo.Email,
                name: result.data.InfoResultPayload.AccountInfo.TitleInfo.DisplayName,
            };
            return user;
          }
          
          return null;
        } catch (error: any) {
            console.error('PlayFab Login Error:', error);
            // The error object from PlayFab SDK has a specific structure
            const errorMessage = error?.response?.data?.errorMessage || 'An unknown error occurred';
            throw new Error(errorMessage);
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
        // When a user signs in, the 'user' object is available
        if (user) {
            token.id = user.id; // user.id is the PlayFabId
        }
        return token;
    },
    async session({ session, token }) {
        // Add PlayFabId to the session object
        if (session.user && token.id) {
            session.user.id = token.id as string;
        }
        return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
