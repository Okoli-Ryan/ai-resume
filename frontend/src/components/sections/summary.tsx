import Section from '@/components/section';
import { HtmlToPdfText } from '@/lib/react-pdf';
import { TResume } from "@/types/resume";
import { View } from "@react-pdf/renderer";

const Summary = ({ resume }: { resume: Partial<TResume> }) => {
	const summary = resume.summary;

	if (!summary) return null;

	return (
		<View>
			<Section title="Summary">
				<HtmlToPdfText html={summary} />
			</Section>
		</View>
	);
};

export default Summary;
