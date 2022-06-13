import React, { useEffect } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

function App(props) {
	const ref = React.useRef();
	const [info, setInfo] = React.useState("INFO");
	const [videoSize, setVideoSize] = React.useState(true);
	const [imageDetails, setImageDetails] = React.useState({ aspectRatio: "0", maxWidth: "0", maxHeight: "0" });

	useEffect(() => {
		if (info === "DOWNLOADED" || info === "ERROR") {
			setTimeout(() => {
				setInfo("Click to download");
			}, 3000);
		}
	}, [info]);

	function handleTakePhoto(dataUri) {
		setInfo("DOWNLOADING....");
		try {
			//download image from dataUri
			navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "user",
				},
			});
			navigator.mediaDevices.enumerateDevices().then((devices) => {
				let camera = null;
				devices.forEach((device) => {
					if (device.kind === "videoinput") {
						camera = device;
					}
				});
				let { width, height, aspectRatio } = camera.getCapabilities();
				// let maxWidth = camera.getCapabilities().width.max
				// let maxHeight = camera.getCapabilities().height.max;

				let maxWidth = width.max;
				let maxHeight = height.max;
				let deviceAspectRatio = aspectRatio.max;

				if (deviceAspectRatio === maxWidth) {
					[maxWidth, maxHeight] = [maxHeight, maxWidth];
				}

				setImageDetails({
					aspectRatio: deviceAspectRatio,
					maxWidth: maxWidth,
					maxHeight: maxHeight,
				});

				let videoParams = {
					video: {
						facingMode: { exact: "user" },
					},
				};

				if (videoSize) {
					videoParams = {
						video: {
							width: { ideal: maxWidth },
							height: { ideal: maxHeight },
							facingMode: { exact: "user" },
						},
					};
				}

				console.log(videoParams);

				navigator.mediaDevices.getUserMedia(videoParams).then((stream) => {
					let video = document.createElement("video");
					video.srcObject = stream;
					video.play();
					console.log("PLaying video");
					video.onplaying = () => {
						let canvas = document.createElement("canvas");
						let ctx = canvas.getContext("2d");
						canvas.width = maxWidth;
						canvas.height = maxHeight;
						ctx.drawImage(video, 0, 0, maxWidth, maxHeight);
						let dataURL = canvas.toDataURL("image/png");
						let a = document.createElement("a");
						a.href = dataURL;
						a.download = `${Date.now()}.png`;
						a.click();
						setInfo("Downloaded");
						setImageDetails({ aspectRatio: "0", maxWidth: "0", maxHeight: "0" });
					};
				});
			});
		} catch (e) {
			setInfo("ERROR");
		}
	}
	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Camera
				onTakePhoto={(dataUri) => {
					handleTakePhoto(dataUri);
				}}
			/>
			<h3>{info}</h3>
			<button onClick={() => setVideoSize(!videoSize)}>{videoSize ? "MAX SIZE" : "DEFAULT SIZE"}</button>
			<h2>Aspect Ratio: {imageDetails.aspectRatio}</h2>
			<h2>Max Width: {imageDetails.maxWidth}</h2>
			<h2>Max Height: {imageDetails.maxHeight}</h2>
		</div>
	);
}

export default App;
