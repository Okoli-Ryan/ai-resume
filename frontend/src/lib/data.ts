import {
    TEducation,
    TPersonalInfo,
    TProject,
    TSkill,
    TWorkExperience,
} from "@/lib/types";

export const PersonalInformation: TPersonalInfo = {
    email: "okoliryan50@gmail",
    githubUrl: "https://github.com/okoliryan50",
    linkedinUrl: "https://linkedin.com/in/okoliryan50",
    location: "Lagos, Nigeria",
    name: "Ugochukwu Okoli",
    phoneNumber: "+2347025939563",
    portfolioUrl: "https://okoliryan50.vercel.app",
    role: "Frontend Developer",
};

export const SummaryInfo = `Results-driven software engineer with 5 years of experience in designing and deploying web and mobile applications. Proficient in TypeScript, React, React Native, Next.js, and ASP.NET, with a strong focus on delivering efficient, user-friendly solutions. A proven problem-solver with a detail-oriented approach, dedicated to continuous learning and adopting innovative technologies. Experienced in developing projects across diverse sectors, including fintech, e-commerce, crypto, and HR services`;

export const WorkExperiences: TWorkExperience[] = [
    {
        companyName: "Tech Innovators Inc.",
        companyLink: "https://techinnovators.com",
        title: "Senior Software Engineer",
        startDate: "2020-06-01",
        endDate: "2023-12-31",
        location: "San Francisco, CA",
        bulletPoints: [
            "Led the development of a high-performance e-commerce platform serving over 1 million users. This has caused an increase of 50% in orders and 20% in revenue.. source: (Tech Inovators)[https://techinnovators.com].",
            "Implemented CI/CD pipelines, reducing deployment time by 50%.",
            "Mentored junior developers, improving team productivity by 30%.",
        ],
    },
    {
        companyName: "GreenTech Solutions",
        companyLink: "https://greentech.com",
        title: "Frontend Developer",
        startDate: "2018-09-01",
        endDate: "2020-05-31",
        location: "Austin, TX",
        bulletPoints: [
            "Developed and maintained responsive web applications using React and TypeScript.",
            "Optimized application performance, achieving a 40% reduction in page load times.",
            "Collaborated with cross-functional teams to design and implement new product features.",
        ],
    },
    {
        companyName: "NextGen AI",
        title: "Software Engineer Intern",
        startDate: "2017-06-01",
        endDate: "2017-08-31",
        location: "Boston, MA",
        bulletPoints: [
            "Assisted in building machine learning models for predictive analytics.",
            "Developed internal tools for data preprocessing and visualization using Python.",
            "Presented project findings to senior management, leading to implementation in a key product.",
        ],
    },
];

export const ProjectsData: TProject[] = [
    {
        name: "Project Management Dashboard",
        link: "https://example.com/project-management-dashboard",
        bulletPoints: [
            "Designed an intuitive interface for managing tasks and projects.",
            "Implemented advanced filtering and search across multiple datasets.",
            "Integrated third-party tools like (Airwallex)[https://www.airwallex.com/] for payment processing.",
            "Achieved a 30% reduction in bug reports after redesigning the workflow.",
        ],
    },
    {
        name: "E-Commerce Storefront",
        link: "https://example.com/ecommerce-storefront",
        bulletPoints: [
            "Developed a responsive e-commerce platform with real-time inventory updates.",
            "Integrated payment gateways like (Paystack)[https://paystack.com/].",
            "Built a role-based access control system for admin and customer accounts.",
            "Enhanced user retention by 20% with personalized product recommendations.",
        ],
    },
    {
        name: "Crypto Wallet App",
        link: "https://example.com/crypto-wallet",
        bulletPoints: [
            "Created a cross-platform crypto wallet using (React Native)[https://reactnative.dev/].",
            "Integrated secure authentication with (Firebase)[https://firebase.google.com/].",
            "Developed a feature to track cryptocurrency prices in real-time.",
            "Improved user acquisition by 25% through streamlined onboarding processes.",
        ],
    },
    {
        name: "HR Services Platform",
        link: "https://example.com/hr-services-platform",
        bulletPoints: [
            "Built a platform for managing employee records and payroll processing.",
            "Added advanced reporting capabilities with dynamic data visualizations.",
            "Implemented multi-factor authentication to enhance platform security.",
            "Boosted client satisfaction by 35% with faster data retrieval speeds.",
        ],
    },
    {
        name: "No-Code Website Builder",
        link: "https://example.com/no-code-builder",
        bulletPoints: [
            "Developed drag-and-drop functionality for building responsive websites.",
            "Integrated pre-designed templates for faster deployment.",
            "Increased user base by 20% through targeted feature updates.",
            "Added live preview functionality for seamless design iterations.",
        ],
    },
];

export const EducationData: TEducation[] = [
    {
        schoolName: "Massachusetts Institute of Technology (MIT)",
        degree: "Master of Science",
        major: "Computer Science and Engineering",
        isOngoing: true,
        startDate: "",
        location: "Cambridge, MA, USA",
        bulletPoints: [
            "Conducted research on scalable distributed systems and published 2 papers in peer-reviewed journals.",
            "Completed coursework in advanced algorithms, machine learning, and data-intensive systems.",
            "Collaborated on a capstone project involving real-time analytics for IoT devices.",
        ],
    },
    {
        schoolName: "University of California, Berkeley",
        degree: "Bachelor of Science",
        major: "Electrical Engineering and Computer Science",
        location: "Berkeley, CA, USA",

        isOngoing: true,
        startDate: "",
        bulletPoints: [
            "Graduated with honors (3.8 GPA) and received the Dean’s List recognition for 4 semesters.",
            "Developed a web application for automated tutoring scheduling during a team-based software engineering course.",
            "Served as a teaching assistant for Introduction to Computer Programming, mentoring over 100 students.",
        ],
    },
    {
        schoolName: "Stanford University",
        degree: "Certificate Program",
        major: "Artificial Intelligence",

        isOngoing: true,
        startDate: "",
        location: "Stanford, CA, USA",
        bulletPoints: [
            "Completed a specialized program focusing on deep learning and reinforcement learning.",
            "Designed and implemented a neural network to classify medical images with 92% accuracy.",
            "Engaged in a group project that explored ethical implications of AI in autonomous vehicles.",
        ],
    },
];

export const SkillsData: TSkill[] = [
    {
        category: "Programming Languages",
        items: ["TypeScript", "JavaScript", "Python", "C#", "Java"],
    },
    {
        category: "Frontend Development",
        items: [
            "React",
            "Next.js",
            "Angular",
            "Redux",
            "HTML",
            "CSS",
            "Tailwind CSS",
        ],
    },
    {
        category: "Backend Development",
        items: [
            "ASP.NET Core",
            "Node.js",
            "Express",
            "Django",
            "GraphQL",
            "REST APIs",
        ],
    },
    {
        category: "Databases",
        items: ["PostgreSQL", "MySQL", "MongoDB", "SQLite", "Redis"],
    },
    {
        category: "DevOps & Tools",
        items: [
            "Docker",
            "Kubernetes",
            "Git",
            "CI/CD Pipelines",
            "AWS",
            "Azure",
            "Jenkins",
        ],
    },
    {
        category: "Testing",
        items: ["Jest", "Cypress", "Mocha", "Chai", "Playwright"],
    },
    {
        category: "Project Management & Collaboration",
        items: ["JIRA", "Trello", "Slack", "Asana"],
    },
];
