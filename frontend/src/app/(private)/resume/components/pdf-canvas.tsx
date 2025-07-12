'use client';

import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';
import { useEffect, useRef } from 'react';

type Props = {
  url: string;
};

export default function PdfCanvasViewer({ url }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: ReturnType<ReturnType<typeof getDocument>['promise']['then']> | null = null;

    const renderPdf = async () => {
      try {
        const pdf = await getDocument(url).promise;
        if (isCancelled) return;

        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Wait for previous render to finish
        // @ts-expect-error 123
        renderTask = page.render({
          canvasContext: context!,
          viewport,
        });
        // @ts-expect-error 123

        await renderTask.promise;
      } catch (err) {
        if (!isCancelled) console.error('Error rendering PDF:', err);
      }
    };

    renderPdf();

    return () => {
      isCancelled = true;
      if (renderTask) {
                // @ts-expect-error 123

        renderTask.cancel?.();
      }
    };
  }, [url]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />;
}
