import Row from "./row";
import Section from "./section";
import { TResume } from "@/types/resume";
import { isValidLink } from "@/lib/utils";
import BulletPoint from "./bullet-point";

const Projects = ({ resume }: { resume: Partial<TResume> }) => {
	const projects = resume?.projects || [];

	if (projects.length === 0) return null;

	return (
		<div>
			<Section title="Projects">
				<div className="flex flex-col gap-[6px]">
					{projects.map((project, index) => (
						<div className="flex flex-col break-inside-avoid" key={project.id} style={{ marginTop: index === 0 ? 0 : 4 }}>
							<div>
								<Row>
									<span className="font-bold font-times text-[10px]">
										{project.link && isValidLink(project.link) ? (
											<a href={project.link} className="text-blue-600 underline uppercase font-bold">
												{project.name}
											</a>
										) : (
											<span className="uppercase font-bold">{project.name}</span>
										)}
									</span>
								</Row>
							</div>

							{project.bulletPoints.length > 0 && (
								<div className="mt-1 flex flex-col">
									{project.bulletPoints.map((bulletPoint, index) => (
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

export default Projects;
