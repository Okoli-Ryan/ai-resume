import NextAuth, { NextAuthConfig } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from "next-auth/providers/credentials";
import Google from 'next-auth/providers/google';

import { Routes } from './lib/routes';
import { isCustomError } from './lib/utils';
import { googleSignIn } from './services/auth/google-signin';
import { signin, SigninSchema } from "./services/auth/signin";
import { User } from './types/user';

export const authConfig = {
	providers: [
		Google,
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const validation = SigninSchema.safeParse(credentials);
				if (!validation.success) return null;

				const response = await signin(validation.data);
				if (isCustomError(response)) return null;

				return {
					accessToken: response.token,
					user: response.user,
				} as any;
			},
		}),
	],
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
