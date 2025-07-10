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
		<View wrap={false}>
			<Section title="Projects">
				<View style={styles.experienceList}>
					{projects.map((project) => (
						<View style={{ gap: 4 }} key={project.id} wrap={false}>
							<View>
								<Row>
									<Text style={GlobalStyles.bold}>
										{project.link && isValidLink(project.link) ? (
											<Link href={project.link} style={[GlobalStyles.link, GlobalStyles.bold]}>
												{project.name}
											</Link>
										) : (
											<Text style={GlobalStyles.bold}>{project.name}</Text>
										)}
									</Text>
								</Row>
							</View>

							{/* Bullets */}
							{project.bulletPoints.length > 0 && (
								<View style={{ marginTop: 4 }}>
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
		gap: 4,
	},
});
export default Projects;
