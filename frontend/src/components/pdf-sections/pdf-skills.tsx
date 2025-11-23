import { Text, View } from '@react-pdf/renderer';
import PDFSection from './pdf-section';
import { TResume } from '@/types/resume';
import { styles } from './pdf-styles';

const PDFSkills = ({ resume }: { resume: Partial<TResume> }) => {
	const skillList = resume?.skills || [];

	if (skillList.length === 0) return null;

	return (
		<PDFSection title="Skills">
			<View>
				{skillList.map((skill) => (
					<View key={skill.id} style={styles.skillItem}>
						<Text>
							<Text style={styles.skillCategory}>{skill.category}:</Text> {skill.skills.split(',').join(', ')}
						</Text>
					</View>
				))}
			</View>
		</PDFSection>
	);
};

export default PDFSkills;
