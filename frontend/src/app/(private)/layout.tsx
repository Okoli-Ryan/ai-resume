"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import Header from "./components/header";
import MobileSidebar from "./components/mobile-sidebar";
import DesktopSidebar from "./components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false)

	return (
		<div className="min-h-screen bg-gray-50">
			<Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

			<div className="flex flex-1 w-screen overflow-x-hidden">
				{/* Desktop Sidebar */}
				<div className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] z-10">
					<DesktopSidebar />
				</div>
				<div className="block md:hidden">
					<MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				</div>

				<div className={cn("flex-1 transition-all duration-300 pl-0 md:pl-64 w-full")}>
					<main className="max-w-7xl mx-auto container">{children}</main>
				</div>
			</div>
		</div>
	);
};

export default DashboardLayout;
