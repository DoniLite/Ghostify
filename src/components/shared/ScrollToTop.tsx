import { useEffect } from 'react';

const ScrollToTop = () => {

	useEffect(() => {
		globalThis.scrollTo(0, 0);
	}, []);

	return null;
};

export default ScrollToTop;
