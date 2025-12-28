import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LoginWithEmailAddress } from './playfab';

export const authOptions: NextAuthConfig = {
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
            Email: credentials.email as string,
            Password: credentials.password as string,
            InfoRequestParameters: {
              GetUserAccountInfo: true,
            },
          });
          
          if (result.data.SessionTicket && result.data.PlayFabId) {
            const user = {
                id: result.data.PlayFabId,
                email: result.data.InfoResultPayload.AccountInfo.PrivateInfo.Email,
                name: result.data.InfoResultPayload.AccountInfo.TitleInfo.DisplayName,
            };
            return user;
          }
          
          return null;
        } catch (error: any) {
            console.error('PlayFab Login Error:', error);
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
        if (user) {
            token.id = user.id; // user.id is the PlayFabId
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user && token.id) {
            (session.user as any).id = token.id as string;
        }
        return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
