import { toast } from 'sonner';

import { QueryCache } from '@tanstack/react-query';

export const queryClientConfig = {
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			staleTime: 1000 * 60,
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			console.log(error);
			toast.error(error.message);
		},
	}),
};
