import { AnalysisResult } from "./types";

export interface SampleExam {
  id: string;
  name: string;
  category: string;
  thumbnailColor: string;
  imageUrl: string;
  mockResult: AnalysisResult;
}

export const SAMPLE_EXAMS: SampleExam[] = [
  {
    id: "math",
    name: "초등 5학년 수학 (다각형의 둘레와 넓이)",
    category: "수학 (Math)",
    thumbnailColor: "from-blue-500 to-indigo-600",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=800&auto=format&fit=crop",
    mockResult: {
      examTitle: "초등 수학 5학년 1학기 단원평가 (다각형의 둘레와 넓이)",
      totalQuestions: 5,
      correctCount: 4,
      estimatedScore: 80,
      summary: "전체적으로 다각형의 둘레와 넓이 공식을 잘 이해하고 적용하고 있습니다. 삼각형, 평행사변형 등 기본 평면도형의 넓이 계산은 완벽합니다. 다만, 사다리꼴의 넓이 공식에서 (윗변 + 아랫변) 연산을 먼저 한 뒤 높이를 곱해야 하는데, 괄호 연산 순서를 혼동해 단순 계산 실수가 있었습니다. 연산 순서에 주의한다면 다음 시험에서 100점도 충분히 가능합니다. 잘했습니다! 😊",
      questions: [
        {
          number: 1,
          questionText: "한 변의 길이가 6cm인 정육각형의 둘레를 구하시오.",
          status: "correct",
          studentAnswer: "36cm",
          correctAnswer: "36cm",
          explanation: "정육각형은 한 변의 길이가 모두 같은 선분 6개로 이루어져 있으므로, 6cm × 6 = 36cm입니다. 학생이 계산 공식을 완벽히 적용하였습니다."
        },
        {
          number: 2,
          questionText: "밑변이 8cm, 높이가 5cm인 평행사변형의 넓이를 구하시오.",
          status: "correct",
          studentAnswer: "40㎠",
          correctAnswer: "40㎠",
          explanation: "평행사변형의 넓이는 (밑변) × (높이)입니다. 8cm × 5cm = 40㎠로 정확하게 연산하여 정답 처리되었습니다."
        },
        {
          number: 3,
          questionText: "밑변이 10cm, 높이가 6cm인 삼각형의 넓이를 구하시오.",
          status: "correct",
          studentAnswer: "30㎠",
          correctAnswer: "30㎠",
          explanation: "삼각형의 넓이는 (밑변 × 높이) ÷ 2입니다. (10 × 6) ÷ 2 = 30㎠이므로 계산이 정확합니다."
        },
        {
          number: 4,
          questionText: "윗변이 4cm, 아랫변이 8cm, 높이가 6cm인 사다리꼴의 넓이를 구하시오.",
          status: "incorrect",
          studentAnswer: "52㎠",
          correctAnswer: "36㎠",
          explanation: "사다리꼴의 넓이 공식은 '(윗변 + 아랫변) × 높이 ÷ 2' 입니다. 바른 식은 (4 + 8) × 6 ÷ 2 = 12 × 6 ÷ 2 = 36㎠ 입니다. 학생은 가로 연산을 누락하여 '4 + 8 × 6 ÷ 2'로 오인해 4 + 24 = 28 또는 임의의 잘못된 연산 순서를 거친 것으로 추정됩니다. 연산 시 사다리꼴 공식의 가로(괄호) 위치를 다시 한번 복습해주세요."
        },
        {
          number: 5,
          questionText: "대각선의 길이가 각각 12cm, 10cm인 마름모의 넓이를 구하시오.",
          status: "correct",
          studentAnswer: "60㎠",
          correctAnswer: "60㎠",
          explanation: "마름모의 넓이 공식은 (한 대각선 × 다른 대각선) ÷ 2입니다. (12 × 10) ÷ 2 = 60㎠이며, 단위까지 정밀하게 표기하고 정답을 맞추었습니다."
        }
      ],
      keyConcepts: [
        {
          concept: "기본 정다각형 및 사각형 둘레 연산",
          understanding: "High",
          feedback: "정다각형의 둘레 성질과 기본 평형사변형 성질에 대한 직관이 아주 훌륭합니다."
        },
        {
          concept: "삼각형 및 마름모의 넓이",
          understanding: "High",
          feedback: "나누기 2를 까먹기 쉬운 삼각형과 마름모 공식을 정확하게 암기하고 있습니다."
        },
        {
          concept: "사다리꼴의 넓이와 사칙연산 우선순위",
          understanding: "Medium",
          feedback: "윗변과 아랫변을 반드시 먼저 더하는 괄호 공식을 재복습하고 적용 연습을 3제 추가 풀이하는 것을 권장합니다."
        }
      ]
    }
  },
  {
    id: "history",
    name: "고등 한국사 (개항기 ~ 근대 사회)",
    category: "역사 (History)",
    thumbnailColor: "from-amber-600 to-red-700",
    imageUrl: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=800&auto=format&fit=crop",
    mockResult: {
      examTitle: "고등학교 한국사 제1회 수시평가 (근대 사회의 형성)",
      totalQuestions: 4,
      correctCount: 3,
      estimatedScore: 75,
      summary: "근대 개항기의 조약과 인물 활동에 대해 훌륭한 역사적 사실 인지 능력을 보이고 있습니다. 대원군의 정책이나 강화도 조약의 복잡한 이면도 전반적으로 잘 꿰뚫고 있으나, 특정 사료 문제에서 단어 매치 실수를 하였습니다. 교과서 사료를 정독하며 읽는 습관을 기르면 만점을 받을 수 있습니다. 훌륭한 학업 성취도입니다!",
      questions: [
        {
          number: 1,
          questionText: "흥선대원군의 개혁 정치 중 양반의 면세 대상을 혁파하고 귀족과 서민 구분 없이 군포를 징수했던 제도를 고르시오.",
          status: "correct",
          studentAnswer: "호포제",
          correctAnswer: "호포제",
          explanation: "호포제는 양반에게도 포를 물리도록 하여 면세 특권을 철폐한 세제 개혁입니다. 학생이 정확한 정책 명칭을 서술했습니다."
        },
        {
          number: 2,
          questionText: "1876년 체결된 강화도 조약에 포함된 설명 중 올바른 것을 모두 고르시오.",
          status: "correct",
          studentAnswer: "해안 측량권 인정, 치외법권 설정",
          correctAnswer: "해안 측량권 인정, 치외법권 설정",
          explanation: "조선은 강화도조약을 통해 최초의 근대적 조약을 맺었으나, 해안 측량권과 영사 재판권(치외법권)이 포함된 불평등 조약이었습니다. 정답을 확실하게 선택했습니다."
        },
        {
          number: 3,
          questionText: "임오군란(1882) 이후 맺어졌으며, 청나라 상인의 내륙 통상권을 최초로 무제한 허용한 특권 조약의 올바른 이름은?",
          status: "incorrect",
          studentAnswer: "조미수호통상조약",
          correctAnswer: "조청상민수륙무역장정",
          explanation: "청나라 상인의 내륙 깊숙한 내지 통상권을 허가한 불평등 무역 규정은 '조청상민수륙무역장정'입니다. 조미수호통상조약은 미국과 맺은 최초의 서구 조약으로 관세와 최혜국 대우가 담겼으나 임오군란 이후 청나라의 특권 규정과는 다릅니다. 이 핵심 조약 두 가지를 헷갈리지 않게 비교 노트를 써보세요."
        },
        {
          number: 4,
          questionText: "갑오개혁(1894)에서 신분제 철폐의 사상적 근간이 되었으며 공·사노비 제도를 최종 혁파하고 신분 차별을 폐지하게 만든 근대 의논 기관은?",
          status: "correct",
          studentAnswer: "군국기무처",
          correctAnswer: "군국기무처",
          explanation: "군국기무처는 제1차 갑오개혁을 주도하며 과거제 폐지와 신분 해방 등의 전폭적 개혁을 가결한 초정부적 회의 기관입니다. 정확히 답했습니다."
        }
      ],
      keyConcepts: [
        {
          concept: "대원군의 안민/민생 개혁",
          understanding: "High",
          feedback: "호포제, 사창제, 서원 철폐 등 민생 안정책의 세부 성격을 매우 깊이 이해하고 있습니다."
        },
        {
          concept: "근대 불평등 조약의 체계 분류",
          understanding: "Medium",
          feedback: "청-미-일 조약의 정식 특징을 서로 대조하며 마인드맵 공부법을 설계하면 암기 지속도가 향상될 것입니다."
        },
        {
          concept: "갑오·을미 개혁의 제도 개정",
          understanding: "High",
          feedback: "전통 사법제 붕괴 및 신분철폐 개정을 시대 흐름에 맞춰 잘 엮어낼 수 있습니다."
        }
      ]
    }
  },
  {
    id: "english",
    name: "중학교 3학년 영어 (Vocabulary & Reading)",
    category: "영어 (English)",
    thumbnailColor: "from-teal-600 to-cyan-700",
    imageUrl: "https://images.unsplash.com/photo-1543167126-a630a8437808?q=80&w=800&auto=format&fit=crop",
    mockResult: {
      examTitle: "중학교 3학년 영어 주말 형성평가 (Reading comprehension & Idioms)",
      totalQuestions: 4,
      correctCount: 4,
      estimatedScore: 100,
      summary: "축하합니다! 만점입니다. 🎉 문맥 속에서 적절한 어휘를 가려내는 뛰어난 통찰력과 주격 관계 대명사의 형식을 완전하게 간파하고 있습니다. 영어 지문 분석력이 또래 교육과정에 비해 우수하고 문맥 해석에 지연 요소가 전혀 없습니다. 지금처럼 폭넓은 독서 학습과 구문 공부를 이어나가면 고등학교 상위 영어 등급도 흔들림 없이 수성할 수 있습니다. 훌륭해요!",
      questions: [
        {
          number: 1,
          questionText: "다음 문장의 빈칸에 들어갈 단어로 가장 알맞은 것은? 'The dynamic environment ______ changes constantly requires flexibility.'",
          status: "correct",
          studentAnswer: "which",
          correctAnswer: "which / that",
          explanation: "The dynamic environment를 수식하면서 뒤에 changes(동사)가 오므로 주격 관계대명사 'which' 또는 'that'이 유일무이하게 들어갑니다. 정확히 잘 골랐습니다."
        },
        {
          number: 2,
          questionText: "밑줄 친 단어 'flexibility'의 한국어 영한 의미로 가장 올바른 어휘는?",
          status: "correct",
          studentAnswer: "유연성 (융통성)",
          correctAnswer: "유연성 / 신축성 / 융통성",
          explanation: "flexibility의 어원 'flexible(유연한)'에서 파생된 명사형 의미를 일목요연하고 정확하게 번역 및 기입하였습니다."
        },
        {
          number: 3,
          questionText: "다음 중 어법상 틀린 부분을 찾아 바르게 고쳐 쓰시오: 'Neither my brother nor my sisters likes eating spicy food.'",
          status: "correct",
          studentAnswer: "likes -> like",
          correctAnswer: "likes -> like",
          explanation: "Neither A nor B 문형이 주어가 될 때, 수 동사 일치는 B(my sisters - 복수)에 시키므로 단수동사 'likes'를 복수동사 'like'로 치환해야 완벽하게 옳습니다. 정답입니다!"
        },
        {
          number: 4,
          questionText: "지문: 'Organic farming improves biodiversity and preserves water quality.' / 'Organic farming'이 제공하는 이점 두 가지를 쓰세요.",
          status: "correct",
          studentAnswer: "생물 다양성 개선, 수질 보호",
          correctAnswer: "생물 다양성 개선, 수질 보존(보호)",
          explanation: "biodiversity(생물다양성)와 preserves water quality(수질 보존)를 정밀하게 직독직해하여 한글 주관식 요약형 답안을 훌륭하게 완결하였습니다."
        }
      ],
      keyConcepts: [
        {
          concept: "주격 관계대명사 구문 결합",
          understanding: "High",
          feedback: "복잡한 관계대명사 문맥 연결과 생략 조건을 단번에 캐치하는 감각이 있습니다."
        },
        {
          concept: "주어-동사 수 일치 특수 가정",
          understanding: "High",
          feedback: "Neither A nor B 상관접속사의 복수 주어 정교화 수일치를 실수 없이 처리한 점이 일품입니다."
        },
        {
          concept: "친환경 실용 독해 지문 분석",
          understanding: "High",
          feedback: "글의 구조를 잡는 능력이 훌륭하며 독해 정확도가 100%에 달합니다."
        }
      ]
    }
  }
];
