import { format } from "date-fns";
import Row from "./row";
import Section from "./section";
import { TResume } from "@/types/resume";
import BulletPoint from "./bullet-point";

const WorkExperience = ({ resume }: { resume: Partial<TResume> }) => {
	const experiences = resume?.workExperience || [];

	if (experiences.length === 0) return null;

	return (
		<div>
			<Section title="Work Experience">
				<div className="flex flex-col gap-1">
					{experiences.map((experience) => (
						<div className="flex flex-col gap-[3px] break-inside-avoid" key={experience.id}>
							<div>
								<Row>
									<span className="font-bold font-times text-[10px]">
										<span className="uppercase">{experience.companyName}</span>{" "}
									</span>
									<span className="italic font-times text-[10px]">{experience.location}</span>
								</Row>
								<Row>
									<span className="italic font-times text-[10px]">
										{experience.title} {experience.workType && <span>({experience.workType})</span>}
									</span>
									<span className="italic font-times text-[10px]">
										{format(new Date(experience.startDate as string), "MMM yyyy")} -{" "}
										{experience.isOngoing ? "Present" : format(new Date(experience.endDate as string), "MMM yyyy")}
									</span>
								</Row>
							</div>

							{experience.bulletPoints.length > 0 && (
								<div className="mt-[2px] flex flex-col">
									{experience.bulletPoints.map((bulletPoint, index) => (
										<BulletPoint text={bulletPoint.text} key={index} />
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</Section>
		</div>
	);
};

export default WorkExperience;
