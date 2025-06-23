import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { TResume } from '@/types/resume';

export type TResumeStore = {
	resume: Partial<TResume> | null;
	resumeDraft: Partial<TResume> | null;
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
				update: (resume) =>
					set((state) => ({
						resume: { ...state.resume, ...resume },
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
