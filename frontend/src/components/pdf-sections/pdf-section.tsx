import { Text, View } from '@react-pdf/renderer';
import { styles } from './pdf-styles';

type PDFSectionProps = {
	title: string;
	children: React.ReactNode;
};

const PDFSection = ({ title, children }: PDFSectionProps) => {
	return (
		<View style={styles.contentSection}>
			<Text style={styles.sectionTitle}>{title}</Text>
			<View style={styles.sectionDivider} />
			{children}
		</View>
	);
};

export default PDFSection;
