import { FileText } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
	title: string;
	children?: ReactNode;
}

export default function EmptyState({ title, children }: EmptyStateProps) {
	return (
		<div className="text-center py-12">
			<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
				<FileText className="w-12 h-12 text-gray-400" />
			</div>
			<h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
			{children && <div className="mt-4">{children}</div>}
		</div>
	);
}
