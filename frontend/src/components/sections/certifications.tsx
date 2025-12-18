import { format } from "date-fns";
import Row from "./row";
import Section from "./section";
import { TResume } from "@/types/resume";
import BulletPoint from "./bullet-point";

const Certifications = ({ resume }: { resume: Partial<TResume> }) => {
	const certificationsList = resume?.certifications || [];

	if (certificationsList.length === 0) return null;

	return (
		<div>
			<Section title="Certifications">
				<div className="flex flex-col gap-1">
					{certificationsList.map((certification) => (
						<div className="flex flex-col gap-[3px] break-inside-avoid" key={certification.id}>
							<div>
								<Row>
									{certification.certificateLink ? (
										<a 
											href={certification.certificateLink} 
											target="_blank" 
											rel="noopener noreferrer"
											className="font-bold font-times text-[10px] text-blue-600 hover:underline"
										>
											<span className="uppercase">{certification.certificationName}</span>
										</a>
									) : (
										<span className="font-bold font-times text-[10px]">
											<span className="uppercase">{certification.certificationName}</span>
										</span>
									)}
									<span className="italic font-times text-[10px]">
										{certification.dateAttained ? format(new Date(certification.dateAttained), "MMM yyyy") : ""}
									</span>
								</Row>
							</div>

							{certification.bulletPoints.length > 0 && (
								<div className="mt-1 flex flex-col">
									{certification.bulletPoints.map((bulletPoint, index) => (
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

export default Certifications;
