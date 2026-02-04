export interface QuizOption {
  text: string;
  scores: {
    flex: number;
    value: number;
    saver: number;
    impulse: number;
    planner: number;
    investor: number;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  situation?: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "월급날! 통장에 돈이 들어왔어요. 가장 먼저 하는 행동은?",
    situation: "📱 월급 입금 알림이 왔다",
    options: [
      {
        text: "일단 쇼핑몰 앱부터 켠다. 이번 달 살 게 좀 있어서...",
        scores: { flex: 2, value: 0, saver: 0, impulse: 3, planner: 0, investor: 0 },
      },
      {
        text: "저축, 투자, 고정비 자동이체 확인! 남은 돈으로 계획 세우기",
        scores: { flex: 0, value: 0, saver: 2, impulse: 0, planner: 3, investor: 2 },
      },
      {
        text: "이번 달에 사고 싶던 거 있었는데... 바로 결제!",
        scores: { flex: 3, value: 1, saver: 0, impulse: 2, planner: 0, investor: 0 },
      },
      {
        text: "얼마나 들어왔나 확인하고, 투자 계좌에 추가 입금",
        scores: { flex: 0, value: 0, saver: 2, impulse: 0, planner: 1, investor: 3 },
      },
    ],
  },
  {
    id: 2,
    question: "친구들과 맛집에 갔는데, 메뉴판을 보니...",
    situation: "🍽️ 가격대가 생각보다 높다",
    options: [
      {
        text: "여기까지 왔는데! 시그니처 메뉴 + 사이드 + 디저트까지",
        scores: { flex: 3, value: 1, saver: 0, impulse: 2, planner: 0, investor: 0 },
      },
      {
        text: "가성비 메뉴 찾아보고, 리뷰에서 추천하는 거 시키기",
        scores: { flex: 0, value: 3, saver: 1, impulse: 0, planner: 2, investor: 0 },
      },
      {
        text: "제일 싼 거 시키고, 집에서 라면 먹을 걸 후회 중",
        scores: { flex: 0, value: 0, saver: 3, impulse: 0, planner: 1, investor: 1 },
      },
      {
        text: "오늘은 특별한 날이니까~ 분위기에 맞게 적당히",
        scores: { flex: 1, value: 2, saver: 0, impulse: 1, planner: 1, investor: 0 },
      },
    ],
  },
  {
    id: 3,
    question: "퇴근길, SNS에서 본 신상 아이템이 자꾸 생각나요",
    situation: "💭 요즘 계속 그 제품 광고가 보인다",
    options: [
      {
        text: "지금 당장 주문! 내일 출근할 때 기분 좋을 거야",
        scores: { flex: 2, value: 0, saver: 0, impulse: 3, planner: 0, investor: 0 },
      },
      {
        text: "장바구니에 담아두고, 3일 후에 다시 생각해보기",
        scores: { flex: 0, value: 1, saver: 1, impulse: 0, planner: 3, investor: 1 },
      },
      {
        text: "비슷한 거 집에 있는데... 그냥 그걸로 만족",
        scores: { flex: 0, value: 0, saver: 3, impulse: 0, planner: 1, investor: 1 },
      },
      {
        text: "이 가격이면 차라리 그 돈으로 주식 사는 게 낫지 않나?",
        scores: { flex: 0, value: 0, saver: 1, impulse: 0, planner: 1, investor: 3 },
      },
    ],
  },
  {
    id: 4,
    question: "갑자기 보너스가 들어왔어요! 얼마 안 되지만...",
    situation: "💰 예상치 못한 50만원이 생겼다",
    options: [
      {
        text: "이건 없던 돈이니까! 평소에 못 사던 거 지르자",
        scores: { flex: 3, value: 0, saver: 0, impulse: 2, planner: 0, investor: 0 },
      },
      {
        text: "반은 저축, 반은 나를 위한 작은 선물",
        scores: { flex: 1, value: 2, saver: 1, impulse: 0, planner: 2, investor: 1 },
      },
      {
        text: "전액 비상금 통장으로! 언젠간 쓸 일 있겠지",
        scores: { flex: 0, value: 0, saver: 3, impulse: 0, planner: 2, investor: 1 },
      },
      {
        text: "이걸로 뭘 사면 몇 년 후에 얼마가 될까... 일단 투자!",
        scores: { flex: 0, value: 0, saver: 1, impulse: 0, planner: 1, investor: 3 },
      },
    ],
  },
  {
    id: 5,
    question: "친구가 해외여행 가자고 해요. 당신의 반응은?",
    situation: "✈️ 2박 3일 일본 여행, 예상 경비 80만원",
    options: [
      {
        text: "무조건 가야지! 인생은 한 번뿐이야. 카드 결제 ㄱㄱ",
        scores: { flex: 3, value: 1, saver: 0, impulse: 2, planner: 0, investor: 0 },
      },
      {
        text: "가고는 싶은데... 일단 최저가 항공권이랑 숙소부터 검색",
        scores: { flex: 0, value: 3, saver: 1, impulse: 0, planner: 2, investor: 0 },
      },
      {
        text: "그 돈이면 국내에서 더 좋은 곳 갈 수 있어. 패스",
        scores: { flex: 0, value: 1, saver: 3, impulse: 0, planner: 1, investor: 1 },
      },
      {
        text: "여행 적금이 얼마 모였더라? 목표 달성하면 그때 가자",
        scores: { flex: 0, value: 1, saver: 2, impulse: 0, planner: 3, investor: 1 },
      },
    ],
  },
  {
    id: 6,
    question: "좋아하는 브랜드에서 한정판이 나왔어요!",
    situation: "🔥 곧 품절될 것 같은 한정 수량 아이템",
    options: [
      {
        text: "한정판이잖아! 지금 안 사면 평생 후회해. 바로 결제!",
        scores: { flex: 3, value: 0, saver: 0, impulse: 3, planner: 0, investor: 0 },
      },
      {
        text: "정말 필요한가? 기존 제품이랑 뭐가 다른지 비교해보기",
        scores: { flex: 0, value: 3, saver: 1, impulse: 0, planner: 2, investor: 0 },
      },
      {
        text: "한정판이라는 말에 현혹 안 돼. 어차피 쓰면 다 똑같아",
        scores: { flex: 0, value: 0, saver: 3, impulse: 0, planner: 1, investor: 1 },
      },
      {
        text: "리셀가가 오를 것 같으면 투자 개념으로 사볼까...",
        scores: { flex: 1, value: 0, saver: 0, impulse: 1, planner: 1, investor: 3 },
      },
    ],
  },
  {
    id: 7,
    question: "스트레스 받는 날, 나만의 해소법은?",
    situation: "😤 오늘 하루가 너무 힘들었다",
    options: [
      {
        text: "쇼핑이 최고의 힐링! 온라인 장바구니 털기 시작",
        scores: { flex: 2, value: 0, saver: 0, impulse: 3, planner: 0, investor: 0 },
      },
      {
        text: "맛있는 거 먹으러 가기. 오늘만큼은 가격표 안 봐!",
        scores: { flex: 3, value: 1, saver: 0, impulse: 2, planner: 0, investor: 0 },
      },
      {
        text: "집에서 넷플릭스나 보면서 쉬기. 돈 안 쓰고도 힐링 가능",
        scores: { flex: 0, value: 1, saver: 3, impulse: 0, planner: 1, investor: 1 },
      },
      {
        text: "내 주식 계좌나 확인하며... 장기적 관점으로 마음 다잡기",
        scores: { flex: 0, value: 0, saver: 1, impulse: 0, planner: 1, investor: 3 },
      },
    ],
  },
  {
    id: 8,
    question: "마트에서 장을 볼 때 나는...",
    situation: "🛒 주말 장보기 타임",
    options: [
      {
        text: "맛있어 보이는 건 일단 카트에! 새로 나온 것도 다 궁금해",
        scores: { flex: 2, value: 0, saver: 0, impulse: 3, planner: 0, investor: 0 },
      },
      {
        text: "쿠폰 확인, 할인 품목 체크, 1+1 행사 필수 체크",
        scores: { flex: 0, value: 3, saver: 2, impulse: 0, planner: 2, investor: 0 },
      },
      {
        text: "미리 메모해온 것만 정확히 사기. 계획대로!",
        scores: { flex: 0, value: 1, saver: 2, impulse: 0, planner: 3, investor: 0 },
      },
      {
        text: "가성비 최고인 PB상품 위주로. 브랜드보다 실속",
        scores: { flex: 0, value: 2, saver: 3, impulse: 0, planner: 1, investor: 1 },
      },
    ],
  },
  {
    id: 9,
    question: "요즘 집 근처에 새 카페가 생겼어요",
    situation: "☕ 분위기 좋아 보이는 신상 카페",
    options: [
      {
        text: "당연히 가봐야지! 신상은 무조건 경험해봐야 해",
        scores: { flex: 3, value: 1, saver: 0, impulse: 2, planner: 0, investor: 0 },
      },
      {
        text: "일단 인스타 후기부터 검색. 가성비 괜찮으면 가볼게",
        scores: { flex: 0, value: 3, saver: 1, impulse: 0, planner: 2, investor: 0 },
      },
      {
        text: "집에서 내려 마시는 커피가 최고야. 카페값 아껴서 저축!",
        scores: { flex: 0, value: 0, saver: 3, impulse: 0, planner: 1, investor: 2 },
      },
      {
        text: "한 달에 카페 예산 정해놓은 거 있어서... 남으면 가볼게",
        scores: { flex: 0, value: 1, saver: 1, impulse: 0, planner: 3, investor: 1 },
      },
    ],
  },
  {
    id: 10,
    question: "가전제품 사려고 하는데, 최신 모델과 이전 모델 중...",
    situation: "📺 가격 차이는 30만원 정도",
    options: [
      {
        text: "당연히 최신! 몇 년은 쓸 건데 좋은 거 사야지",
        scores: { flex: 3, value: 1, saver: 0, impulse: 1, planner: 1, investor: 0 },
      },
      {
        text: "기능 차이 꼼꼼히 비교해보고, 내게 필요한 기능 있으면 최신으로",
        scores: { flex: 0, value: 3, saver: 1, impulse: 0, planner: 2, investor: 0 },
      },
      {
        text: "이전 모델도 충분해. 30만원 아끼는 게 이득",
        scores: { flex: 0, value: 1, saver: 3, impulse: 0, planner: 1, investor: 1 },
      },
      {
        text: "중고로 사면 더 싸지 않을까? 중고 매물 먼저 검색",
        scores: { flex: 0, value: 2, saver: 2, impulse: 0, planner: 1, investor: 2 },
      },
    ],
  },
  {
    id: 11,
    question: "연말정산 환급금이 들어왔어요!",
    situation: "💸 예상보다 많은 환급금 30만원",
    options: [
      {
        text: "국가에서 주는 용돈 개념! 그동안 참았던 거 사야지",
        scores: { flex: 3, value: 0, saver: 0, impulse: 2, planner: 0, investor: 0 },
      },
      {
        text: "평소 갖고 싶었던 것 중 정말 가치 있는 것 하나만!",
        scores: { flex: 1, value: 3, saver: 0, impulse: 0, planner: 2, investor: 0 },
      },
      {
        text: "원래 없던 돈이니까 바로 저축 계좌로~",
        scores: { flex: 0, value: 0, saver: 3, impulse: 0, planner: 2, investor: 1 },
      },
      {
        text: "마침 주식 좀 더 사고 싶었는데, 투자 계좌로 GO",
        scores: { flex: 0, value: 0, saver: 1, impulse: 0, planner: 1, investor: 3 },
      },
    ],
  },
  {
    id: 12,
    question: "친구 결혼식 축의금, 얼마를 낼까요?",
    situation: "💒 그렇게 친하진 않지만 초대받은 결혼식",
    options: [
      {
        text: "요즘 물가에 5만원은 쪽팔려. 10만원은 내야지",
        scores: { flex: 3, value: 1, saver: 0, impulse: 1, planner: 0, investor: 0 },
      },
      {
        text: "친밀도에 따라 적정선! 5만원이면 충분하지 않을까",
        scores: { flex: 0, value: 3, saver: 1, impulse: 0, planner: 2, investor: 0 },
      },
      {
        text: "축의금 대신 정성 담은 선물로 대체하면 안 될까...",
        scores: { flex: 0, value: 2, saver: 2, impulse: 0, planner: 1, investor: 1 },
      },
      {
        text: "경조사비 예산 따로 빼놓은 거 있어서 거기서 쓰기",
        scores: { flex: 0, value: 1, saver: 1, impulse: 0, planner: 3, investor: 1 },
      },
    ],
  },
];

export interface SpendingType {
  id: string;
  name: string;
  emoji: string;
  title: string;
  description: string;
  characteristics: string[];
  advice: string;
  color: string;
}

export const spendingTypes: SpendingType[] = [
  {
    id: 'flex',
    name: '플렉스형',
    emoji: '💎',
    title: '오늘을 즐기는 FLEX 마스터',
    description: '인생은 한 번뿐! 지금 이 순간을 즐기는 것이 최고의 투자라고 생각해요. 좋은 것, 맛있는 것, 예쁜 것에 아낌없이 투자하는 스타일이에요.',
    characteristics: [
      '트렌디한 아이템은 무조건 득템',
      '좋은 경험을 위한 지출은 아깝지 않음',
      '주변 사람들에게도 베푸는 걸 좋아함',
      '미래보다 현재의 행복이 중요',
    ],
    advice: '현재를 즐기는 것도 중요하지만, 미래의 나를 위한 작은 저축 습관을 만들어보는 건 어떨까요? 월급의 10%만이라도요!',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'value',
    name: '가치소비형',
    emoji: '⚖️',
    title: '현명한 가치 추구자',
    description: '가격보다 가치를 중요시해요. 싼 게 비지떡이라는 말을 믿으며, 좋은 품질의 제품에는 합당한 비용을 지불할 준비가 되어있어요.',
    characteristics: [
      '가성비보다 가심비를 추구',
      '구매 전 꼼꼼한 리서치는 필수',
      '오래 쓸 수 있는 제품 선호',
      '브랜드보다 품질을 중시',
    ],
    advice: '현명한 소비 습관을 가지고 계시네요! 다만 가끔은 계획에 없던 작은 사치도 괜찮아요. 스스로에게 선물하는 시간도 필요하답니다.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'saver',
    name: '짠돌이/짠순이형',
    emoji: '🐿️',
    title: '미래를 위한 저축 달인',
    description: '한 푼이라도 아끼는 것이 미덕! 불필요한 지출은 최소화하고, 알뜰하게 살면서 미래를 위한 자산을 차곡차곡 모으고 있어요.',
    characteristics: [
      '할인, 쿠폰, 적립은 기본',
      '충동구매? 그게 뭔가요?',
      '비상금 통장이 든든한 내 자산',
      '안 쓰는 게 버는 거라는 철학',
    ],
    advice: '훌륭한 저축 습관이에요! 하지만 가끔은 스스로를 위한 작은 보상도 필요해요. 경험에 투자하는 것도 나쁘지 않답니다.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'impulse',
    name: '충동구매형',
    emoji: '⚡',
    title: '순간의 감정에 충실한 쇼퍼',
    description: '보는 순간 사야 해! 감정에 충실한 소비 스타일이에요. 쇼핑이 스트레스 해소 방법이기도 하고, 갖고 싶은 건 참지 못해요.',
    characteristics: [
      '"이건 운명이야" 하며 결제',
      '쇼핑 후 약간의 후회가 따라옴',
      'SNS 광고에 약한 편',
      '장바구니 = 위시리스트',
    ],
    advice: '구매 전 24시간 규칙을 적용해보세요! 하루 지나고도 생각나면 그때 사는 거예요. 충동구매가 확 줄어들 거예요.',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'planner',
    name: '계획형',
    emoji: '📊',
    title: '철저한 예산 관리자',
    description: '모든 지출에는 계획이 있다! 가계부 작성은 기본이고, 월별/항목별 예산을 세워서 체계적으로 관리해요.',
    characteristics: [
      '월초에 예산 계획 세우기',
      '가계부 앱은 필수',
      '예정에 없던 지출은 스트레스',
      '목표 달성의 기쁨을 아는 사람',
    ],
    advice: '계획적인 소비 습관, 정말 멋져요! 다만 너무 빡빡한 예산은 스트레스가 될 수 있어요. 여유 예산도 조금 남겨두세요.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'investor',
    name: '투자형',
    emoji: '📈',
    title: '미래 수익을 꿈꾸는 투자자',
    description: '지출보다 투자! 돈을 쓰기보다 불리는 것에 관심이 많아요. 모든 소비를 투자 관점에서 바라보는 경향이 있어요.',
    characteristics: [
      '주식/코인/부동산에 관심 많음',
      '소비하면 기회비용 생각',
      '복리의 마법을 믿는 사람',
      '경제 뉴스 체크는 일상',
    ],
    advice: '투자 마인드 훌륭해요! 하지만 현재의 삶의 질도 중요해요. 모든 걸 미래로 미루지 말고, 지금의 행복도 챙기세요.',
    color: 'from-yellow-500 to-orange-500',
  },
];

export function calculateResult(answers: number[]): SpendingType {
  const scores = {
    flex: 0,
    value: 0,
    saver: 0,
    impulse: 0,
    planner: 0,
    investor: 0,
  };

  answers.forEach((answerIndex, questionIndex) => {
    const question = quizQuestions[questionIndex];
    const selectedOption = question.options[answerIndex];

    Object.entries(selectedOption.scores).forEach(([key, value]) => {
      scores[key as keyof typeof scores] += value;
    });
  });

  const maxType = Object.entries(scores).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  return spendingTypes.find(type => type.id === maxType) || spendingTypes[0];
}
