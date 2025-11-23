import { format } from "date-fns";
import Row from "./row";
import Section from "./section";
import { TResume } from "@/types/resume";
import BulletPoint from "./bullet-point";

const Education = ({ resume }: { resume: Partial<TResume> }) => {
	const educationList = resume?.education || [];

	if (educationList.length === 0) return null;

	return (
		<div>
			<Section title="Education">
				<div className="flex flex-col gap-1">
					{educationList.map((education) => (
						<div className="flex flex-col gap-[3px] break-inside-avoid" key={education.id}>
							<div>
								<Row>
									<span className="font-bold font-times text-[10px]">
										<span className="uppercase">{education.schoolName}</span>{" "}
									</span>
									<span className="italic font-times text-[10px]">
										{format(new Date(education.startDate as string), "MMM yyyy")} -{" "}
										{education.isOngoing ? "Present" : format(new Date(education.endDate as string), "MMM yyyy")}
									</span>
								</Row>
								<Row>
									<span className="italic font-times text-[10px]">
										{education.degree} {education.fieldOfStudy ? `in ${education.fieldOfStudy}` : ""}
									</span>
									<span className="italic font-times text-[10px]">{education.location}</span>
								</Row>
							</div>

							{education.bulletPoints.length > 0 && (
								<div className="mt-1 flex flex-col">
									{education.bulletPoints.map((bulletPoint, index) => (
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

export default Education;
