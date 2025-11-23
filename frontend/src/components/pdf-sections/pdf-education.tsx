import { Text, View } from '@react-pdf/renderer';
import { format } from 'date-fns';
import PDFSection from './pdf-section';
import PDFBulletPoint from './pdf-bullet-point';
import { TResume } from '@/types/resume';
import { styles } from './pdf-styles';

const PDFEducation = ({ resume }: { resume: Partial<TResume> }) => {
	const educationList = resume?.education || [];

	if (educationList.length === 0) return null;

	return (
		<PDFSection title="Education">
			<View>
				{educationList.map((education) => (
					<View key={education.id} style={styles.itemContainer}>
						<View style={styles.row}>
							<Text style={styles.companyName}>{education.schoolName}</Text>
							<Text style={styles.italic}>
								{format(new Date(education.startDate as string), 'MMM yyyy')} -{' '}
								{education.isOngoing ? 'Present' : format(new Date(education.endDate as string), 'MMM yyyy')}
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.italic}>
								{education.degree}
								{education.fieldOfStudy && ` in ${education.fieldOfStudy}`}
							</Text>
							<Text style={styles.italic}>{education.location}</Text>
						</View>
						{education.bulletPoints.length > 0 && (
							<View style={{ marginTop: 4 }}>
								{education.bulletPoints.map((bulletPoint, idx) => (
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

export default PDFEducation;
