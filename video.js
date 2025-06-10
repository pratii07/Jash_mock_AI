let mediaRecorder;
let recordedChunks = [];
let stream;


const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const videoElement = document.getElementById("video");
const recordedVideo = document.getElementById("recorded");
const downloadLink = document.getElementById("downloadLink");

async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoElement.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      recordedVideo.src = URL.createObjectURL(blob);
      downloadLink.href = recordedVideo.src;
      downloadLink.download = "interview-recording.webm";
      downloadLink.style.display = "block";
    };

    startBtn.disabled = false;
    stopBtn.disabled = true;

    console.log("Audio tracks:", stream.getAudioTracks());
  } catch (err) {
    alert("Access denied or error: " + err.message);
  }
}

startBtn.addEventListener("click", () => {
  if (!stream) {
    alert("Camera not initialized");
    return;
  }
  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

window.addEventListener("load", initCamera);


