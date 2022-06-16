import React, { useEffect } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";

function App(props) {
	const handleTakePhoto = () => {
		//get image and save to loacal
		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: { ideal: 99999 },
					height: { ideal: 99999 },
				},
			})
			.then((stream) => {
				alert("Got the stream");
				let [track] = stream.getTracks();
				let capabilties = track.getCapabilities();
				alert("Got capibilties");
				console.log(capabilties);
				let maxWidth = capabilties.width.max;
				let maxHeight = capabilties.height.max;
				alert("maxWidth: " + maxWidth + " maxHeight: " + maxHeight);

				navigator.mediaDevices
					.getUserMedia({
						video: {
							width: { ideal: maxWidth },
							height: { ideal: maxHeight },
							facingMode: { exact: "user" },
						},
					})
					.then((stream) => {
						alert("Got the stream with max width and height");
						let video = document.createElement("video");
						video.srcObject = stream;
						video.play();
						video.onplaying = () => {
							let canvas = document.createElement("canvas");
							canvas.width = maxWidth;
							canvas.height = maxHeight;
							let ctx = canvas.getContext("2d");
							ctx.drawImage(video, 0, 0, maxWidth, maxHeight);
							let data = canvas.toDataURL("image/png");
							alert("Got Image Data");
							//download image
							let a = document.createElement("a");
							a.href = data;
							a.download = "image.png";
							a.click();
						};
					});
			});
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Camera
				onTakePhoto={(dataUri) => {
					handleTakePhoto(dataUri);
				}}
			/>
		</div>
	);
}

export default App;
