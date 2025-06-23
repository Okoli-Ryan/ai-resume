"use client";

import { Fragment, useState } from 'react';

import { ResumeFormSections } from '@/lib/react-pdf';

const CreateProfile = () => {
	const [currentStep, setCurrentStep] = useState(0);

	// function onSubmit() {

	// }

	return (
		<div className="w-full max-w-6xl mx-auto py-12 md:py-16 grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
			<div className="bg-slate-100/30 rounded-lg p-6 h-max">
				<div className="flex items-center mb-8">
					<div className="flex flex-col space-y-4">
						{ResumeFormSections.map((section, index) => (
							<button
								onClick={() => setCurrentStep(index)}
								key={section.displayName}
								className={`rounded-lg w-max px-4 py-2 flex justify-center font-medium ${
									currentStep === index
										? "bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-700"
										: "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white"
								}`}>
								{section.displayName}
							</button>
						))}
					</div>
				</div>
			</div>
			{ResumeFormSections.map((FormSection, index) => (
				<Fragment key={FormSection.displayName}>
					<div className="bg-white dark:bg-gray-900 rounded-lg p-6" style={{ display: index === currentStep ? "block" : "none" }}>
						<h4 className="text-gray-700 text-4xl font-bold mb-8">{FormSection.displayName}</h4>
						{/* <FormSection /> */}
					</div>
				</Fragment>
			))}
		</div>
	);
};

export default CreateProfile;
