"use client";

import dynamic from 'next/dynamic';

export const BlobProvider = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.BlobProvider), {
	ssr: false,
	loading: () => <div>Loading PDF viewer...</div>,
});
