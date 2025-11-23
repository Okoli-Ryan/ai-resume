import { Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import PDFSection from './pdf-section';
import PDFBulletPoint from './pdf-bullet-point';
import { TResume } from '@/types/resume';
import { styles } from './pdf-styles';

const PDFWorkExperience = ({ resume }: { resume: Partial<TResume> }) => {
	const experiences = resume?.workExperience || [];

	if (experiences.length === 0) return null;

	return (
		<PDFSection title="Work Experience">
			<View>
				{experiences.map((experience) => (
					<View key={experience.id} style={styles.itemContainer}>
						<View style={styles.row}>
							<Text style={styles.companyName}>{experience.companyName}</Text>
							<Text style={styles.italic}>{experience.location}</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.italic}>
								{experience.title}
								{experience.workType && ` (${experience.workType})`}
							</Text>
							<Text style={styles.italic}>
								{format(new Date(experience.startDate as string), 'MMM yyyy')} -{' '}
								{experience.isOngoing ? 'Present' : format(new Date(experience.endDate as string), 'MMM yyyy')}
							</Text>
						</View>
						{experience.bulletPoints.length > 0 && (
							<View style={{ marginTop: 2 }}>
								{experience.bulletPoints.map((bulletPoint, idx) => (
									<PDFBulletPoint text={bulletPoint.text} key={idx} />
								))}
							</View>
						)}
					</View>
				))}
			</View>
		</PDFSection>
	);
};

export default PDFWorkExperience;
