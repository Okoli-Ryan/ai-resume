type RowProps = {
	children: React.ReactNode;
};

const Row = ({ children }: RowProps) => {
	return <div className="flex justify-between items-center">{children}</div>;
};

export default Row;
