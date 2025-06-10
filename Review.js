function showCustomMessage(message, type = 'info') {
    const messageBox = document.getElementById("customMessageBox");
    const messageText = document.getElementById("customMessageText");
    
    if (messageBox && messageText) {
        messageText.innerText = message;
        messageBox.className = `custom-message-box ${type}`; 
        messageBox.style.display = "block";
        messageBox.style.opacity = "1";

        setTimeout(() => {
            messageBox.style.opacity = "0";
            setTimeout(() => {
                messageBox.style.display = "none";
            }, 300);
        }, 5000);
    } else {
        console.error("Custom message box elements (customMessageBox, customMessageText) not found in HTML!");
        console.log(`[${type.toUpperCase()}]: ${message}`);
    }
}

const submitBtn = document.getElementById("submitTranscript");
const reviewText = document.getElementById("reviewText");
const reviewResult = document.getElementById("reviewResult");

const GEMINI_API_KEY = "AIzaSyBbGO4zTKz9vxc2RDMAmPLByarSqcBikbg"; 

if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
        const transcript = transcriptText.innerText.trim();

        if (!transcript || transcript === "Your spoken text will appear here..." || transcript === "🎙️ Listening...") {
            showCustomMessage("Please record your answer before submitting for review.", 'warning');
            console.log("Transcript is empty or recording hasn't started.");
            return;
        }

        submitBtn.innerText = "⏳ Reviewing...";
        submitBtn.disabled = true;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an expert interview coach. Give a detailed review of this candidate's spoken answer:\n\n"${transcript}"\n\nEvaluate how accurate, relevant, and complete it is. Suggest how it could be improved. Focus on actionable advice for the candidate.`
                        }]
                    }]
                })
            });

            console.log("Raw response status:", response.status);
            const responseText = await response.text();
            console.log("Raw response text:", responseText);

            let data;
            try {
                data = JSON.parse(responseText);
                console.log("Parsed JSON data:", data);
            } catch (jsonError) {
                console.error("Failed to parse JSON response from Gemini:", jsonError);
                showCustomMessage("Received an invalid response from AI. Please try again.", 'error');
                return;
            }

            if (!response.ok) {
                showCustomMessage(`AI API Error: ${data.error?.message || response.statusText}`, 'error');
                console.error("Gemini API error response:", data);
                return;
            }

            const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No feedback received.";

            if (reviewText) {
                reviewText.innerText = feedback;
            }
            if (reviewResult) {
                reviewResult.style.display = "block";
            }

            showCustomMessage("AI review successfully generated!", 'success');
        } catch (error) {
            console.error("Error contacting Gemini API:", error);
            showCustomMessage("Failed to connect to AI service. Check your internet connection or API key.", 'error');
        } finally {
            submitBtn.innerText = "📤 Submit for Review";
            submitBtn.disabled = false;
        }
    });
} else {
    console.warn("Element with ID 'submitTranscript' not found. Ensure your HTML is correct.");
}