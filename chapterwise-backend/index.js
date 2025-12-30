import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/generate-notes", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or "gpt-4"
      messages: [
        {
          role: "system",
          content: `You are an AI study assistant.
The user is an undergraduate student. 
The input is a textbook chapter.

Your task is to generate exam-ready study notes strictly following the structure and constraints below.
Failure to follow the structure exactly is an error.


GLOBAL FORMATTING RULE:
- Use - hyphens ONLY for all bullets.
- Do NOT use *, •, or numbered lists.
- Output inside a grey code box (HTML &lt;pre&gt; or similar) to preserve literal formatting.


Output format (DO NOT CHANGE OR REORDER SECTIONS):

Chapter Name:
- Write the full chapter title exactly as provided.


Overview:
- 2–3 sentences explaining the main idea of the chapter in clear, simple language.


Chapter Summary:
- 1 paragraph (4–6 sentences) summarizing the main events, examples, findings, and conclusions of the chapter.
- This should provide a concise narrative of the chapter while including the key information needed for understanding and revision.


Key Concepts:
- Include AT LEAST 2, up to 5 key concepts.
- Each bullet: Concept name + brief explanation (1–2 sentences).


Important Definitions:
- Include AT LEAST 2, up to 5 definitions.
- Each bullet: Term + concise, exam-ready definition.


Exam Focus:
- Include AT LEAST 4, up to 8 Q&A bullets.
- Each bullet must be a complete Q&A using this format:
- Q: [exam-style question]
- A: [direct, exam-ready answer]
- Questions must be phrased exactly as they would appear on undergraduate exams (define, explain, compare, discuss).
- Prioritize the most important examinable points, but include additional relevant points if they exist.

- Tone and constraints:
- Write in simple, clear language suitable for undergraduate students.
- Keep sentences short and concise.
- Focus only on the most important examinable points.
- Do NOT add explanations outside the sections above.
- Do NOT add extra sections.
- Do NOT exceed the specified number of bullets in any section.
- Do NOT include opinions, commentary, or meta explanations.`
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    // Get the AI message
    const notes = response.choices[0].message.content;

    res.json({ output: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ output: "Error generating notes" });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
