import { cn } from "@/lib/utils";
import { FileText, LayoutDashboard, LayoutTemplate, Settings, User } from "lucide-react";

export const MenuItems = [
	{
		icon: LayoutDashboard,
		label: "Dashboard",
		href: "/",
		active: true,
	},
	{
		icon: FileText,
		label: "My Resumes",
		href: "/resumes",
		active: false,
	},
	{
		icon: LayoutTemplate,
		label: "Templates",
		href: "/templates",
		active: false,
	},
	{
		icon: User,
		label: "Profile",
		href: "/profile",
		active: false,
	},
	{
		icon: Settings,
		label: "Settings",
		href: "/settings",
		active: false,
	},
];

export default function DesktopSidebar() {
	return (
		<div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
			{/* Navigation */}
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
	);
}
