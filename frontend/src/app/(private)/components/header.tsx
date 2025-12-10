import { Button } from "@/components/ui/button";
import { FileText, LogOut, Menu, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes";
interface HeaderProps {
	onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
	const session = useSession();
	const router = useRouter();

	const handleLogout = async () => {
		await signOut({ redirect: false });
		router.push(Routes.signIn);
	};

	return (
		<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
			<div className="mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					{/* Left side - Logo and Mobile Menu */}
					<div className="flex items-center gap-x-4">
						{/* Mobile Menu Button */}
						<Button variant="ghost" size="sm" onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-700 p-2 md:hidden flex">
							<Menu className="w-5 h-5" />
						</Button>

						{/* Logo */}
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
								<FileText className="w-5 h-5 text-primary-foreground" />
							</div>
							<span className="text-2xl font-bold text-gray-800 hidden sm:block">I-CV</span>
						</div>
					</div>

					{/* Right side - User Info and Logout */}
					<div className="flex items-center space-x-4">
						{/* User Info */}
						<div className="flex items-center space-x-3">
							<div className="hidden sm:block text-right">
								<p className="text-sm font-medium text-gray-800">{session?.data?.user?.name}</p>
								<p className="text-xs text-gray-500">{session?.data?.user?.email}</p>
							</div>
							<div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
								<User className="w-4 h-4 text-primary" />
							</div>
						</div>

						{/* Logout Button */}
						<Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2">
							<LogOut className="w-4 h-4" />
							<span className="hidden sm:block ml-2 font-medium">Logout</span>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
