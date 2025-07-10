import { format } from 'date-fns';

import Row from '@/components/row';
import Section from '@/components/section';
import { GlobalStyles } from '@/lib/react-pdf';
import { TResume } from '@/types/resume';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

import BulletPoint from './bullet-point';

const WorkExperience = ({ resume }: { resume: Partial<TResume> }) => {
	const experiences = resume?.workExperience || [];

	if (experiences.length === 0) return null;

	return (
		<View>
			<Section title="Work Experience">
				<View style={styles.experienceList}>
					{experiences.map((experience) => (
						<View style={{ gap: 4 }} key={experience.id} wrap={false}>
							<View>
								<Row>
									<Text style={GlobalStyles.bold}>
										<Text style={GlobalStyles.uppercase}>{experience.companyName}</Text>{" "}
									</Text>
									<Text style={GlobalStyles.italic}>{experience.location}</Text>
								</Row>
								<Row>
									<Text style={GlobalStyles.italic}>
										{experience.title} {experience.workType && <Text>({experience.workType})</Text>}
									</Text>
									<Text style={GlobalStyles.italic}>
										{format(new Date(experience.startDate as string), "MMM yyyy")} -{" "}
										{experience.isOngoing ? "Present" : format(new Date(experience.endDate as string), "MMM yyyy")}
									</Text>
								</Row>
							</View>

							{/* Bullets */}
							{experience.bulletPoints.length > 0 && (
								<View style={{ marginTop: 6 }}>
									{experience.bulletPoints.map((bulletPoint, index) => (
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

export default WorkExperience;
