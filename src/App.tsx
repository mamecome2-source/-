import React, { useState, useRef } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertCircle,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Sparkles,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  ClipboardList,
  Flame,
  Award,
  ChevronRight,
  Plus
} from "lucide-react";
import { SAMPLE_EXAMS, SampleExam } from "./samples";
import { AnalysisResult } from "./types";

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // Custom prompt option
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  
  // Filter for question cards
  // 'all' | 'correct' | 'incorrect'
  const [questionFilter, setQuestionFilter] = useState<"all" | "correct" | "incorrect">("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file input selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Process the uploaded file to base64
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    setImageFile(file);
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setSelectedImage(e.target.result);
        // Clear previous results & errors when a new file is loaded
        setResult(null);
        setAnalysisError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Click handler for area
  const onUploadContainerClick = () => {
    fileInputRef.current?.click();
  };

  // Quick select sample exam sheets
  const handleSelectSample = (sample: SampleExam) => {
    setSelectedImage(sample.imageUrl);
    setImageMimeType("image/jpeg");
    setImageFile(null);
    setResult(sample.mockResult);
    setAnalysisError(null);
    setQuestionFilter("all");
    window.scrollTo({ top: 380, behavior: "smooth" });
  };

  // Call the server to analyze the image
  const handleStartAnalysis = async () => {
    if (!selectedImage) {
      alert("분석할 시험지 이미지를 업로드하거나 샘플을 지정해주세요.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMimeType,
          customPrompt: customPrompt.trim() ? customPrompt : undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "분석 서버 응답이 올바르지 않습니다.");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setQuestionFilter("all");
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "서버 통신 중 에러가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetState = () => {
    setSelectedImage(null);
    setImageFile(null);
    setResult(null);
    setAnalysisError(null);
    setCustomPrompt("");
    setQuestionFilter("all");
  };

  // Utility to count questions by type
  const correctCount = result?.questions.filter(q => q.status === "correct").length || 0;
  const incorrectCount = result?.questions.filter(q => q.status === "incorrect").length || 0;
  const unmarkedCount = result?.questions.filter(q => q.status === "unmarked").length || 0;

  const filteredQuestions = result?.questions.filter(q => {
    if (questionFilter === "all") return true;
    if (questionFilter === "correct") return q.status === "correct";
    if (questionFilter === "incorrect") return q.status === "incorrect";
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-[#f5f0eb] text-[#1a2744] selection:bg-[#f97316] selection:text-white" id="main-container">
      
      {/* Decorative top header line */}
      <div className="h-1.5 w-full bg-[#f97316]" />

      {/* Hero Header Section */}
      <header className="container mx-auto px-4 pt-12 pb-8 max-w-6xl text-center" id="header-section">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#1a2744]/15 shadow-sm mb-4">
          <Sparkles className="w-4 h-4 text-[#f97316]" />
          <span className="text-xs font-semibold tracking-wider text-[#1a2744] uppercase">AI-Powered Exam Grading</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a2744] mb-3" id="main-title">
          시험지 분석기
        </h1>
        
        <p className="text-base md:text-lg text-[#1a2744]/85 max-w-2xl mx-auto" id="main-subtitle">
          시험지 사진을 업로드하면 AI가 자동으로 채점하고 문제별 분석 및 맞춤 피드백을 제공합니다.
        </p>
      </header>

      {/* Main Content Dashboard Layout */}
      <main className="container mx-auto px-4 pb-20 max-w-6xl" id="dashboard-content">
        
        {/* Upload Card and Sample selector */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10" id="controls-section">
          
          {/* File Upload Zone - Takes up 7 units on large screens */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#1a2744]/10 shadow-md p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg" id="upload-panel">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="p-1.5 bg-[#f97316]/10 text-[#f97316] rounded-lg">
                    <UploadCloud className="w-5 h-5" />
                  </span>
                  시험지 업로드
                </h3>
                {selectedImage && (
                  <button
                    onClick={resetState}
                    className="text-xs font-semibold text-[#1a2744]/60 hover:text-[#f97316] transition-colors border border-dashed border-[#1a2744]/20 py-1 px-2.5 rounded-lg hover:border-[#f97316]/40"
                    id="btn-new-upload"
                  >
                    처음부터 다시하기
                  </button>
                )}
              </div>

              {/* Upload Dropzone Container */}
              <div
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 overflow-hidden ${
                  isDragActive 
                    ? "border-[#f97316] bg-[#f97316]/5 scale-[0.99]" 
                    : selectedImage 
                      ? "border-[#1a2744]/20 bg-stone-50" 
                      : "border-[#1a2744]/20 hover:border-[#f97316]/50 hover:bg-[#1a2744]/5"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={!selectedImage ? onUploadContainerClick : undefined}
                id="dropzone-area"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="file-input"
                />

                {!selectedImage ? (
                  <div className="py-6 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#f5f0eb] flex items-center justify-center text-[#1a2744]/80 shadow-inner group-hover:scale-110 transition-transform duration-300 mb-4">
                      <UploadCloud className="w-8 h-8 text-[#f97316]" />
                    </div>
                    <span className="text-lg font-bold text-[#1a2744] block mb-2" id="drag-drop-text">
                      시험지 사진을 여기에 놓거나 클릭하세요
                    </span>
                    <span className="text-sm text-[#1a2744]/60 block max-w-xs mx-auto">
                      JPEG, PNG, WEBP 등 지원하며 글씨가 잘 보이도록 찍어주세요.
                    </span>
                  </div>
                ) : (
                  <div className="relative group max-h-[290px] flex items-center justify-center">
                    <img
                      src={selectedImage}
                      alt="Uploaded test paper preview"
                      className="max-h-[280px] w-auto object-contain rounded-lg border border-[#1a2744]/15 shadow-sm"
                      id="uploaded-preview-img"
                    />
                    <div className="absolute inset-0 bg-[#1a2744]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                      <button
                        onClick={onUploadContainerClick}
                        className="bg-white/95 text-[#1a2744] text-xs font-bold py-2 px-4 rounded-xl shadow hover:bg-[#f97316] hover:text-white transition-all transform hover:scale-105"
                        id="btn-change-image"
                      >
                        사진 변경하기
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Prompt Context Input */}
              <div className="mt-5" id="custom-prompt-container">
                <label htmlFor="custom-prompt" className="text-xs font-bold text-[#1a2744] block mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#f97316]" />
                  AI 분석 요청사항 (선택사항)
                </label>
                <input
                  id="custom-prompt"
                  type="text"
                  placeholder="예: 틀린 이유를 격려하는 서정적인 멘트로 써줘, 계산 과정을 더 상세하게..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#1a2744]/15 bg-[#f5f0eb]/20 focus:outline-none focus:ring-2 focus:ring-[#f97316]/50 focus:border-[#f97316] placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* Error Message */}
            {analysisError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex gap-2 items-start" id="analysis-error-panel">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                <div>
                  <span className="font-bold block">분석 중 에러가 발생했습니다.</span>
                  <span className="text-red-600/90">{analysisError}</span>
                </div>
              </div>
            )}

            {/* Orange Grade Button */}
            <div className="mt-6 pt-4 border-t border-gray-150 flex gap-3">
              <button
                disabled={!selectedImage || isAnalyzing}
                onClick={handleStartAnalysis}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-white shadow-md text-base tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 transform ${
                  !selectedImage 
                    ? "bg-stone-300 cursor-not-allowed text-stone-500 shadow-none" 
                    : isAnalyzing
                      ? "bg-[#1a2744]/75 cursor-wait"
                      : "bg-[#f97316] hover:bg-[#ea580c] hover:shadow-lg active:scale-[0.98]"
                }`}
                id="btn-analyze-start"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>시험지 정밀 분석 중...</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-5 h-5" />
                    <span>분석 시작</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick interactive Samples Loader & Guides - Takes up 5 units */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#1a2744]/10 shadow-md p-6 flex flex-col justify-between" id="samples-panel">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                <span className="p-1.5 bg-[#1a2744]/5 text-[#1a2744] rounded-lg">
                  <ClipboardList className="w-5 h-5 text-[#1a2744]" />
                </span>
                간편 체험 샘플
              </h3>
              <p className="text-xs text-[#1a2744]/65 mb-5 leading-relaxed">
                테스트할 사진이 없으신가요? 아래 준비된 실제 교과 정략 시험지 샘플 중 하나를 선택하면 분석 대시보드가 즉시 펼쳐집니다.
              </p>

              <div className="space-y-3.5" id="sample-list">
                {SAMPLE_EXAMS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="w-full text-left p-3.5 rounded-2xl border border-[#1a2744]/10 hover:border-[#f97316]/50 bg-[#f5f0eb]/30 hover:bg-white hover:shadow transition-all duration-200 flex gap-3.5 items-center group relative overflow-hidden"
                    title={`${sample.name} 간편 체험`}
                    id={`sample-item-${sample.id}`}
                  >
                    {/* Tiny representation icon with category background colors */}
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${sample.thumbnailColor} opacity-90 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-inner group-hover:scale-105 transition-transform`}>
                      {sample.category.includes("수학") ? "수" : sample.category.includes("역사") ? "역" : "영"}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#f97316] uppercase block tracking-wider">
                        {sample.category}
                      </span>
                      <h4 className="text-sm font-bold text-[#1a2744] truncate group-hover:text-[#f97316] transition-colors">
                        {sample.name}
                      </h4>
                      <p className="text-[11px] text-[#1a2744]/60 truncate">
                        {sample.mockResult.totalQuestions}문항 채점 완료 (예상 {sample.mockResult.estimatedScore}점)
                      </p>
                    </div>

                    <div className="p-1 rounded-full bg-slate-100 group-hover:bg-[#f97316] group-hover:text-white text-stone-400 transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Instruction Note */}
            <div className="mt-6 p-4 rounded-2xl bg-[#f5f0eb]/60 border border-[#1a2744]/5 text-xs text-[#1a2744]/75 space-y-2">
              <span className="font-bold text-[#1a2744] block">💡 서비스 이용 가이드</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>글자가 찌그러지거나 잘리지 않게 수평을 맞춰 정면에서 찍어주면 정확도가 훨씬 올라갑니다.</li>
                <li>한글 필기나 수식도 정교하게 감지하여 분석합니다.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Loading overlay with educational tips */}
        {isAnalyzing && (
          <div className="bg-white rounded-3xl border border-[#1a2744]/10 shadow-lg p-10 text-center flex flex-col items-center justify-center min-h-[400px]" id="loading-panel">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-[#f97316]/25 border-t-[#f97316] animate-spin"></div>
              <Sparkles className="w-7 h-7 text-[#f97316] absolute inset-0 m-auto animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-[#1a2744] mb-3">
              시험지를 상세하게 채점하고 있습니다
            </h3>
            
            <div className="max-w-md mx-auto bg-[#f5f0eb]/60 p-4 rounded-2xl border border-[#1a2744]/5 text-sm text-[#1a2744]/80 text-left">
              <span className="font-bold text-[#f97316] flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" /> AI 채점 포인트
              </span>
              <ul className="space-y-1.5 text-xs pl-1 list-none">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#f97316] font-bold">✔</span>
                  주관식 손글씨 정답 판정 및 채점 규칙 지지 검증
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#f97316] font-bold">✔</span>
                  틀린 풀이 과정에서 논리적 흐름이 끊긴 취약 단원 파악
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#f97316] font-bold">✔</span>
                  단순 암기 오류와 핵심 개념 미설치 구분 및 튜토링 팁 도출
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Analytical Results Grid */}
        {result && !isAnalyzing && (
          <div className="space-y-8 animate-fade-in" id="results-panel">
            
            {/* 1. Score and Summary Panel */}
            <div className="bg-white rounded-3xl border border-[#1a2744]/10 shadow-md overflow-hidden" id="summary-section">
              <div className="bg-gradient-to-r from-[#1a2744] to-[#2e3e60] text-stone-100 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <span className="text-xs font-bold text-[#f97316] bg-[#f97316]/10 px-3 py-1 rounded-full border border-[#f97316]/20 inline-block mb-2 uppercase tracking-wide">
                    분석 완결
                  </span>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2" id="result-exam-title">
                    {result.examTitle || "업로드된 시험지 분석 결과"}
                  </h2>

                  <p className="text-sm text-stone-200/80 max-w-xl">
                    인공지능 모델이 시험 문항 전승 및 오답 메커니즘을 상세 정밀 판단 완료하였습니다.
                  </p>
                </div>

                {/* Score badge / circular */}
                <div className="flex items-center gap-4 shrink-0 bg-white/5 p-4 rounded-2xl border border-white/10" id="score-meter">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-[#f97316] uppercase tracking-widest block mb-0.5">ESTIMATED SCORE</span>
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-extrabold text-white tracking-tight" id="estimated-score">
                        {result.estimatedScore}
                      </span>
                      <span className="text-xl font-bold text-stone-300 ml-1">점</span>
                    </div>
                  </div>
                  
                  <div className="h-10 w-px bg-white/20" />
                  
                  <div className="text-xs text-stone-200">
                    <div className="mb-1 flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      맞은 문항: {result.correctCount} / {result.totalQuestions}
                    </div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      틀린 문항: {result.totalQuestions - result.correctCount} / {result.totalQuestions}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comprehensive visual summary with custom AI avatar */}
              <div className="p-6 md:p-8 bg-stone-50 border-t border-gray-150">
                <div className="flex flex-col md:flex-row gap-5 items-start">
                  <div className="w-12 h-12 bg-[#f97316]/10 text-[#f97316] rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-[#f97316]/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1a2744] mb-1.5 flex items-center gap-1.5">
                      AI 정밀 성취도 피드백
                    </h4>
                    <p className="text-sm text-[#1a2744]/90 leading-relaxed font-medium whitespace-pre-line" id="exam-summary">
                      {result.summary}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Key Concepts Weakness Mapping */}
            <div className="bg-white rounded-3xl border border-[#1a2744]/10 shadow-md p-6 md:p-8" id="concepts-section">
              <div className="flex items-center gap-2 mb-6">
                <span className="p-1.5 bg-[#f97316]/10 text-[#f97316] rounded-xl">
                  <TrendingUp className="w-5 h-5 text-[#f97316]" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#1a2744]">개념 파악 및 이해도</h3>
                  <p className="text-xs text-[#1a2744]/60">시험지에 수록된 문제들의 지향 핵심 개념과 각 영역별 추정 숙련도입니다.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="concepts-grid">
                {result.keyConcepts && result.keyConcepts.length > 0 ? (
                  result.keyConcepts.map((item, idx) => {
                    const badgeColors = 
                      item.understanding === "High" 
                        ? { bg: "bg-emerald-50 text-emerald-700 border-emerald-200/60", label: "이해 마스터 (우수)", dot: "bg-emerald-500" }
                        : item.understanding === "Medium"
                          ? { bg: "bg-amber-50 text-amber-700 border-amber-200/60", label: "추가 연습 요망", dot: "bg-amber-500" }
                          : { bg: "bg-rose-50 text-rose-700 border-rose-200/60", label: "개념 보완 긴급", dot: "bg-rose-500" };

                    return (
                      <div key={idx} className="bg-[#f5f0eb]/20 rounded-2xl border border-[#1a2744]/5 p-5 flex flex-col justify-between hover:shadow-sm transition-shadow">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3.5">
                            <span className="text-[11px] font-bold text-stone-400">CONCEPT {idx + 1}</span>
                            <span className={`text-[11px] font-bold uppercase py-0.5 px-2.5 rounded-full border flex items-center gap-1.5 ${badgeColors.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${badgeColors.dot}`} />
                              {badgeColors.label}
                            </span>
                          </div>
                          
                          <h4 className="font-bold text-sm text-[#1a2744] mb-2 leading-snug">
                            {item.concept}
                          </h4>
                          
                          <p className="text-xs text-[#1a2744]/75 leading-relaxed">
                            {item.feedback}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-3 text-center text-stone-400 py-4 text-xs font-medium">
                    추출된 개념 맵이 존재하지 않습니다.
                  </div>
                )}
              </div>
            </div>

            {/* 3. Question Itemized Breakdown */}
            <div className="bg-white rounded-3xl border border-[#1a2744]/10 shadow-md p-6 md:p-8" id="itemized-section">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-5 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#1a2744]">문항별 상세 채점 결과</h3>
                  <p className="text-xs text-[#1a2744]/65">개별 문제의 오답 메카니즘 분석 및 맞춤형 학습 해설을 제시합니다.</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-1 bg-[#f5f0eb]/80 p-1 rounded-xl border border-[#1a2744]/5 self-start shrink-0">
                  <button
                    onClick={() => setQuestionFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      questionFilter === "all"
                        ? "bg-[#1a2744] text-white shadow"
                        : "text-[#1a2744]/70 hover:text-[#1a2744]"
                    }`}
                  >
                    전체 ({result.questions.length})
                  </button>
                  <button
                    onClick={() => setQuestionFilter("correct")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      questionFilter === "correct"
                        ? "bg-emerald-600 text-white shadow"
                        : "text-[#1a2744]/70 hover:text-[#1a2744]"
                    }`}
                  >
                    정답 ({correctCount})
                  </button>
                  <button
                    onClick={() => setQuestionFilter("incorrect")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      questionFilter === "incorrect"
                        ? "bg-rose-600 text-white shadow"
                        : "text-[#1a2744]/70 hover:text-[#1a2744]"
                    }`}
                  >
                    오답 ({incorrectCount})
                  </button>
                </div>
              </div>

              {/* Question list render */}
              {filteredQuestions.length > 0 ? (
                <div className="space-y-5" id="questions-render-list">
                  {filteredQuestions.map((q) => {
                    const isCorrect = q.status === "correct";
                    const isUnmarked = q.status === "unmarked";
                    
                    return (
                      <div
                        key={q.number}
                        className={`rounded-2xl border p-5 md:p-6 transition-all ${
                          isCorrect
                            ? "bg-emerald-50/20 border-emerald-500/15 hover:border-emerald-500/30"
                            : isUnmarked 
                              ? "bg-stone-50 border-stone-200"
                              : "bg-rose-50/25 border-rose-500/15 hover:border-rose-500/30"
                        }`}
                        id={`question-card-${q.number}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                              isCorrect 
                                ? "bg-emerald-500 text-stone-50 border-emerald-600" 
                                : isUnmarked
                                  ? "bg-stone-400 text-stone-100 border-stone-500"
                                  : "bg-rose-500 text-stone-50 border-rose-600"
                            }`}>
                              {q.number}
                            </span>
                            <span className="font-bold text-sm text-[#1a2744]">
                              문제 {q.number}
                            </span>
                          </div>

                          <span className={`text-xs font-semibold py-1 px-3 rounded-full flex items-center gap-1 border ${
                            isCorrect
                              ? "bg-emerald-100/50 text-emerald-800 border-emerald-200"
                              : isUnmarked
                                ? "bg-stone-100 text-[#1a2744]/60 border-stone-200"
                                : "bg-rose-100/50 text-rose-800 border-rose-200"
                          }`}>
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                정답
                              </>
                            ) : isUnmarked ? (
                              "미채점"
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                오답
                              </>
                            )}
                          </span>
                        </div>

                        {/* Question Text Summary */}
                        <div className="mb-4">
                          <p className="text-sm font-semibold text-[#1a2744] bg-white/70 p-3 rounded-xl border border-[#1a2744]/5 shadow-sm leading-relaxed">
                            {q.questionText}
                          </p>
                        </div>

                        {/* Answer Side-by-Side comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                          <div className="bg-white/80 p-3 rounded-xl border border-[#1a2744]/5 flex justify-between items-center text-xs">
                            <span className="text-[#1a2744]/60 font-bold">학생 답안:</span>
                            <span className={`font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700 underline underline-offset-4"}`}>
                              {q.studentAnswer || "(미기입)"}
                            </span>
                          </div>
                          
                          <div className="bg-white/80 p-3 rounded-xl border border-[#1a2744]/5 flex justify-between items-center text-xs">
                            <span className="text-[#1a2744]/60 font-bold">올바른 정답:</span>
                            <span className="font-bold text-[#1a2744]">
                              {q.correctAnswer}
                            </span>
                          </div>
                        </div>

                        {/* AI Commentary and Correction Tips */}
                        <div className="bg-white/90 p-4 rounded-xl border border-[#1a2744]/5">
                          <h5 className="text-[11px] font-bold text-[#f97316] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> 오답 원인 분석 및 해결 방안
                          </h5>
                          <p className="text-xs text-[#1a2744]/95 leading-relaxed font-medium">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-stone-50 border border-dashed border-stone-200 rounded-2xl text-stone-400 font-bold text-sm">
                  해당 필터링 조건에 부합하는 질문 카드가 없습니다.
                </div>
              )}
            </div>

            {/* Sticky/Floating scroll-to-top layout element for quick review */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-xs font-bold text-[#1a2744]/70 hover:text-[#f97316] flex items-center gap-1.5 py-2 px-4 rounded-xl hover:bg-white transition-all border border-[#1a2744]/5 shadow-sm"
              >
                위로 올라가기
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Elegant minimalist footer */}
      <footer className="bg-white border-t border-[#1a2744]/10 py-8" id="footer-panel">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between text-xs text-[#1a2744]/60 gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#f97316]" />
            <span className="font-bold text-[#1a2744]">시험지 분석기 AI Engine v1.0</span>
          </div>
          <p>© 2026 AI Studio. All rights reserved. 학생의 잠재된 성장을 응원합니다.</p>
        </div>
      </footer>
    </div>
  );
}
