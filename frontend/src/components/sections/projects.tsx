import Row from '@/components/row';
import Section from '@/components/section';
import { GlobalStyles } from '@/lib/react-pdf';
import { TResume } from '@/types/resume';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';

import BulletPoint from './bullet-point';

const Projects = ({ resume }: { resume: Partial<TResume> }) => {
	const projects = resume?.projects || [];

	if (projects.length === 0) return null;

	return (
		<View>
			<Section title="Projects">
				<View style={styles.experienceList}>
					{projects.map((project) => (
						<View style={{ gap: 4 }} key={project.id}>
							<View>
								<Row>
									<Text style={GlobalStyles.bold}>
										<Text style={GlobalStyles.uppercase}>{project.name}</Text> - <Link style={GlobalStyles.link}>{project.link}</Link>
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
		gap: 16,
	},
});
export default Projects;
