import Row from "@/components/row";
import Section from "@/components/section";
import { GlobalStyles } from "@/lib/react-pdf";
import { TResume } from "@/types/resume";
import { Link, StyleSheet, Text, View } from "@react-pdf/renderer";

import { isValidLink } from "@/lib/utils";
import BulletPoint from "./bullet-point";

const Projects = ({ resume }: { resume: Partial<TResume> }) => {
	const projects = resume?.projects || [];

	if (projects.length === 0) return null;

	return (
		<View>
			<Section title="Projects">
				<View style={styles.experienceList}>
					{projects.map((project, index) => (
						<View style={{ display: "flex", flexDirection: "column", marginTop: index === 0 ? 0 : 4 }} key={project.id} wrap={false}>
							<View>
								<Row>
									<Text style={GlobalStyles.bold}>
										{project.link && isValidLink(project.link) ? (
											<Link href={project.link} style={[GlobalStyles.link, GlobalStyles.bold]}>
												{project.name}
											</Link>
										) : (
											<Text style={[GlobalStyles.bold, GlobalStyles.uppercase]}>{project.name}</Text>
										)}
									</Text>
								</Row>
							</View>

							{/* Bullets */}
							{project.bulletPoints.length > 0 && (
								<View style={{ marginTop: 4, display: "flex", flexDirection: "column",}}>
									{project.bulletPoints.map((bulletPoint, index) => (
										<BulletPoint text={bulletPoint.text} key={index} />
									))}
								</View>
							)}
						</View>
					))}
				</View>
			</Section>
		</View>
	);
};

const styles = StyleSheet.create({
	experienceList: {
		display: "flex",
		flexDirection: "column",
		gap: 6,
	},
});
export default Projects;
