import NextAuth, { NextAuthConfig } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Google from 'next-auth/providers/google';

import { Routes } from './lib/routes';
import { isCustomError } from './lib/utils';
import { googleSignIn } from './services/auth/google-signin';
import { User } from './types/user';

export const authConfig = {
	providers: [Google],
	callbacks: {
		jwt: async ({ user, account, token }) => {
			if (account && user) {
				if (account?.provider === "google") {
					const googleUserResponse = await googleSignIn(account.id_token as string);

					if (isCustomError(googleUserResponse)) return { error: googleUserResponse.message, authToken: "", user } as JWT;

					return {
						authToken: googleUserResponse.token,
						user: googleUserResponse.user as User,
						error: "",
					} as JWT;
				}

				const response = user as { accessToken: string; refreshToken: string; user: User };

				delete token?.error;

				return { ...token, authToken: response.accessToken, user: response.user, id: response.user.id } as JWT;
			}

            return token;
		},
		session({ session, token }) {
			return {
				...session,
				...token,
				authToken: token.authToken,
				user: token.user as User,
			};
		},
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;

			const publicPaths = ["/sign-in"];
			const isProtected = !publicPaths.some((path) => nextUrl.pathname.startsWith(path)) || nextUrl.pathname === "/";

			if (isProtected && !isLoggedIn) {
				const redirectUrl = new URL(Routes.signIn, nextUrl.origin);
				redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
				return Response.redirect(redirectUrl.href);
			}

			return true;
		},
	},
	pages: {
		signIn: Routes.signIn,
	},
} as NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
