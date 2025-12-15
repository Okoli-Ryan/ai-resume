import { TResume } from "@/types/resume";

const PersonalInfo = ({ resume }: { resume: Partial<TResume> }) => {
	return (
		<div>
			<h1 className="text-[18px] text-center font-bold font-times">
				{resume?.userName} {resume?.role ? `- ${resume?.role}` : ""}
			</h1>
			<div className="flex justify-center text-center pt-2 font-times text-[10px]">
				<div>
					{resume?.address && (
						<>
							<span>{resume?.address}</span> |
						</>
					)}
					{resume?.phoneNumber && (
						<>
							{" "}
							<a href={`tel:${resume?.phoneNumber}`} className="text-inherit">
								{resume?.phoneNumber}
							</a>{" "}
							|
						</>
					)}
					{resume?.email && (
						<>
							{" "}
							<a href={`mailto:${resume?.email}`} className="text-inherit">
								{resume?.email}
							</a>{" "}
							|
						</>
					)}
					{resume?.linkedinUrl && (
						<>
							{" "}
							<a href={resume?.linkedinUrl} className="text-inherit">
								LinkedIn
							</a>{" "}
							|
						</>
					)}
					{resume?.githubUrl && (
						<>
							{" "}
							<a href={resume?.githubUrl} className="text-inherit">
								Github
							</a>{" "}
							|
						</>
					)}
					{resume?.portfolioUrl && (
						<>
							{" "}
							<a href={resume?.portfolioUrl} className="text-inherit">
								Portfolio
							</a>{" "}
							|
						</>
					)}
					{resume?.links &&
						resume.links.map((link) => (
							<span key={link.id}>
								{" "}
								<a href={link.url} className="text-inherit">
									{link.name}
								</a>{" "}
								|
							</span>
						))}
				</div>
			</div>
		</div>
	);
};

export default PersonalInfo;
