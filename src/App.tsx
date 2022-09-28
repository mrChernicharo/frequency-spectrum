import { type Component, createMemo, For } from 'solid-js';
import {
	rawData,
	trackDuration,
	trackElapsed,
	startFromFile,
} from './audioSource';
import { arc, interpolateSinebow, interpolateInferno } from 'd3';

const arcBuilder = arc();

const RadialGraph: Component<{
	color: (value: number) => string;
	scale: number;
}> = props => {
	const computed = createMemo(() => {
		const data = rawData();

		const total = data.reduce((acc, v) => acc + v, 0);

		const highCount = data.filter(d => d > 32).length;
		const intensity = highCount / data.length;

		const paths: {
			path: string;
			color: string;
		}[] = [];

		const range = 1.0 + intensity;
		const rangeInRadians = range * Math.PI;
		const startAngle = -(rangeInRadians / 2);
		let currAngle = startAngle;

		for (const d of data) {
			const angle = rangeInRadians * (d / total);

			const path = arcBuilder({
				innerRadius: 50 - ((d + 10) / 255) * 35,
				outerRadius: 50 + ((d + 10) / 255) * 35,
				startAngle: currAngle,
				endAngle: currAngle + angle,
			})!;

			paths.push({ path, color: props.color(d / 255) });
			currAngle += angle;
		}

		return { paths, intensity };
	});

	return (
		<g transform={`scale(${computed().intensity * props.scale + 1})`}>
			<For each={computed().paths}>
				{p => <path d={p.path} fill={p.color} />}
			</For>
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
				viewBox="-100 -150 200 200"
				preserveAspectRatio="xMidYMid meet"
			>
				<RadialGraph color={interpolateSinebow} scale={1.5} />
				<RadialGraph color={interpolateInferno} scale={1} />
			</svg>

			<ProgressIndicator />
		</div>
	);
};

export default App;
