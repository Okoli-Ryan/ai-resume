import { StyleSheet, Text, View } from "@react-pdf/renderer";

type SectionProps = {
	title: string;
	children: React.ReactNode;
};
const Section = ({ title, children }: SectionProps) => {
	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			<View style={styles.underline}></View>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		marginTop: 8,
	},
	sectionTitle: {
		fontSize: 10,
		textTransform: "uppercase",
		fontFamily: "Times-Bold",
	},
	underline: {
		width: "100%",
		backgroundColor: "black",
		height: 1,
		marginBottom: 6,
	},
});

export default Section;
