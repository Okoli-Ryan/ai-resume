"use client";
import 'react-quill-new/dist/quill.snow.css';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ReactQuillNew = dynamic(() => import("react-quill-new"), { ssr: false });

type RQProps = React.ComponentProps<typeof ReactQuillNew>;

export const ReactQuill = (props: RQProps) => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ReactQuillNew {...props} />
		</Suspense>
	);
};
