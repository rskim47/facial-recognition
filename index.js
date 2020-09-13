const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => video.srcObject = stream,
    (err) => console.error(err),
  );
}


video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video); // getting video 
  document.body.append(canvas); // adding to screen
  const displaySize = { width: video.width, height: 560 }; // current video size (760,560)
  console.log(displaySize);
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video,
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize); // boxes around face sizing
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections); // drawing 
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // face stuff
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections); // facical expression
  }, 100)
})