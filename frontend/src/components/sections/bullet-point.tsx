const BulletPoint = ({ text }: { text: string }) => {
	return (
		<div className="flex flex-row gap-1 break-inside-avoid">
			<div className="w-1 h-1 rounded-full relative top-[4px] bg-black flex-shrink-0"></div>
			<div className="font-times text-[10px] leading-tight" dangerouslySetInnerHTML={{ __html: text }} />
		</div>
	);
};

export default BulletPoint;
