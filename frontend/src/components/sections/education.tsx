import { format } from 'date-fns';

import Row from '@/components/row';
import Section from '@/components/section';
import { GlobalStyles } from '@/lib/react-pdf';
import { TResume } from '@/types/resume';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

import BulletPoint from './bullet-point';

const Education = ({ resume }: { resume: Partial<TResume> }) => {
	const educationList = resume?.education || [];

	if (educationList.length === 0) return null;

	return (
		<View>
			<Section title="Education">
				<View style={styles.experienceList}>
					{educationList.map((education) => (
						<View style={{ gap: 4 }} key={education.id}>
							<View>
								<Row>
									<Text style={GlobalStyles.bold}>
										<Text style={GlobalStyles.uppercase}>{education.schoolName}</Text>{" "}
									</Text>
									<Text style={GlobalStyles.italic}>
										{format(new Date(education.startDate as string), "MMM yyyy")} -{" "}
										{education.isOngoing ? "Present" : format(new Date(education.endDate as string), "MMM yyyy")}
									</Text>
								</Row>
								<Row>
									<Text style={GlobalStyles.italic}>
										{education.degree} {education.fieldOfStudy ? `in ${education.fieldOfStudy}` : ""}
									</Text>
									<Text style={GlobalStyles.italic}>{education.location}</Text>
								</Row>
							</View>

							{education.bulletPoints.length > 0 && (
								<View style={{ marginTop: 6 }}>
									{education.bulletPoints.map((bulletPoint, index) => (
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

export default Education;
