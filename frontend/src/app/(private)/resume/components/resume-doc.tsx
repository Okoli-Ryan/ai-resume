"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useResumeStore } from "@/store/resume-store";
import { TResume } from "@/types/resume";
import { BrowserView, MobileView } from "react-device-detect";

import Sidebar from "./sidebar";

const DocumentViewer = dynamic(() => import("./document-viewer").then((mod) => mod.default), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-96">
			<p>Loading PDF viewer...</p>
		</div>
	),
});
const MobileDocumentViewer = dynamic(() => import("./document-viewer").then((mod) => mod.MobileDocumentViewer), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-96">
			<p>Loading PDF viewer...</p>
		</div>
	),
});

const ResumeDoc = ({ resume: initialResume }: { resume?: TResume }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const update = useResumeStore((state) => state.update);

	useEffect(() => {
		if (initialResume) update(initialResume);
		setIsLoaded(true);

		return () => {
			setIsLoaded(false);
		};
	}, [initialResume, update]);

	if (!isLoaded) return null;

	return (
		<div className="w-screen">
			<BrowserView>
				<DocumentViewer />
			</BrowserView>
			<MobileView>
				<MobileDocumentViewer />
			</MobileView>
			<Sidebar />
		</div>
	);
};

export default ResumeDoc;
