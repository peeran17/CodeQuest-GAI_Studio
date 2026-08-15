import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  // AI Mentor Hint Endpoint
  app.post("/api/mentor/hint", async (req, res) => {
    try {
      const { language, title, instructions, code, error, attempts } = req.body;
      const ai = getAi();

      const prompt = `You are a friendly, encouraging coding tutor in a gamified learning app called CodeQuest.
The user is working on a coding challenge.
Language: ${language || "JavaScript"}
Challenge: ${title || "Untitled"}
Instructions: ${instructions || "Solve the exercise"}
Current User Code:
\`\`\`${language}
${code || ""}
\`\`\`
${error ? `Last execution error / failed test: ${error}` : ""}
Number of attempts: ${attempts || 1}

Provide a concise, encouraging, Socratic hint. Do NOT just write out the complete answer directly. Guide them towards the insight or syntax needed to fix their mistake. Limit response to 2-3 short, clear sentences.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({
        hint: response.text || "Try breaking the problem into smaller steps and check your syntax!",
      });
    } catch (err: any) {
      console.error("Mentor hint error:", err);
      res.status(500).json({
        error: "Could not generate hint at this moment.",
        fallback: "Review the expected output carefully and check variable types and boundary cases!",
      });
    }
  });

  // AI Mentor Code Review / Explanation Endpoint
  app.post("/api/mentor/review", async (req, res) => {
    try {
      const { language, title, code, isSuccess } = req.body;
      const ai = getAi();

      const prompt = `You are an expert, encouraging code reviewer in CodeQuest.
The user just ${isSuccess ? "successfully solved" : "attempted"} the challenge: "${title}".
Language: ${language}
Submitted Code:
\`\`\`${language}
${code}
\`\`\`

Evaluate the code and respond in JSON with the following structure:
- rating: string ("Good", "Great", "Clean & Elegant", "Master Coder")
- efficiency: string (e.g., "O(N) Time, O(1) Space" or quick assessment)
- strengths: array of strings (1-2 bullets highlighting what was done well)
- improvementTip: string (1 concise pro tip or idiomatic improvement)
- breakdown: string (brief 2-sentence explanation of how this code works)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rating: { type: Type.STRING },
              efficiency: { type: Type.STRING },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              improvementTip: { type: Type.STRING },
              breakdown: { type: Type.STRING },
            },
            required: ["rating", "efficiency", "strengths", "improvementTip", "breakdown"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      console.error("Mentor review error:", err);
      res.status(500).json({
        rating: "Solid Attempt",
        efficiency: "Optimized",
        strengths: ["Clean syntax and structured logic"],
        improvementTip: "Keep practicing daily to build muscle memory!",
        breakdown: "Your solution processes the input data and returns the expected result.",
      });
    }
  });

  // AI Dynamic Custom Challenge Generator
  app.post("/api/mentor/generate-challenge", async (req, res) => {
    try {
      const { language, topic, difficulty } = req.body;
      const ai = getAi();

      const prompt = `Generate a creative, gamified interactive coding challenge for CodeQuest.
Target Language: ${language || "Python"} (Options: python, javascript, sql, html, rust)
Topic: ${topic || "General Algorithms / Everyday problem"}
Difficulty: ${difficulty || "Beginner"} (Beginner, Intermediate, Advanced)

The challenge should be engaging, with clear objectives, starter code, solution code, test cases, and fun story flavor.

Return a valid JSON object matching the schema:
- title: string (catchy challenge name)
- topic: string
- difficulty: string
- story: string (fun short context, e.g. "You are an explorer decoding ancient alien runes...")
- instructions: string (clear bullet points on what the function/query/code must do)
- starterCode: string (code with a TODO or placeholder)
- solutionCode: string (clean reference solution)
- testCases: array of objects with { "input": string, "expected": string, "description": string }
- hint: string (helpful tip)
- xpReward: integer (e.g. 50, 75, 100)
- type: string ("code_editor" | "bug_hunt" | "predict_output")`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              story: { type: Type.STRING },
              instructions: { type: Type.STRING },
              starterCode: { type: Type.STRING },
              solutionCode: { type: Type.STRING },
              testCases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    input: { type: Type.STRING },
                    expected: { type: Type.STRING },
                    description: { type: Type.STRING },
                  },
                  required: ["input", "expected", "description"],
                },
              },
              hint: { type: Type.STRING },
              xpReward: { type: Type.INTEGER },
              type: { type: Type.STRING },
            },
            required: [
              "title",
              "topic",
              "difficulty",
              "story",
              "instructions",
              "starterCode",
              "solutionCode",
              "testCases",
              "hint",
              "xpReward",
              "type",
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({
        ...parsed,
        id: `custom_${Date.now()}`,
        language: (language || "python").toLowerCase(),
      });
    } catch (err: any) {
      console.error("Challenge generator error:", err);
      res.status(500).json({
        error: "Failed to generate challenge. Please try again.",
      });
    }
  });

  // AI Concept Explainer Endpoint
  app.post("/api/mentor/explain-concept", async (req, res) => {
    try {
      const { concept, language } = req.body;
      const ai = getAi();

      const prompt = `Explain the coding concept "${concept}" in ${language} for a coding student.
Use an intuitive analogy, a short visual code example, and 2 common pitfalls to avoid.
Format with clean markdown-friendly text. Keep it lively and under 250 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({ explanation: response.text });
    } catch (err: any) {
      console.error("Explain concept error:", err);
      res.status(500).json({
        explanation: "Unable to generate explanation right now. Try reviewing standard language documentation.",
      });
    }
  });

  // Vite middleware for development vs production static serve
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeQuest server running on port ${PORT}`);
  });
}

startServer();
