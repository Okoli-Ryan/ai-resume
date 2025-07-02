import React, { createContext, ReactNode, useContext, useState } from 'react';

type ResumeContextType = {
	additionalInfo: {
		jobDescription: string;
	};
	setAdditionalInfo: React.Dispatch<React.SetStateAction<{ jobDescription: string }>>;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
	const [additionalInfo, setAdditionalInfo] = useState<{ jobDescription: string }>({ jobDescription: "" });

	return <ResumeContext.Provider value={{ additionalInfo, setAdditionalInfo }}>{children}</ResumeContext.Provider>;
};

export const useResumeContext = () => {
	const context = useContext(ResumeContext);
	if (!context) {
		throw new Error("useResumeContext must be used within a ResumeProvider");
	}
	return context;
};
