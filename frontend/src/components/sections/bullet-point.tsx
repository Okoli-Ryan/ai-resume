import { HtmlToPdfText } from "@/lib/react-pdf";
import { StyleSheet, View } from "@react-pdf/renderer";

const BulletPoint = ({ text }: { text: string }) => {
	return (
		<View wrap={false} style={styles.bulletPoint}>
			<View style={styles.bullet}></View>
			<HtmlToPdfText html={text} />
		</View>
	);
};

const styles = StyleSheet.create({
	bulletPoint: {
		display: "flex",
		flexDirection: "row",
		gap: 4,
	},
	bullet: {
		width: 4,
		height: 4,
		borderRadius: 99999,
		position: "relative",
		top: 4,
		backgroundColor: "black",
	},
});

export default BulletPoint;
