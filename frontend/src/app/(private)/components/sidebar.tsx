import { Routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export const MenuItems = [
	{
		icon: LayoutDashboard,
		label: "Dashboard",
		href: Routes.dashboard,
		active: true,
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
								<Link href={item.href}>
									<button
										className={cn(
											"flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-left transition-colors",
											item.active ? "text-primary bg-primary/10" : "text-gray-600 hover:text-primary hover:bg-primary/10"
										)}>
										<Icon className="w-4 h-4" />
										<span className="font-medium">{item.label}</span>
									</button>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</div>
	);
}
