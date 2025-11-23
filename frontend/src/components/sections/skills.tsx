import Section from "./section";
import { TResume } from "@/types/resume";

const Skills = ({ resume }: { resume: Partial<TResume> }) => {
	const skillList = resume?.skills || [];

	if (skillList.length === 0) return null;

	return (
		<div className="break-inside-avoid">
			<Section title="Skills">
				<div className="flex flex-col gap-1">
					{skillList.map((skill) => (
						<div key={skill.id} className="font-times text-[10px] leading-tight">
							<span className="uppercase font-bold">{skill.category}:</span> {skill.skills.split(",").join(", ")}
						</div>
					))}
				</div>
			</Section>
		</div>
	);
};

export default Skills;
