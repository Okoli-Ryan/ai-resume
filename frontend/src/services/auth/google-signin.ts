import FetchClient from '@/lib/fetch';
import { AuthResponse } from '@/types/user';

export const googleSignIn = async (idToken: string) => {
	return FetchClient.post<AuthResponse, { idToken: string }>("/auth/google", { idToken }, { hasAuthorization: false });
};
