"use client";

import NextTopLoader from 'nextjs-toploader';

const TopLoader = () => {
	return (
		<NextTopLoader
			color="#805af5"
			initialPosition={0.08}
			crawlSpeed={200}
			height={3}
			crawl={true}
			showSpinner={false}
			easing="ease"
			speed={200}
			shadow="0 0 10px #2299DD,0 0 5px #2299DD"
			template='<div class="bar" role="bar"><div class="peg"></div></div> 
        <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
			zIndex={1600}
			showAtBottom={false}
		/>
	);
};

export default TopLoader;
