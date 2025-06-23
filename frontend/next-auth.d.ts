import "next-auth";

import { DefaultJWT } from "next-auth/jwt";

import { User } from "@/types/user";

declare module "next-auth" {
	interface Session {
		authToken: string;
		error?: string;
		user: User;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		authToken: string;
		error?: string;
		user: User;
	}
}
