import Section from '@/components/section';
import { GlobalStyles } from '@/lib/react-pdf';
import { TResume } from '@/types/resume';
import { StyleSheet, Text, View } from '@react-pdf/renderer';

const Skills = ({ resume }: { resume: Partial<TResume> }) => {
	const skillList = resume?.skills || [];

	if (skillList.length === 0) return null;

	return (
		<View wrap={false}>
			<Section title="Skills">
				<View style={styles.container}>
					{skillList.map((skill) => (
						<Text key={skill.id} style={GlobalStyles.roman}>
							<Text style={{ ...GlobalStyles.uppercase, ...GlobalStyles.bold }}>{skill.category}:</Text> {skill.skills.split(",").join(", ")}
						</Text>
					))}
				</View>
			</Section>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "column",
		gap: 4,
	},
});

export default Skills;
