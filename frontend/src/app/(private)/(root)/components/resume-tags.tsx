import { getColorFromText } from '@/lib/utils';

const ResumeTags = ({ tags }: { tags: string | undefined }) => {
	if (!tags?.trim()) return <></>;

	const tagList = tags
		.split(",")
		.map((tag) => tag.trim())
		.filter(Boolean);

	return (
		<div className="flex flex-wrap gap-1 max-w-[12rem]">
			{tagList.map((tag, index) => {
				const colors = getColorFromText(tag);
				return (
					<span key={index} className="text-xs px-2 py-1 rounded-full whitespace-nowrap" style={colors} title={tag}>
						{tag}
					</span>
				);
			})}
		</div>
	);
};

export default ResumeTags
