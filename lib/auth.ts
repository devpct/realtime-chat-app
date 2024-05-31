import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { fetchRedis } from "@/helpers/redis";

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId) {
        throw new Error('Missing GOOGLE_CLIENT_ID');
    }

    if (!clientSecret) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET');
    }

    return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
        error: '/auth/error', // Optional: Error page
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/dashboard' // New users will be directed here on first sign in (optional)
    },
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    redirect_uri: "http://localhost:3000/api/auth/callback/google"
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
          const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as
            | string
            | null
    
          if (!dbUserResult) {
            if (user) {
              token.id = user!.id
            }
    
            return token
          }
    
          const dbUser = JSON.parse(dbUserResult) as User
    
          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            picture: dbUser.image,
          }
        },
        async session({ session, token }) {
          if (token) {
            session.user.id = token.id
            session.user.name = token.name
            session.user.email = token.email
            session.user.image = token.picture
          }
    
          return session
        },
        redirect() {
            return '/dashboard'
        },
    },
};

export default authOptions;
