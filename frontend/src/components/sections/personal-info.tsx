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
							<span className="font-times">{resume?.address}</span> |
						</>
					)}
					{resume?.phoneNumber && (
						<>
							{" "}
							<a href={`tel:${resume?.phoneNumber}`} className="font-times text-blue-500">
								{resume?.phoneNumber}
							</a>{" "}
							|
						</>
					)}
					{resume?.email && (
						<>
							{" "}
							<a href={`mailto:${resume?.email}`} className="font-times text-blue-500">
								{resume?.email}
							</a>{" "}
							|
						</>
					)}
					{resume?.linkedinUrl && (
						<>
							{" "}
							<a href={resume?.linkedinUrl} className="font-times text-blue-500">
								LinkedIn
							</a>{" "}
							|
						</>
					)}
					{resume?.githubUrl && (
						<>
							{" "}
							<a href={resume?.githubUrl} className="font-times text-blue-500">
								Github
							</a>{" "}
							|
						</>
					)}
					{resume?.portfolioUrl && (
						<>
							{" "}
							<a href={resume?.portfolioUrl} className="font-times text-blue-500">
								Portfolio
							</a>{" "}
							|
						</>
					)}
					{resume?.links &&
						resume.links.map((link) => (
							<span key={link.id}>
								{" "}
								<a href={link.url} className="font-times text-blue-500">
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
