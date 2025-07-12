"use client";

import dynamic from 'next/dynamic';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
	ssr: false,
	loading: () => <div>Loading PDF viewer...</div>,
});
export const PDFDownloadLink = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink), {
	ssr: false,
	loading: () => <div>Loading PDF viewer...</div>,
});
export const BlobProvider = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.BlobProvider), {
	ssr: false,
	loading: () => <div>Loading PDF viewer...</div>,
});
