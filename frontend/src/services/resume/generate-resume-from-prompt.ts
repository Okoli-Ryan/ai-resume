import { z } from "zod";

import FetchClient from "@/lib/fetch";
import { TResume } from "@/types/resume";

export type GenerateResumeFromPromptRequest = z.infer<typeof GenerateResumeFromPromptSchema>;

export const generateResumeFromPrompt = async (payload: GenerateResumeFromPromptRequest) => {
    return FetchClient.post<TResume, GenerateResumeFromPromptRequest>(`/resume/generate-from-prompt`, payload);
};

export const GenerateResumeFromPromptSchema = z.object({
    prompt: z.string(),
    additionalInfo: z
        .object({
            jobDescription: z.string().optional(),
            role: z.string().optional(),
            tags: z.string().optional(),
        })
        .optional(),
});
