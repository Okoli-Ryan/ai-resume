import { ClassValue, clsx } from 'clsx';
import Link from 'next/link';
// @ts-expect-error no ts type for this package
import processString from 'react-process-string';
import { twMerge } from 'tailwind-merge';
import { z, ZodError } from 'zod';

import { Response } from '@/types/common';

// import { Link } from "@react-pdf/renderer";
import { ErrorMessage } from './constants';
import { Routes } from './routes';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export class ActionResponse {
	static success<T>(data: NonNullable<T>, message?: string | undefined): Response<T> {
		return {
			success: true,
			message,
			data,
		};
	}

	static error(error: any): Response<null> {
		const errorMessage = error as Error | ZodError | string;

		if (typeof errorMessage === "string" || typeof errorMessage === "undefined") {
			return {
				success: false,
				message: error,
				response: null,
			};
		}

		if (errorMessage instanceof ZodError) {
			return {
				success: false,
				message: error.errors[0].message,
				response: null,
			};
		}

		return {
			success: false,
			message: errorMessage && "message" in errorMessage ? errorMessage?.message : "Something went wrong",
			response: null,
		};
	}
}

export function customError(message: string | undefined, code = ErrorMessage.ServerError as string | number, status = 500) {
	return { code, message, status };
}

export const isCustomError = (error: unknown, shouldRedirect = true): error is ReturnType<typeof customError> => {
	if (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as any).message === "string" &&
		[ErrorMessage.Unauthenticated, ErrorMessage.Unauthorized].includes((error as any).message)
	) {
		if (shouldRedirect) {
			// TODO replace with redirect
			console.log(Routes.signIn);
		}
	}

	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		"message" in error &&
		"status" in error &&
		typeof (error as any).code === "string" &&
		typeof (error as any).message === "string" &&
		typeof (error as any).status === "number"
	);
};

export const urlValidation = (errorMessage: string) =>
	z
		.string()
		.nullable()
		.optional()
		.refine(
			(val) => {
				if (!val) return true;
				try {
					new URL(val);
					return true;
				} catch {
					return false;
				}
			},
			{
				message: errorMessage,
			}
		);

export const getColorFromText = (text: string) => {
	let hash = 0;
	for (let i = 0; i < text.length; i++) {
		hash = text.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = hash % 360;
	return {
		backgroundColor: `hsl(${hue}, 70%, 90%)`,
		color: `hsl(${hue}, 50%, 30%)`,
	};
};

export const TextConfig = [
	{
		regex: /\((.*?)\)\[(.*?)\]/g, // Match link format "(linkText)[link]"
		fn: (key: string, result: string) => (
			<Link href={result[2]} key={key} style={{ color: "blue", textDecoration: "underline" }}>
				{result[1]}
			</Link>
		),
	},
	{
		regex: /_(.*?)_/g, // Match italic format "_text_"
		fn: (key: string, result: string) => <em key={key}>{result[1]}</em>,
	},
	{
		regex: /\*(.*?)\*/g, // Match bold format "*text*"
		fn: (key: string, result: string) => <strong key={key}>{result[1]}</strong>,
	},
];

export const processText = (text: string) => {
	const processor = processString(TextConfig);
	return processor(text).map((item: string, index: number) => {
		if (typeof item === "string") {
			return <span key={index}>{item}</span>;
		}
		return item;
	});
};
