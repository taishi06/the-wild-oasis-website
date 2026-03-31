// for client components, remember to use "use client" on top of the file for interactivity
'use client';

import { useState } from 'react';

export default function Counter() {
	const [count, setCount] = useState(0);

	return (
		<button onClick={() => setCount((count) => count + 1)}>{count}</button>
	);
}
