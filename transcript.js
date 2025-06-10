
const transcriptText = document.getElementById("transcriptText");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    console.log("ERROR MILA REEE....")
    alert("Your browser does not support Speech Recognition. Please use Chrome.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  let finalTranscript = "";

  recognition.onresult = (event) => {
    let interimTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      console.log("Recognized:", transcript);
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interimTranscript += transcript;
      }
    }
    // console.log("ERROR MILA REEE....")
    transcriptText.innerText = finalTranscript + interimTranscript;
  };

  recognition.onerror = (e) => {
    console.error("Speech Recognition Error:", e.error);
  };

  startBtn.addEventListener("click", () => {
    recognition.start();
    transcriptText.innerText = "🎙️ Listening...";
  });

  stopBtn.addEventListener("click", () => {
    recognition.stop();
  });
}
