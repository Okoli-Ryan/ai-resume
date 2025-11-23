"use client";

import { useResumeStore } from "@/store/resume-store";
import { getDocument, GlobalWorkerOptions, PDFPageProxy } from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import { useEffect, useRef, useState } from "react";
GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

type Props = {
	url: string;
};

export default function PdfCanvasViewer({ url }: Props) {
	const [numPages, setNumPages] = useState(0);
	const canvasRefs = useRef<HTMLCanvasElement[]>([]);
	const pdfInstance = useRef<any>(null);
    const lastUpdated = useResumeStore(state => state.lastUpdated)

	useEffect(() => {
		let isCancelled = false;

		const loadPDF = async () => {
			try {
				const pdf = await getDocument(url).promise;
				if (isCancelled) return;

				pdfInstance.current = pdf;
				setNumPages(pdf.numPages);
			} catch (err) {
				console.error("Error loading PDF:", err);
			}
		};

		loadPDF();

		return () => {
			isCancelled = true;
		};
	}, [url, lastUpdated]);

	useEffect(() => {
		if (!pdfInstance.current || canvasRefs.current.length !== numPages) return;

		const renderPages = async () => {
			for (let i = 1; i <= numPages; i++) {
				const page: PDFPageProxy = await pdfInstance.current.getPage(i);
				const viewport = page.getViewport({ scale: 1.5 });

				const canvas = canvasRefs.current[i - 1];
				if (!canvas) continue;

				const context = canvas.getContext("2d");
				if (!context) continue;

				canvas.width = viewport.width;
				canvas.height = viewport.height;

				await page.render({ canvasContext: context, viewport }).promise;
			}
		};

		renderPages();
	}, [numPages, lastUpdated]);

	return (
		<div key={lastUpdated}>
			{Array.from({ length: numPages }, (_, i) => (
				<canvas
					key={i}
					ref={(el) => {
						if (el) canvasRefs.current[i] = el;
					}}
					style={{ width: "100%", marginBottom: "1rem" }}
				/>
			))}
		</div>
	);
}
