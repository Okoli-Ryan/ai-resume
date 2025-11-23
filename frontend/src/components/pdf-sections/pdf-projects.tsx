import { Text, View, Link } from '@react-pdf/renderer';
import PDFSection from './pdf-section';
import PDFBulletPoint from './pdf-bullet-point';
import { TResume } from '@/types/resume';
import { styles } from './pdf-styles';
import { isValidLink } from '@/lib/utils';

const PDFProjects = ({ resume }: { resume: Partial<TResume> }) => {
	const projects = resume?.projects || [];

	if (projects.length === 0) return null;

	return (
		<PDFSection title="Projects">
			<View>
				{projects.map((project) => (
					<View key={project.id} style={styles.itemContainer}>
						<View style={styles.row}>
							{project.link && isValidLink(project.link) ? (
								<Link src={project.link} style={styles.projectLink}>
									{project.name}
								</Link>
							) : (
								<Text style={styles.companyName}>{project.name}</Text>
							)}
						</View>
						{project.bulletPoints.length > 0 && (
							<View style={{ marginTop: 4 }}>
								{project.bulletPoints.map((bulletPoint, idx) => (
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

export default PDFProjects;
