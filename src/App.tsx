import { type Component, createMemo, For } from 'solid-js';
import { rawData, startFromFile } from './audioSource';
import { arc } from 'd3';

const arcBuilder = arc();

const RadialGraph: Component = () => {
	const paths = createMemo(() => {
		const data = rawData();
		let currAngle = 0;

		const paths: {
			path: string;
			color: string;
		}[] = [];

		for (const d of data) {
			const path = arcBuilder({
				innerRadius: 50 - (d / 255) * 35,
				outerRadius: 50 + (d / 255) * 35,
				startAngle: currAngle,
				endAngle: currAngle + Math.PI * 0.1,
			})!;

			paths.push({ path, color: 'royalblue' });
			currAngle += Math.PI * 0.1;
		}

		return paths;
	});

	return (
		<g>
			<For each={paths()}>{p => <path d={p.path} fill={p.color} />}</For>
		</g>
	);
};

const App: Component = () => {
	return (
		<div
			onClick={startFromFile}
			style={{ width: '100vw', height: '100vh' }}
		>
			{/* {JSON.stringify(rawData(), null, 2)} */}
			<svg
				width="100%"
				height="100%"
				viewBox="-100 -100 200 200"
				preserveAspectRatio="xMidYMid meet"
			>
				<RadialGraph />
			</svg>
		</div>
	);
};

export default App;
