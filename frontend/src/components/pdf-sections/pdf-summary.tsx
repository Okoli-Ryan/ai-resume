import { Text } from '@react-pdf/renderer';
import PDFSection from './pdf-section';
import { TResume } from '@/types/resume';
import { styles } from './pdf-styles';
import { htmlToText } from '@/lib/html-to-text';

const PDFSummary = ({ resume }: { resume: Partial<TResume> }) => {
	const summary = resume.summary;

	if (!summary || summary === '<p></p>') return null;

	const plainSummary = htmlToText(summary);

	return (
		<PDFSection title="Summary">
			<Text style={styles.summaryText}>{plainSummary}</Text>
		</PDFSection>
	);
};

export default PDFSummary;
