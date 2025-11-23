import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, X } from "lucide-react";
import { MenuItems } from "./sidebar";

interface MobileSidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
	
	return (
		<>
			{/* Overlay */}
			{isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

			{/* Sidebar */}
			<div
				className={cn(
					"fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden custom-scrollbar",
					isOpen ? "translate-x-0" : "-translate-x-full"
				)}>
				<div className="flex items-center justify-between p-4 border-b">
					<div className="flex items-center space-x-3">
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
							<FileText className="w-4 h-4 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold text-gray-800">I-CV</span>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X className="w-5 h-5" />
					</Button>
				</div>

				<nav className="mt-6">
					<ul className="space-y-2 px-4">
						{MenuItems.map((item) => {
							const Icon = item.icon;
							return (
								<li key={item.label}>
									<button
										className={cn(
											"flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left transition-colors",
											item.active ? "text-primary bg-primary/10" : "text-gray-600 hover:text-primary hover:bg-primary/10"
										)}>
										<Icon className="w-4 h-4" />
										<span className="font-medium">{item.label}</span>
									</button>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</>
	);
}
