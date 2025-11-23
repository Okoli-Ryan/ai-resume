import { Text, View } from '@react-pdf/renderer';
import { styles } from './pdf-styles';
import { htmlToText } from '@/lib/html-to-text';

const PDFBulletPoint = ({ text }: { text: string }) => {
	const plainText = htmlToText(text);
	
	return (
		<View style={styles.bulletContainer}>
			<View style={styles.bullet} />
			<Text style={styles.bulletText}>{plainText}</Text>
		</View>
	);
};

export default PDFBulletPoint;
