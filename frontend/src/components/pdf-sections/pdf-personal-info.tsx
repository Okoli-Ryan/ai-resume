import { Text, View } from '@react-pdf/renderer';
import { TResume } from '@/types/resume';
import { styles } from './pdf-styles';

const PDFPersonalInfo = ({ resume }: { resume: Partial<TResume> }) => {
	const contactItems = [];
	
	if (resume?.address) {
		contactItems.push(resume.address);
	}
	if (resume?.phoneNumber) {
		contactItems.push(resume.phoneNumber);
	}
	if (resume?.email) {
		contactItems.push(resume.email);
	}
	if (resume?.linkedinUrl) {
		contactItems.push('LinkedIn');
	}
	if (resume?.githubUrl) {
		contactItems.push('Github');
	}
	if (resume?.portfolioUrl) {
		contactItems.push('Portfolio');
	}
	
	return (
		<View>
			<Text style={styles.name}>
				{resume?.userName}{resume?.role ? ` - ${resume?.role}` : ''}
			</Text>
			<View style={styles.contactInfo}>
				<Text>
					{contactItems.map((item, index) => (
						<Text key={index}>
							{item}
							{index < contactItems.length - 1 && ' | '}
						</Text>
					))}
				</Text>
			</View>
		</View>
	);
};

export default PDFPersonalInfo;
