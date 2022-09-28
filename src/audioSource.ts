import { createSignal } from 'solid-js';

const [rawData, setRawData] = createSignal<number[]>([]);
const [trackDuration, setTrackDuration] = createSignal(0);
const [trackElapsed, setTrackElapsed] = createSignal(0);

export const startFromFile = async () => {
	const res = await fetch('/winter.mp3');
	const byteArray = await res.arrayBuffer();

	const context = new AudioContext();
	const audioBuffer = await context.decodeAudioData(byteArray);

	const source = context.createBufferSource();
	source.buffer = audioBuffer;
	setTrackDuration(source.buffer.duration);

	const analyzer = context.createAnalyser();
	analyzer.fftSize = 512;

	source.connect(analyzer);
	source.connect(context.destination);
	source.start();

	const bufferLength = analyzer.frequencyBinCount;
	const dataArray = new Uint8Array(bufferLength);

	const update = () => {
		analyzer.getByteFrequencyData(dataArray);

		setTrackElapsed(
			(source.context.currentTime / source.buffer?.duration!) * 100
		);
		setRawData(Array.from(dataArray));

		requestAnimationFrame(update);
	};

	requestAnimationFrame(update);
};

export { rawData, trackDuration, trackElapsed };
