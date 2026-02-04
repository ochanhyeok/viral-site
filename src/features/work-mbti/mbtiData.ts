export interface MbtiOption {
  text: string;
  type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

export interface MbtiQuestion {
  id: number;
  question: string;
  situation?: string;
  axis: 'EI' | 'SN' | 'TF' | 'JP';
  options: [MbtiOption, MbtiOption];
}

export const mbtiQuestions: MbtiQuestion[] = [
  // E/I 축 - 에너지의 방향 (회사에서)
  {
    id: 1,
    axis: 'EI',
    question: "점심시간, 당신의 선택은?",
    situation: "🍚 밥 먹으러 가자는 동료의 제안",
    options: [
      { text: "좋아! 같이 가서 수다 떨면서 먹자~", type: 'E' },
      { text: "오늘은 혼밥 각이야... 조용히 먹고 싶어", type: 'I' },
    ],
  },
  {
    id: 2,
    axis: 'EI',
    question: "회사 워크숍에서 당신은?",
    situation: "🏕️ 1박 2일 팀 워크숍",
    options: [
      { text: "레크레이션 시간에 앞장서서 분위기 메이커!", type: 'E' },
      { text: "조용히 구경하다가 방에서 충전하는 시간 필요", type: 'I' },
    ],
  },
  {
    id: 3,
    axis: 'EI',
    question: "월요일 아침, 주말 뭐했냐는 질문에?",
    situation: "💬 엘리베이터에서 만난 동료",
    options: [
      { text: "어제 가본 맛집 얘기로 시작해서 한참 떠듦", type: 'E' },
      { text: "\"그냥 집에서 쉬었어요\" 짧게 대답하고 싶음", type: 'I' },
    ],
  },

  // S/N 축 - 정보 인식 방식 (업무 스타일)
  {
    id: 4,
    axis: 'SN',
    question: "새 프로젝트가 들어왔을 때?",
    situation: "📋 다음 분기 신규 프로젝트 시작",
    options: [
      { text: "일단 세부 일정과 구체적인 할 일 목록부터 정리", type: 'S' },
      { text: "전체 방향성과 최종 목표부터 그려보기", type: 'N' },
    ],
  },
  {
    id: 5,
    axis: 'SN',
    question: "보고서 작성할 때 당신은?",
    situation: "📊 주간 업무 보고서 작성 중",
    options: [
      { text: "데이터와 수치 중심으로 팩트 위주 작성", type: 'S' },
      { text: "의미 해석과 향후 전망까지 포함해서 작성", type: 'N' },
    ],
  },
  {
    id: 6,
    axis: 'SN',
    question: "회의 중 아이디어 제안할 때?",
    situation: "💡 브레인스토밍 회의",
    options: [
      { text: "실현 가능하고 검증된 방식 위주로 제안", type: 'S' },
      { text: "새롭고 창의적인 아이디어, 일단 던져보기", type: 'N' },
    ],
  },

  // T/F 축 - 판단 방식 (의사결정)
  {
    id: 7,
    axis: 'TF',
    question: "동료가 실수했을 때 당신은?",
    situation: "😰 같이 일하는 동료의 업무 실수 발견",
    options: [
      { text: "문제점 지적하고 해결책 제시. 감정보단 해결이 먼저", type: 'T' },
      { text: "상대 기분 살피면서 조심스럽게 얘기. 상처받을까봐", type: 'F' },
    ],
  },
  {
    id: 8,
    axis: 'TF',
    question: "연봉 협상할 때 당신은?",
    situation: "💰 연말 연봉 협상 면담",
    options: [
      { text: "내 성과 데이터로 논리적으로 어필하기", type: 'T' },
      { text: "회사와의 관계, 분위기 봐가면서 조심스럽게", type: 'F' },
    ],
  },
  {
    id: 9,
    axis: 'TF',
    question: "업무 피드백을 받았을 때?",
    situation: "📝 상사에게 업무 피드백 받는 중",
    options: [
      { text: "논리적인 피드백이면 바로 수용. 개선하면 되지!", type: 'T' },
      { text: "아무리 맞는 말이어도 말투에 따라 기분이 달라짐", type: 'F' },
    ],
  },

  // J/P 축 - 생활 방식 (업무 처리 스타일)
  {
    id: 10,
    axis: 'JP',
    question: "업무 마감이 다가올 때?",
    situation: "⏰ 중요한 마감이 3일 남음",
    options: [
      { text: "이미 80%는 끝남. 여유롭게 마무리하면 돼", type: 'J' },
      { text: "아직 시간 있어... 내일부터 본격적으로 하면 되지", type: 'P' },
    ],
  },
  {
    id: 11,
    axis: 'JP',
    question: "갑자기 업무 계획이 바뀌면?",
    situation: "🔄 급하게 바뀐 일정 통보",
    options: [
      { text: "계획 틀어지면 좀 스트레스... 미리 말해줬으면", type: 'J' },
      { text: "뭐 어때, 유연하게 대응하면 되지! 원래 일이 그렇지", type: 'P' },
    ],
  },
  {
    id: 12,
    axis: 'JP',
    question: "하루 업무를 시작할 때?",
    situation: "🌅 출근 후 첫 30분",
    options: [
      { text: "오늘 할 일 리스트 작성하고 우선순위 정해서 시작", type: 'J' },
      { text: "일단 긴급한 거부터, 그때그때 상황 봐가면서", type: 'P' },
    ],
  },
];

export interface WorkMbtiType {
  type: string;
  name: string;
  emoji: string;
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  teamTip: string;
  color: string;
}

export const workMbtiTypes: Record<string, WorkMbtiType> = {
  ESTJ: {
    type: 'ESTJ',
    name: '팀장감 리더',
    emoji: '👔',
    title: '체계적인 조직의 기둥',
    description: '체계와 규칙을 중요시하는 당신! 책임감 강하고 일 처리가 깔끔해서 주변에서 믿고 맡기는 스타일이에요. 팀을 이끌어나가는 데 탁월한 능력을 보여요.',
    strengths: ['뛰어난 조직력과 실행력', '책임감 있는 업무 처리', '명확한 의사결정'],
    weaknesses: ['융통성이 부족할 때가 있음', '다른 사람 감정에 둔감할 수 있음'],
    teamTip: 'INFP, ENFP와 일하면 창의성 보완 가능!',
    color: 'from-blue-600 to-blue-800',
  },
  ESTP: {
    type: 'ESTP',
    name: '해결사',
    emoji: '🔧',
    title: '문제 해결의 달인',
    description: '현장에서 즉각적인 판단과 실행이 필요할 때 빛나는 타입! 위기 상황에서도 침착하게 해결책을 찾아내는 능력자예요.',
    strengths: ['빠른 문제 해결 능력', '현실적이고 실용적', '위기 대응력 탁월'],
    weaknesses: ['장기적 계획에 약함', '루틴한 업무에 지루함을 느낌'],
    teamTip: 'INFJ, INTJ의 전략적 시각이 도움이 돼요!',
    color: 'from-orange-500 to-red-600',
  },
  ESFJ: {
    type: 'ESFJ',
    name: '분위기 메이커',
    emoji: '🤝',
    title: '팀의 윤활유',
    description: '사람들 사이의 관계를 중요시하고, 팀 분위기를 화목하게 만드는 데 일가견이 있어요. 동료들의 기분을 잘 살피고 배려하는 타입!',
    strengths: ['뛰어난 대인관계 능력', '팀 화합을 이끄는 힘', '세심한 배려와 공감'],
    weaknesses: ['갈등 상황을 피하려는 경향', '자기 의견 표현이 어려울 때'],
    teamTip: 'INTP, ISTP의 객관적 시각이 균형을 잡아줘요!',
    color: 'from-pink-500 to-rose-600',
  },
  ESFP: {
    type: 'ESFP',
    name: '에너자이저',
    emoji: '🎉',
    title: '긍정 에너지 뿜뿜',
    description: '회사의 활력소! 밝은 에너지로 주변을 환하게 만들어요. 사람들과 어울리는 걸 좋아하고, 분위기를 띄우는 데 천부적인 재능이 있어요.',
    strengths: ['밝은 분위기 조성', '빠른 적응력', '사람들과 잘 어울림'],
    weaknesses: ['세부사항 놓칠 때가 있음', '장기 프로젝트 집중력 유지 어려움'],
    teamTip: 'ISTJ, INTJ가 디테일을 챙겨줄 수 있어요!',
    color: 'from-yellow-400 to-orange-500',
  },
  ENTJ: {
    type: 'ENTJ',
    name: 'CEO형',
    emoji: '🦅',
    title: '타고난 전략가',
    description: '큰 그림을 보고 목표를 향해 돌진하는 타입! 리더십이 뛰어나고, 조직을 이끌어 성과를 내는 데 탁월해요. 야망과 추진력의 상징!',
    strengths: ['전략적 사고력', '강력한 리더십', '목표 달성 의지'],
    weaknesses: ['독단적으로 보일 수 있음', '감정적 교류에 서툴 때'],
    teamTip: 'ISFJ, INFP의 섬세함이 균형을 맞춰줘요!',
    color: 'from-purple-600 to-indigo-800',
  },
  ENTP: {
    type: 'ENTP',
    name: '아이디어 뱅크',
    emoji: '💡',
    title: '창의력 폭발 기획자',
    description: '아이디어가 샘솟는 타입! 틀에 박힌 생각을 싫어하고, 항상 새로운 가능성을 탐색해요. 토론과 브레인스토밍에서 빛을 발해요.',
    strengths: ['창의적 문제해결', '빠른 상황 파악', '다양한 관점 제시'],
    weaknesses: ['마무리가 아쉬울 때', '반복 업무에 흥미 잃음'],
    teamTip: 'ISTJ, ISFJ가 실행력을 보완해줘요!',
    color: 'from-cyan-500 to-blue-600',
  },
  ENFJ: {
    type: 'ENFJ',
    name: '멘토형',
    emoji: '🌟',
    title: '팀원 성장의 조력자',
    description: '사람들의 잠재력을 발견하고 성장시키는 데 관심이 많아요. 팀원들에게 동기부여하고, 함께 성장하는 걸 중요하게 생각하는 타입!',
    strengths: ['뛰어난 동기부여 능력', '팀원 육성에 강함', '공감과 소통 능력'],
    weaknesses: ['자신보다 남을 우선시함', '비판에 민감할 수 있음'],
    teamTip: 'ISTP, INTP의 객관성이 균형을 맞춰줘요!',
    color: 'from-emerald-500 to-teal-600',
  },
  ENFP: {
    type: 'ENFP',
    name: '열정 전도사',
    emoji: '🔥',
    title: '아이디어와 열정의 화신',
    description: '새로운 것에 대한 호기심과 열정이 넘쳐요! 사람들과 아이디어를 나누는 걸 좋아하고, 팀에 활력을 불어넣는 타입이에요.',
    strengths: ['창의적 사고', '높은 열정과 에너지', '사람들과의 연결고리'],
    weaknesses: ['산만해질 때가 있음', '현실적 제약 고려 부족'],
    teamTip: 'ISTJ, ESTJ가 현실성을 보완해줘요!',
    color: 'from-orange-400 to-pink-500',
  },
  ISTJ: {
    type: 'ISTJ',
    name: '믿음직 실무자',
    emoji: '📋',
    title: '꼼꼼함의 대명사',
    description: '맡은 일은 완벽하게! 책임감 있고 꼼꼼한 업무 처리로 신뢰를 받는 타입이에요. 원칙과 절차를 중요시하며, 안정적인 성과를 만들어내요.',
    strengths: ['뛰어난 책임감', '정확하고 꼼꼼한 업무', '안정적 성과 창출'],
    weaknesses: ['변화에 적응이 느릴 때', '융통성이 부족해 보일 수 있음'],
    teamTip: 'ENFP, ENTP의 창의성이 새로운 시각을 줘요!',
    color: 'from-gray-600 to-gray-800',
  },
  ISTP: {
    type: 'ISTP',
    name: '쿨한 전문가',
    emoji: '🛠️',
    title: '묵묵히 일하는 장인',
    description: '말보다 행동으로 보여주는 타입! 논리적이고 분석적인 사고로 문제를 해결해요. 필요할 때 나서서 빠르게 처리하는 실용주의자예요.',
    strengths: ['뛰어난 분석력', '실용적 문제해결', '침착한 위기 대응'],
    weaknesses: ['감정 표현에 서툼', '협업보다 독립 업무 선호'],
    teamTip: 'ENFJ, ESFJ가 팀워크를 도와줄 수 있어요!',
    color: 'from-slate-600 to-zinc-700',
  },
  ISFJ: {
    type: 'ISFJ',
    name: '든든한 서포터',
    emoji: '🛡️',
    title: '묵묵히 챙기는 수호자',
    description: '조용히 팀을 지원하는 타입! 세심하게 챙기고, 뒤에서 팀이 잘 굴러가도록 만드는 숨은 공신이에요. 배려심 넘치는 동료!',
    strengths: ['세심한 배려', '안정적 업무 지원', '뛰어난 기억력과 꼼꼼함'],
    weaknesses: ['자기주장이 약할 때', '변화를 두려워할 수 있음'],
    teamTip: 'ENTP, ENTJ의 추진력이 새로운 도전을 도와줘요!',
    color: 'from-sky-500 to-blue-600',
  },
  ISFP: {
    type: 'ISFP',
    name: '감성 크리에이터',
    emoji: '🎨',
    title: '조용한 예술가 감성',
    description: '조용하지만 내면에는 풍부한 감성이 있어요. 자유로운 분위기에서 창의력이 발휘되고, 자기만의 방식으로 업무를 풀어가는 타입!',
    strengths: ['창의적 감각', '유연한 사고방식', '조화로운 팀플레이'],
    weaknesses: ['갈등 상황 회피', '마감 압박에 약함'],
    teamTip: 'ESTJ, ENTJ의 추진력이 실행을 도와줘요!',
    color: 'from-violet-400 to-purple-500',
  },
  INTJ: {
    type: 'INTJ',
    name: '전략 설계사',
    emoji: '🏗️',
    title: '장기적 비전의 소유자',
    description: '큰 그림을 그리고 전략을 세우는 데 탁월해요. 독립적이고 분석적이며, 목표를 향해 체계적으로 나아가는 타입이에요.',
    strengths: ['뛰어난 전략적 사고', '독립적 업무 능력', '장기적 계획 수립'],
    weaknesses: ['팀워크에 어려움 느낄 때', '완벽주의 성향'],
    teamTip: 'ESFP, ENFP의 사교성이 팀 내 관계를 도와줘요!',
    color: 'from-indigo-600 to-violet-700',
  },
  INTP: {
    type: 'INTP',
    name: '논리 분석가',
    emoji: '🔬',
    title: '이론과 분석의 귀재',
    description: '논리적 사고와 분석이 강점! 복잡한 문제를 풀어내는 데 재능이 있어요. 지적 호기심이 강하고, 깊이 있는 탐구를 좋아해요.',
    strengths: ['뛰어난 분석력', '논리적 문제해결', '객관적 판단'],
    weaknesses: ['실행보다 생각이 앞설 때', '대인관계에 서툴 수 있음'],
    teamTip: 'ESFJ, ENFJ의 소통력이 협업을 도와줘요!',
    color: 'from-teal-500 to-cyan-600',
  },
  INFJ: {
    type: 'INFJ',
    name: '비전 제시자',
    emoji: '🔮',
    title: '이상을 현실로',
    description: '깊은 통찰력과 이상적인 비전을 가진 타입! 조용하지만 자기만의 신념이 확고하고, 의미 있는 일에 헌신하는 성향이에요.',
    strengths: ['깊은 통찰력', '의미 있는 목표 추구', '공감과 이해'],
    weaknesses: ['현실과 이상 사이 갈등', '완벽주의 경향'],
    teamTip: 'ESTP, ISTP의 현실감각이 실행을 도와줘요!',
    color: 'from-purple-500 to-pink-600',
  },
  INFP: {
    type: 'INFP',
    name: '가치 추구자',
    emoji: '🌈',
    title: '진정성 있는 이상주의자',
    description: '자신만의 가치관이 뚜렷하고, 진정성을 중요시해요. 창의적이고 감성적이며, 의미 있는 일을 할 때 최고의 성과를 내요.',
    strengths: ['창의적 사고', '깊은 공감능력', '진정성 있는 태도'],
    weaknesses: ['비판에 민감함', '현실적 제약에 힘들어함'],
    teamTip: 'ESTJ, ENTJ의 실행력이 아이디어 실현을 도와줘요!',
    color: 'from-rose-400 to-pink-500',
  },
};

export function calculateMbti(answers: string[]): string {
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  answers.forEach((answer) => {
    counts[answer as keyof typeof counts]++;
  });

  const E_I = counts.E >= counts.I ? 'E' : 'I';
  const S_N = counts.S >= counts.N ? 'S' : 'N';
  const T_F = counts.T >= counts.F ? 'T' : 'F';
  const J_P = counts.J >= counts.P ? 'J' : 'P';

  return `${E_I}${S_N}${T_F}${J_P}`;
}

export function getMbtiResult(mbtiType: string): WorkMbtiType {
  return workMbtiTypes[mbtiType] || workMbtiTypes.ISTJ;
}
