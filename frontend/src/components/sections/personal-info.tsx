import { TResume } from "@/types/resume";
import { Link, StyleSheet, Text, View } from "@react-pdf/renderer";

const PersonalInfo = ({ resume }: { resume: Partial<TResume> }) => {
	return (
		<View>
			<>
				<Text style={[styles.headerText, { fontFamily: "Times-Bold" }]}>
					{resume?.userName} {resume?.role ? `- ${resume?.role}` : ""}
				</Text>
				<View style={styles.personalInfo}>
					<Text>
						{resume?.address ? (
							<>
								<Text style={styles.personalInfoText}>{resume?.address}</Text> |
							</>
						) : (
							""
						)}

						{resume?.phoneNumber ? (
							<>
								<Text>
									{" "}
									<Link src={`tel:${resume?.phoneNumber}`} style={styles.personalInfoText}>
										{resume?.phoneNumber}
									</Link>{" "}
								</Text>
								|
							</>
						) : (
							""
						)}
						{resume?.email ? (
							<>
								<Text>
									{" "}
									<Link src={`mailto:${resume?.email}`} style={styles.personalInfoText}>
										{resume?.email}
									</Link>{" "}
								</Text>
								|
							</>
						) : (
							""
						)}
						{resume?.linkedinUrl ? (
							<>
								{" "}
								<Text>
									{" "}
									<Link src={resume?.linkedinUrl} style={styles.personalInfoText}>
										LinkedIn
									</Link>{" "}
								</Text>
								|
							</>
						) : (
							""
						)}
						{resume?.githubUrl ? (
							<>
								<Text>
									{" "}
									<Link src={resume?.githubUrl} style={styles.personalInfoText}>
										Github
									</Link>{" "}
								</Text>
								|
							</>
						) : (
							""
						)}
						{resume?.portfolioUrl ? (
							<>
								<Text>
									{" "}
									<Link src={resume?.portfolioUrl} style={styles.personalInfoText}>
										Portfolio
									</Link>{" "}
								</Text>
								|
							</>
						) : (
							""
						)}
					</Text>
				</View>
			</>
		</View>
	);
};

const styles = StyleSheet.create({
	personalInfo: {
		justifyContent: "center",
		textAlign: "center",
		paddingTop: 8,
		marginBottom: 4,
		fontFamily: "Times-Roman",
	},
	personalInfoText: {
		fontFamily: "Times-Roman",
	},
	headerText: {
		fontFamily: "Times-Roman",
		fontSize: 18,
		textAlign: "center",
		fontWeight: 700,
	},
});

export default PersonalInfo;
