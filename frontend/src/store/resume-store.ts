import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { TResume } from '@/types/resume';

export type TResumeStore = {
	resume: Partial<TResume> | null;
	resumeDraft: Partial<TResume> | null;
    lastUpdated: number;
	update: (resume: Partial<TResume>) => void;
	updateDraft: (resume: Partial<TResume> | null) => void;
	clear: () => void;
	clearDraft: () => void;
};

export const useResumeStore = create<TResumeStore>()(
	devtools(
		persist(
			(set) => ({
				resume: null,
				resumeDraft: null,
                lastUpdated: Date.now(),
				update: (resume) =>
					set((state) => ({
						resume: { ...state.resume, ...resume },
                        lastUpdated: Date.now(),
					})),
				updateDraft: (resume) =>
					set((state) => ({
						resumeDraft: { ...state.resumeDraft, ...resume },
					})),
				clear: () => set({ resume: null }),
				clearDraft: () => set({ resumeDraft: null }),
			}),
			{
				name: "resume-store", // localStorage key
			}
		),
		{ name: "Resume" }
	)
);
