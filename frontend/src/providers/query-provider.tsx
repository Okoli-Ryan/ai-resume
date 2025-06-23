"use client";

import { useState } from 'react';

import { queryClientConfig } from '@/lib/query-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient(queryClientConfig));

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default ReactQueryProvider;
