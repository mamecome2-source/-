export interface AnalysisQuestion {
  number: number;
  questionText: string;
  status: "correct" | "incorrect" | "unmarked";
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface KeyConcept {
  concept: string;
  understanding: "High" | "Medium" | "Low";
  feedback: string;
}

export interface AnalysisResult {
  examTitle: string;
  totalQuestions: number;
  correctCount: number;
  estimatedScore: number;
  summary: string;
  questions: AnalysisQuestion[];
  keyConcepts: KeyConcept[];
}
