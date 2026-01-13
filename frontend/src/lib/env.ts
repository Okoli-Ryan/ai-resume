import { z } from 'zod';

const envSchema = z.object({
	BASE_URL: z.string().refine((val) => val.startsWith("http://") || val.startsWith("https://"), {
		message: "BASE_URL must start with http:// or https://",
	}),
	OPENAI_API_KEY: z.string().optional(),
});

export const Env = envSchema.parse({
	BASE_URL: process.env.BASE_URL,
	OPENAI_API_KEY: process.env.OPENAI_API_KEY,
});
