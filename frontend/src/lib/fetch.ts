import { auth } from '@/auth';

import { ErrorMessage } from './constants';
import { customError } from './utils';

// Define a generic type for the response data

const BASE_URL = process.env.BASE_URL;

export type ExtendedRequestInit = RequestInit & {
	hasAuthorization?: boolean;
	isFormdata?: boolean;
	hasCustomResponse?: boolean;
	responseFormat?: "json" | "text" | "blob";
};

class FetchClient {
	static async request<Response>(
		url: string,
		options: ExtendedRequestInit = { hasAuthorization: true, responseFormat: "json" }
	): Promise<Response | ReturnType<typeof customError>> {
		options = { ...options, hasAuthorization: options.hasAuthorization ?? true, headers: { "x-api-key": process.env.X_API_KEY! } };

		const hasFullPath = !url.startsWith("/");

		if (!BASE_URL) {
			return customError("Base URL is not defined");
		}

		if (options.hasAuthorization) {
			const session = await auth();

			if (session?.error) {
				return customError(session.error);
			}

			const accessToken = session?.authToken;

			if (!session || !accessToken) {
				return customError(ErrorMessage.Unauthenticated);
			}

			options.headers = { ...options.headers, Authorization: `Bearer ${accessToken}` };
		}

		let headers: HeadersInit = { "Content-Type": "application/json" };
		console.log(url, options.body);

		if (options.isFormdata) {
			const formData = new FormData();

			Object.keys(options.body as BodyInit).forEach((key) => {
				if (options.body) {
					formData.append(key, (options.body as BodyInit)[key as keyof BodyInit]);
				}
			});

			options.body = formData;
			headers = {};
		} else {
			options.body = JSON.stringify(options.body);
		}

		const config: ExtendedRequestInit = {
			...options,
			headers: { ...options.headers, ...headers },
		};

		try {
			const response = await fetch(hasFullPath ? url : BASE_URL + url, config);

			// Handle response codes
			if (response.status === 401) {
				return customError(ErrorMessage.Unauthorized);
			}

			if (!response.ok) {
				console.log("RESPONSE ERROR", response.status, response.statusText, url);
				return customError(response.statusText, response.statusText, response.status);
			}

			if (options.responseFormat === "text") return response.text() as Response;
			if (options.responseFormat === "blob") return response.blob() as Response;

			const data: Response = await response.json();

			//
			if (hasFullPath || options.hasCustomResponse) {
				return data as Response;
			}

			console.log(`RESPONSE ${response.url}`, data);
			return data;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			if (error.response && error.response.data) {
				console.log(`ERROR RESPONSE ${url}`, error);
				return customError(error.response.data);
			}
			console.log(`ERROR RESPONSE ${url}`, error);
			return customError(error.message || "Something went wrong");
		}
	}

	static async get<T>(url: string, options: ExtendedRequestInit = {}) {
		return this.request<T>(url, { method: "GET", ...options });
	}

	static async post<Response, Request>(url: string, body: Request, options: ExtendedRequestInit = {}) {
		return this.request<Response>(url, {
			method: "POST",
			body: body! as unknown as BodyInit,
			...options,
		});
	}

	static async put<Request, Response>(url: string, body: Request, options: ExtendedRequestInit = {}) {
		return this.request<Response>(url, {
			method: "PUT",
			body: body! as unknown as BodyInit,
			...options,
		});
	}

	static async patch<Request, Response>(url: string, body: Request, options: ExtendedRequestInit = {}) {
		return this.request<Response>(url, {
			method: "PATCH",
			body: body! as unknown as BodyInit,
			...options,
		});
	}

	static async delete<T>(url: string, options: ExtendedRequestInit = {}) {
		return this.request<T>(url, { method: "DELETE", ...options });
	}

	// For making requests with any custom method
	static async customRequest<Request, Response>(url: string, method: string, body: Request, options: ExtendedRequestInit = {}) {
		return this.request<Response>(url, {
			method,
			body: body! as unknown as BodyInit,
			...options,
		});
	}
}

export const handleResponse = async <T>(res: Response): Promise<T> => {
	if (!res.ok) {
		const error = (await res.json()) as { message: string };
		throw new Error(error?.message || "Request failed");
	}
	return res.json() as Promise<T>;
};

export default FetchClient;
