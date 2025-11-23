import { StyleSheet, Font } from '@react-pdf/renderer';

// Register Times New Roman font (similar to font-times used in UI)
// Using built-in Times-Roman for PDF which is equivalent to Times New Roman
Font.register({
	family: 'Times-Roman',
	fonts: [
		{ src: 'Times-Roman' },
		{ src: 'Times-Bold', fontWeight: 'bold' },
		{ src: 'Times-Italic', fontStyle: 'italic' },
		{ src: 'Times-BoldItalic', fontWeight: 'bold', fontStyle: 'italic' },
	]
});

// Create styles that match the HTML/CSS design
export const styles = StyleSheet.create({
	page: {
		fontFamily: 'Times-Roman',
		fontSize: 10,
		paddingTop: 48,
		paddingBottom: 16,
		paddingHorizontal: 64,
		lineHeight: 1.3,
	},
	// Personal Info Section
	name: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 8,
	},
	contactInfo: {
		fontSize: 10,
		textAlign: 'center',
		marginBottom: 4,
		flexDirection: 'row',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},
	contactItem: {
		marginHorizontal: 2,
	},
	link: {
		color: '#0000EE',
		textDecoration: 'none',
	},
	// Section Headers
	sectionTitle: {
		fontSize: 10,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		marginTop: 8,
		marginBottom: 2,
	},
	sectionDivider: {
		borderBottomWidth: 1,
		borderBottomColor: '#000',
		marginBottom: 6,
	},
	// Content sections
	contentSection: {
		marginBottom: 4,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	bold: {
		fontWeight: 'bold',
	},
	italic: {
		fontStyle: 'italic',
	},
	uppercase: {
		textTransform: 'uppercase',
	},
	// Bullet points
	bulletContainer: {
		flexDirection: 'row',
		marginBottom: 2,
		marginTop: 2,
	},
	bullet: {
		width: 3,
		height: 3,
		borderRadius: 1.5,
		backgroundColor: '#000',
		marginRight: 4,
		marginTop: 3,
	},
	bulletText: {
		flex: 1,
		fontSize: 10,
		lineHeight: 1.3,
	},
	// Summary section
	summaryText: {
		fontSize: 10,
		lineHeight: 1.3,
	},
	// Skills section
	skillItem: {
		marginBottom: 4,
		fontSize: 10,
		lineHeight: 1.3,
	},
	skillCategory: {
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	// Work Experience / Education / Projects
	itemContainer: {
		marginBottom: 6,
	},
	companyName: {
		fontWeight: 'bold',
		textTransform: 'uppercase',
		fontSize: 10,
	},
	projectLink: {
		color: '#2563eb',
		textDecoration: 'underline',
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	// Spacing utilities
	marginTop1: {
		marginTop: 4,
	},
	marginTop2: {
		marginTop: 8,
	},
	gap1: {
		marginBottom: 4,
	},
});
