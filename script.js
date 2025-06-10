document.getElementById("loadQuestions").addEventListener("click", async () => {
const topic = document.getElementById("topicInput").value.trim();
const questionList = document.getElementById("questionList");
const questionsSection = document.getElementById("questionsSection");

if (!topic) {
  alert("Please enter a topic.");
  return;
}

const API_KEY = "AIzaSyBbGO4zTKz9vxc2RDMAmPLByarSqcBikbg"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const prompt = `Generate 5 interview-style questions on the topic "${topic}". 
Do not include answers or explanations. Only list the questions as plain text.`;

try {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });

  const data = await response.json();

  if (!data.candidates || !data.candidates.length) {
    throw new Error("No questions generated.");
  }

  const text = data.candidates[0].content.parts[0].text;

  const questions = text
    .split(/\n+/)
    .filter(line => line.trim())
    .map(line => line.replace(/^[-•\d.]*\s*/, ''));


    questionList.innerHTML = "";
  questions.forEach(q => {
    const li = document.createElement("li");
    li.textContent = q;
    questionList.appendChild(li);
  });

  questionsSection.style.display = "block";
} catch (err) {
  console.error(err);
  alert("Failed to load questions: " + err.message);
}
});
