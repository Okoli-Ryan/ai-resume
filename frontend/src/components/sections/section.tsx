type SectionProps = {
	title: string;
	children: React.ReactNode;
};

const Section = ({ title, children }: SectionProps) => {
	return (
		<div className="mt-1 page-break-inside-avoid">
			<h2 className="text-[10px] uppercase font-bold font-times">{title}</h2>
			<div className="w-full bg-black h-[1px] mb-[6px]"></div>
			{children}
		</div>
	);
};

export default Section;
