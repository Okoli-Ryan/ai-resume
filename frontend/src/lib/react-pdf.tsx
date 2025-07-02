import { parseDocument } from 'htmlparser2';

import EducationForm from '@/components/edit-form/education-form/education-form';
import PersonalInfoForm from '@/components/edit-form/personal-info/personal-info-form';
import ProjectForm from '@/components/edit-form/projects-form/projects-form';
import ResumeInfoForm from '@/components/edit-form/resume-info-form/resume-info-form';
import SkillsForm from '@/components/edit-form/skills-form/skills-form';
import WorkExperienceForm from '@/components/edit-form/work-experience-form/work-experience-form';
import { Link, StyleSheet, Text } from '@react-pdf/renderer';

export const GlobalStyles = StyleSheet.create({
	link: {
		color: "blue",
		fontFamily: "Times-Roman",
	},
	italic: {
		fontFamily: "Times-Italic",
	},
	bold: {
		fontFamily: "Times-Bold",
	},
	uppercase: {
		textTransform: "uppercase",
	},
    roman: {
        fontFamily: "Times-Roman",
        lineHeight: .8
    }
});

const renderNode = (node: any, index: number = 0): any => {
	if (node.type === "text") {
		return <Text key={index}>{node.data}</Text>;
	}

	if (node.type === "tag") {
		const children = (node.children || []).map((child: any, i: number) => renderNode(child, i));

		switch (node.name) {
			case "strong":
			case "b":
				return (
					<Text key={index} style={{ fontWeight: "bold", ...GlobalStyles.roman }}>
						{children}
					</Text>
				);
			case "em":
			case "i":
				return (
					<Text key={index} style={{ ...GlobalStyles.italic }}>
						{children}
					</Text>
				);
			case "u":
				return (
					<Text key={index} style={{ textDecoration: "underline", ...GlobalStyles.roman }}>
						{children}
					</Text>
				);
			case "a":
				return (
					<Link key={index} src={node.attribs.href} style={{ color: "blue", textDecoration: "underline",...GlobalStyles.roman }}>
						{children}
					</Link>
				);
			case "p":
				return (
					<Text key={index} style={{ marginBottom: 6, ...GlobalStyles.roman }}>
						{children}
					</Text>
				);
			case "br":
				return <Text key={index}>{"\n"}</Text>;
			default:
				return children;
		}
	}

	return null;
};
export const ResumeFormSections = [ResumeInfoForm, PersonalInfoForm, WorkExperienceForm, ProjectForm, EducationForm, SkillsForm];

export const HtmlToPdfText = ({ html }: { html: string }) => {
	const dom = parseDocument(html).children;
	return <>{dom.map((node, i) => renderNode(node, i))}</>;
};
