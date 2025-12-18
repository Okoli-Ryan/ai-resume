import { Text, View, Link } from '@react-pdf/renderer';
import { format } from 'date-fns';
import PDFSection from './pdf-section';
import PDFBulletPoint from './pdf-bullet-point';
import { TResume } from '@/types/resume';
import { styles } from './pdf-styles';

const PDFCertifications = ({ resume }: { resume: Partial<TResume> }) => {
	const certificationsList = resume?.certifications || [];

	if (certificationsList.length === 0) return null;

	return (
		<PDFSection title="Certifications">
			<View>
				{certificationsList.map((certification) => (
					<View key={certification.id} style={styles.itemContainer}>
						<View style={styles.row}>
							{certification.certificateLink ? (
								<Link src={certification.certificateLink} style={[styles.companyName, { color: '#0066cc' }]}>
									{certification.certificationName}
								</Link>
							) : (
								<Text style={styles.companyName}>{certification.certificationName}</Text>
							)}
							<Text style={styles.italic}>
								{certification.dateAttained ? format(new Date(certification.dateAttained), 'MMM yyyy') : ''}
							</Text>
						</View>
						{certification.bulletPoints.length > 0 && (
							<View style={{ marginTop: 4 }}>
								{certification.bulletPoints.map((bulletPoint, idx) => (
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

export default PDFCertifications;
