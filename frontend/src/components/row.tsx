import React from "react";

import { StyleSheet, View } from "@react-pdf/renderer";

type RowProps = {
	children: React.ReactNode;
};

const Row = ({ children }: RowProps) => {
	return <View style={styles.row}>{children}</View>;
};

const styles = StyleSheet.create({
	row: {
		display: "flex",
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
	},
});

export default Row;
