import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Increase JSON body limits for base64 image uploads
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize GoogleGenAI client (lazy & safe check)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please configure it in your Secrets / Environment Variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint to analyze exam paper
app.post("/api/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType, customPrompt } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "이미지 데이터가 누락되었습니다." });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const cleanMimeType = mimeType || "image/jpeg";

    const ai = getGeminiClient();

    // Custom system instruction for high-quality exam analysis
    const systemInstruction = `
You are a highly professional and encouraging AI Exam Analytics Engine ("시험지 분석기").
Your task is to analyze the uploaded image of an exam paper or test worksheet.
Perform the following:
1. Detect the exam title or subject (e.g., "Math Quiz", "Korean History Midterm", "English Worksheet").
2. Identify every visible question. Carefully grade each question. Determine if the student's handwritten answer or selection is correct or incorrect. Or if it is unmarked/ungraded.
3. Keep track of correct/incorrect questions, standard scores, and calculate an overall estimated score out of 100.
4. Extract key concept topics tested in this paper, assess the student's understanding level ("High", "Medium", "Low"), and provide corrective feedback/study suggestions.
5. Provide clear, encouraging, and detailed feedback in Korean.

Constraints:
- Respond strictly in the specified JSON format.
- Ensure correct Korean translations and respectful, supportive student-first guidance.
- Make highly realistic educational deductions even if a hand-written answer is slightly blurry.
`;

    const userPrompt = customPrompt || "이 시험지 사진을 꼼꼼하게 채점하고 분석해 주세요.";

    const schema = {
      type: Type.OBJECT,
      properties: {
        examTitle: {
          type: Type.STRING,
          description: "시험 제목 또는 교과목 이름",
        },
        totalQuestions: {
          type: Type.INTEGER,
          description: "전체 문항 수",
        },
        correctCount: {
          type: Type.INTEGER,
          description: "정답을 맞춘 문항 수",
        },
        estimatedScore: {
          type: Type.INTEGER,
          description: "100점 만점으로 환산한 예상 점수",
        },
        summary: {
          type: Type.STRING,
          description: "전체적인 시험결과 요약과 따뜻하고 구체적인 피드백 (Korean)",
        },
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              number: {
                type: Type.INTEGER,
                description: "문항 번호",
              },
              questionText: {
                type: Type.STRING,
                description: "문제 요약 또는 내용 (Korean)",
              },
              status: {
                type: Type.STRING,
                description: "정오답 판정 ('correct' / 'incorrect' / 'unmarked')",
              },
              studentAnswer: {
                type: Type.STRING,
                description: "학생이 작성한 답안 또는 선택지",
              },
              correctAnswer: {
                type: Type.STRING,
                description: "정답 및 해설상 올바른 정답",
              },
              explanation: {
                type: Type.STRING,
                description: "학생이 틀린 오답 원인 분석 및 문제 풀이 해설 (Korean)",
              },
            },
            required: ["number", "questionText", "status", "studentAnswer", "correctAnswer", "explanation"],
          },
        },
        keyConcepts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              concept: {
                type: Type.STRING,
                description: "핵심 단원명 또는 학업 개념 이름",
              },
              understanding: {
                type: Type.STRING,
                description: "개념 이해도 등급 ('High' / 'Medium' / 'Low')",
              },
              feedback: {
                type: Type.STRING,
                description: "개념 보완을 위한 맞춤 핵심 공부 팁 (Korean)",
              },
            },
            required: ["concept", "understanding", "feedback"],
          },
        },
      },
      required: ["examTitle", "totalQuestions", "correctCount", "estimatedScore", "summary", "questions", "keyConcepts"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: cleanMimeType,
            data: cleanBase64,
          },
        },
        { text: userPrompt },
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Analysis API Error:", error);
    return res.status(500).json({
      error: error.message || "시험지 분석 중 내부 오류가 발생했습니다.",
    });
  }
});

// Configure Vite or Static server
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT },
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
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start fullstack server:", err);
});
