export type TWorkExperience = {
    companyName: string;
    companyLink?: string;
    title: string;
    startDate: string;
    endDate?: string;
    location: string;
    bulletPoints: string[];
};

export type TPersonalInfo = {
    name: string;
    role: string;
    location: string;
    linkedinUrl: string;
    phoneNumber: string;
    email: string;
    githubUrl: string;
    portfolioUrl: string;
};

export type TProject = {
    name: string;
    link: string;
    bulletPoints: string[];
};

export type TEducation = {
    schoolName: string;
    degree: string;
    major: string;
    location: string;
    isOngoing: boolean;
    startDate: string;
    endDate?: string;
    bulletPoints: string[];
};

export type TSkill = {
    category: string;
    items: string[];
};

export type TResumeForm = {
    skills: {
        category: string;
        skills: {
            text: string;
        }[];
    }[];
    projects: ToBulletPointObj<TProject>[];
    education: ToBulletPointObj<TEducation>[];
    workExperience: ToBulletPointObj<TWorkExperience>[];
    summary: string;
    personalInfo: TPersonalInfo;
};

export type ToBulletPointObj<T extends { bulletPoints: string[] }> = Omit<
    T,
    "bulletPoints"
> & {
    bulletPoints: { text: string }[];
};
