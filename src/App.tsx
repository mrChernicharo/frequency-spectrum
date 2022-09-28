import { type Component, createMemo, For } from 'solid-js';
import {
	rawData,
	trackDuration,
	trackElapsed,
	startFromFile,
} from './audioSource';
import { arc, interpolateSinebow, interpolateInferno } from 'd3';

const arcBuilder = arc();

const RadialGraph: Component = () => {
	const paths = createMemo(() => {
		const data = rawData();

		const paths: {
			path: string;
			color: string;
		}[] = [];

		const range = 1.8;
		const rangeInRadians = range * Math.PI;
		const startAngle = -(rangeInRadians / 2);
		const angle = rangeInRadians / data.length;
		let currAngle = startAngle;

		for (const d of data) {
			const path = arcBuilder({
				innerRadius: 50 - ((d + 10) / 255) * 35,
				outerRadius: 50 + ((d + 10) / 255) * 35,
				startAngle: currAngle,
				endAngle: currAngle + angle,
			})!;

			paths.push({ path, color: interpolateSinebow(d / 255) });
			currAngle += angle;
		}

		return paths;
	});

	return (
		<g>
			<For each={paths()}>{p => <path d={p.path} fill={p.color} />}</For>
		</g>
	);
};

const ProgressIndicator: Component = () => {
	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				width: '100vw',
				background: 'black',
				height: '10px',
			}}
		>
			<div
				style={{
					width: `${trackElapsed()}%`,
					background: '#0f4',
					height: '100%',
				}}
			></div>
		</div>
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

			<ProgressIndicator />
		</div>
	);
};

export default App;
