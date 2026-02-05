// 이모지 퀴즈 데이터

export interface QuizQuestion {
  id: number;
  emoji: string;
  answer: string;
  options: string[];
  category: 'movie' | 'drama' | 'song' | 'food' | 'proverb' | 'brand';
  hint: string;
}

export const categoryNames: Record<string, string> = {
  movie: '🎬 영화',
  drama: '📺 드라마',
  song: '🎵 노래/가수',
  food: '🍔 음식',
  proverb: '💬 속담',
  brand: '🏢 브랜드',
};

export const quizQuestions: QuizQuestion[] = [
  // 영화
  { id: 1, emoji: '🦁👑', answer: '라이온킹', options: ['라이온킹', '정글북', '마다가스카', '주토피아'], category: 'movie', hint: '4글자' },
  { id: 2, emoji: '🧊🚢💔', answer: '타이타닉', options: ['타이타닉', '포세이돈', '캐리비안의 해적', '워터월드'], category: 'movie', hint: '4글자' },
  { id: 3, emoji: '🕷️🦸‍♂️🏙️', answer: '스파이더맨', options: ['스파이더맨', '배트맨', '슈퍼맨', '앤트맨'], category: 'movie', hint: '5글자' },
  { id: 4, emoji: '👻👻👻🔫', answer: '고스트버스터즈', options: ['고스트버스터즈', '맨인블랙', '프레데터', '에이리언'], category: 'movie', hint: '7글자' },
  { id: 5, emoji: '🧙‍♂️💍🌋', answer: '반지의 제왕', options: ['반지의 제왕', '해리포터', '나니아 연대기', '호빗'], category: 'movie', hint: '5글자' },
  { id: 6, emoji: '🤖👦❤️', answer: 'A.I.', options: ['A.I.', '아이로봇', '터미네이터', '월-E'], category: 'movie', hint: '4글자' },
  { id: 7, emoji: '🦖🏝️🔬', answer: '쥬라기공원', options: ['쥬라기공원', '킹콩', '고질라', '아바타'], category: 'movie', hint: '5글자' },
  { id: 8, emoji: '🐀👨‍🍳🇫🇷', answer: '라따뚜이', options: ['라따뚜이', '레미제라블', '아멜리에', '인터스텔라'], category: 'movie', hint: '4글자' },
  { id: 9, emoji: '🧊❄️👸⛄', answer: '겨울왕국', options: ['겨울왕국', '모아나', '라푼젤', '신데렐라'], category: 'movie', hint: '4글자' },
  { id: 10, emoji: '🦇🌃🃏', answer: '다크나이트', options: ['다크나이트', '배트맨', '조커', '수어사이드 스쿼드'], category: 'movie', hint: '5글자' },
  { id: 11, emoji: '👽📞🏠', answer: 'E.T.', options: ['E.T.', '에이리언', '컨택트', '인디펜던스데이'], category: 'movie', hint: '4글자' },
  { id: 12, emoji: '🚗⚡🕐', answer: '백투더퓨처', options: ['백투더퓨처', '터미네이터', '인터스텔라', '타임머신'], category: 'movie', hint: '6글자' },
  { id: 13, emoji: '🦈🏊‍♂️😱', answer: '죠스', options: ['죠스', '딥블루씨', '메가로돈', '샤크네이도'], category: 'movie', hint: '2글자' },
  { id: 14, emoji: '🐼🥋🍜', answer: '쿵푸팬더', options: ['쿵푸팬더', '무파사', '마다가스카', '슈렉'], category: 'movie', hint: '5글자' },
  { id: 15, emoji: '🧪💚😈', answer: '헐크', options: ['헐크', '배트맨', '아이언맨', '스파이더맨'], category: 'movie', hint: '2글자' },
  { id: 16, emoji: '🏴‍☠️💀🚢', answer: '캐리비안의 해적', options: ['캐리비안의 해적', '보물섬', '피터팬', '모아나'], category: 'movie', hint: '7글자' },
  { id: 17, emoji: '🤴🐸💋', answer: '공주와 개구리', options: ['공주와 개구리', '신데렐라', '인어공주', '백설공주'], category: 'movie', hint: '6글자' },
  { id: 18, emoji: '🔪🚿😱', answer: '싸이코', options: ['싸이코', '샤이닝', '스크림', '미저리'], category: 'movie', hint: '3글자' },

  // 드라마
  { id: 19, emoji: '🦑🎮💀', answer: '오징어게임', options: ['오징어게임', '앨리스인더랜드', '더 글로리', '지옥'], category: 'drama', hint: '5글자' },
  { id: 20, emoji: '👨‍⚕️🏥💕', answer: '낭만닥터', options: ['낭만닥터', '슬기로운의사생활', '굿닥터', '닥터스'], category: 'drama', hint: '4글자' },
  { id: 21, emoji: '👑🏰🗡️', answer: '왕좌의게임', options: ['왕좌의게임', '킹덤', '조선구마사', '육룡이나르샤'], category: 'drama', hint: '5글자' },
  { id: 22, emoji: '🧟‍♂️🇰🇷🏃', answer: '킹덤', options: ['킹덤', '살아있다', '부산행', '지금우리학교는'], category: 'drama', hint: '2글자' },
  { id: 23, emoji: '⚖️👨‍⚖️😈', answer: '이상한변호사우영우', options: ['이상한변호사우영우', '빈센조', '로스쿨', '모범택시'], category: 'drama', hint: '9글자' },
  { id: 24, emoji: '💊🔬🧪', answer: '브레이킹배드', options: ['브레이킹배드', '나르코스', '오자크', '위드'], category: 'drama', hint: '6글자' },
  { id: 25, emoji: '🏫👻😱', answer: '지금우리학교는', options: ['지금우리학교는', '좀비탐정', '킹덤', '살아있다'], category: 'drama', hint: '7글자' },
  { id: 26, emoji: '🌸👩‍❤️‍👨📚', answer: '도깨비', options: ['도깨비', '별에서온그대', '푸른바다의전설', '사랑의불시착'], category: 'drama', hint: '3글자' },
  { id: 27, emoji: '🚁💕🇰🇵', answer: '사랑의불시착', options: ['사랑의불시착', '태양의후예', '별그대', '도깨비'], category: 'drama', hint: '6글자' },
  { id: 28, emoji: '👨‍👩‍👧‍👦🏠💕', answer: '응답하라1988', options: ['응답하라1988', '청춘시대', '슬의생', '미생'], category: 'drama', hint: '7글자' },

  // 노래/가수
  { id: 29, emoji: '🍎🖊️', answer: 'PPAP', options: ['PPAP', '강남스타일', '아기상어', '치킨송'], category: 'song', hint: '4글자' },
  { id: 30, emoji: '🐴🕺🇰🇷', answer: '강남스타일', options: ['강남스타일', 'PPAP', '챔피언', '거꾸로'], category: 'song', hint: '5글자' },
  { id: 31, emoji: '🧈🥞😋', answer: 'Butter', options: ['Butter', 'Dynamite', 'Permission to Dance', 'Life Goes On'], category: 'song', hint: '6글자' },
  { id: 32, emoji: '💣💥🕺', answer: 'Dynamite', options: ['Dynamite', 'Butter', 'Fire', 'DNA'], category: 'song', hint: '8글자' },
  { id: 33, emoji: '🌸👧🖤💗', answer: '블랙핑크', options: ['블랙핑크', '트와이스', '레드벨벳', '에스파'], category: 'song', hint: '4글자' },
  { id: 34, emoji: '7️⃣👦💜', answer: 'BTS', options: ['BTS', 'EXO', 'NCT', 'GOT7'], category: 'song', hint: '3글자' },
  { id: 35, emoji: '🐣🎵👶', answer: '아기상어', options: ['아기상어', '뽀로로', '핑크퐁', '코코몽'], category: 'song', hint: '4글자' },
  { id: 36, emoji: '☀️👋', answer: '안녕', options: ['안녕', '하이', '굿모닝', '헬로'], category: 'song', hint: '2글자' },

  // 음식
  { id: 37, emoji: '🍕🧀🍅', answer: '피자', options: ['피자', '파스타', '라자냐', '리조또'], category: 'food', hint: '2글자' },
  { id: 38, emoji: '🍜🥢🇯🇵', answer: '라멘', options: ['라멘', '우동', '소바', '짬뽕'], category: 'food', hint: '2글자' },
  { id: 39, emoji: '🌶️🥬🇰🇷', answer: '김치', options: ['김치', '깍두기', '동치미', '나박김치'], category: 'food', hint: '2글자' },
  { id: 40, emoji: '🍣🐟🇯🇵', answer: '초밥', options: ['초밥', '회', '사시미', '롤'], category: 'food', hint: '2글자' },
  { id: 41, emoji: '🌮🌯🇲🇽', answer: '타코', options: ['타코', '부리또', '퀘사디아', '나초'], category: 'food', hint: '2글자' },
  { id: 42, emoji: '🍔🍟🥤', answer: '햄버거', options: ['햄버거', '핫도그', '샌드위치', '서브웨이'], category: 'food', hint: '3글자' },
  { id: 43, emoji: '🥟🇨🇳🥢', answer: '만두', options: ['만두', '딤섬', '교자', '샤오롱바오'], category: 'food', hint: '2글자' },
  { id: 44, emoji: '🍝🇮🇹🧀', answer: '파스타', options: ['파스타', '스파게티', '펜네', '뇨끼'], category: 'food', hint: '3글자' },
  { id: 45, emoji: '🍛🍚🇮🇳', answer: '카레', options: ['카레', '비빔밥', '볶음밥', '덮밥'], category: 'food', hint: '2글자' },
  { id: 46, emoji: '🐔🔥🍗', answer: '치킨', options: ['치킨', '통닭', '찜닭', '닭볶음탕'], category: 'food', hint: '2글자' },

  // 속담
  { id: 47, emoji: '🐕🐓💩', answer: '개똥도 약에 쓰려면 없다', options: ['개똥도 약에 쓰려면 없다', '똥 묻은 개가 겨 묻은 개 나무란다', '개 꼬리 삼년 두어도 황모 못 된다', '개도 주인을 알아본다'], category: 'proverb', hint: '11글자' },
  { id: 48, emoji: '🐸🌊', answer: '우물 안 개구리', options: ['우물 안 개구리', '개구리 올챙이 적 생각 못한다', '물에 빠진 개구리', '개구리 울면 비온다'], category: 'proverb', hint: '6글자' },
  { id: 49, emoji: '🦅🐦', answer: '하늘의 별 따기', options: ['하늘의 별 따기', '까마귀 날자 배 떨어진다', '독수리 날개', '새발의 피'], category: 'proverb', hint: '6글자' },
  { id: 50, emoji: '🎂🍰🏃', answer: '금강산도 식후경', options: ['금강산도 식후경', '배보다 배꼽이 더 크다', '밥이 보약이다', '먹고 죽은 귀신이 때깔도 좋다'], category: 'proverb', hint: '7글자' },
  { id: 51, emoji: '⏰💰', answer: '시간은 금이다', options: ['시간은 금이다', '돈이 최고다', '세월이 약이다', '시간이 지나면 다 잊는다'], category: 'proverb', hint: '6글자' },
  { id: 52, emoji: '🐢🏃‍♂️🏆', answer: '느려도 꾸준히', options: ['느려도 꾸준히', '토끼와 거북이', '시작이 반이다', '천리길도 한걸음부터'], category: 'proverb', hint: '5글자' },
  { id: 53, emoji: '🪨💎', answer: '구르는 돌은 이끼가 안 낀다', options: ['구르는 돌은 이끼가 안 낀다', '굴러온 돌이 박힌 돌 빼낸다', '낫 놓고 기역자도 모른다', '돌다리도 두들겨 보고 건너라'], category: 'proverb', hint: '12글자' },
  { id: 54, emoji: '🔥🦋', answer: '불 보듯 뻔하다', options: ['불 보듯 뻔하다', '불난 집에 부채질', '하루살이 불 보듯', '불구덩이에 뛰어들다'], category: 'proverb', hint: '7글자' },

  // 브랜드
  { id: 55, emoji: '🍎📱', answer: '애플', options: ['애플', '삼성', '구글', 'LG'], category: 'brand', hint: '2글자' },
  { id: 56, emoji: '☕🧜‍♀️💚', answer: '스타벅스', options: ['스타벅스', '투썸', '이디야', '커피빈'], category: 'brand', hint: '4글자' },
  { id: 57, emoji: '👟✔️', answer: '나이키', options: ['나이키', '아디다스', '푸마', '뉴발란스'], category: 'brand', hint: '3글자' },
  { id: 58, emoji: '🎈🏰✨', answer: '디즈니', options: ['디즈니', '유니버설', '워너브라더스', '픽사'], category: 'brand', hint: '3글자' },
  { id: 59, emoji: '📦🚚😊', answer: '쿠팡', options: ['쿠팡', '네이버', '11번가', 'G마켓'], category: 'brand', hint: '2글자' },
  { id: 60, emoji: '🔴▶️', answer: '유튜브', options: ['유튜브', '넷플릭스', '틱톡', '트위치'], category: 'brand', hint: '3글자' },
  { id: 61, emoji: '🍔🤡❤️', answer: '맥도날드', options: ['맥도날드', '버거킹', '롯데리아', 'KFC'], category: 'brand', hint: '4글자' },
  { id: 62, emoji: '🏠🛏️🇸🇪', answer: '이케아', options: ['이케아', '한샘', '까사미아', '무인양품'], category: 'brand', hint: '3글자' },
  { id: 63, emoji: '🚗⚡🔋', answer: '테슬라', options: ['테슬라', '현대', 'BMW', '벤츠'], category: 'brand', hint: '3글자' },
  { id: 64, emoji: '💬💛', answer: '카카오', options: ['카카오', '네이버', '라인', '텔레그램'], category: 'brand', hint: '3글자' },
];

// 랜덤으로 문제 섞기
export function getRandomQuestions(count: number, category?: string): QuizQuestion[] {
  let filtered = [...quizQuestions];

  if (category && category !== 'all') {
    filtered = filtered.filter(q => q.category === category);
  }

  // Fisher-Yates 셔플
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }

  return filtered.slice(0, count);
}

// 등급 데이터
export interface QuizGrade {
  id: string;
  name: string;
  emoji: string;
  minPercent: number;
  maxPercent: number;
  title: string;
  description: string;
  bgGradient: string;
}

export const grades: QuizGrade[] = [
  {
    id: 'master',
    name: '이모지 마스터',
    emoji: '🏆',
    minPercent: 90,
    maxPercent: 100,
    title: '이모지 마스터',
    description: '당신은 이모지의 신!',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-500',
  },
  {
    id: 'expert',
    name: '이모지 고수',
    emoji: '🎯',
    minPercent: 70,
    maxPercent: 89,
    title: '이모지 고수',
    description: '이모지 해석 능력 뛰어남!',
    bgGradient: 'from-purple-500 via-violet-500 to-indigo-500',
  },
  {
    id: 'good',
    name: '이모지 중수',
    emoji: '👍',
    minPercent: 50,
    maxPercent: 69,
    title: '이모지 중수',
    description: '평균 이상의 센스!',
    bgGradient: 'from-green-400 via-emerald-500 to-teal-500',
  },
  {
    id: 'beginner',
    name: '이모지 초보',
    emoji: '🌱',
    minPercent: 30,
    maxPercent: 49,
    title: '이모지 초보',
    description: '조금 더 연습이 필요해요',
    bgGradient: 'from-blue-400 via-blue-500 to-indigo-500',
  },
  {
    id: 'newbie',
    name: '이모지 문맹',
    emoji: '😵',
    minPercent: 0,
    maxPercent: 29,
    title: '이모지 문맹',
    description: '이모지가 어려워요...',
    bgGradient: 'from-gray-400 via-gray-500 to-slate-500',
  },
];

export function getGradeByPercent(percent: number): QuizGrade {
  return grades.find(g => percent >= g.minPercent && percent <= g.maxPercent) || grades[grades.length - 1];
}

export const QUESTIONS_PER_ROUND = 10;
export const TIME_PER_QUESTION = 15000; // 15초

// FAQ 데이터
export const emojiQuizFAQ = [
  {
    question: '문제는 몇 개인가요?',
    answer: '한 라운드에 10문제가 출제됩니다. 영화, 드라마, 노래, 음식, 속담, 브랜드 등 다양한 카테고리에서 랜덤으로 출제되며, 매번 다른 문제를 만날 수 있어요!',
  },
  {
    question: '시간 제한이 있나요?',
    answer: '각 문제당 15초의 시간 제한이 있습니다. 시간 내에 답을 선택하지 않으면 오답 처리되니 빠르게 선택해주세요!',
  },
  {
    question: '힌트는 어떻게 사용하나요?',
    answer: '각 문제에서 힌트 버튼을 누르면 정답의 글자 수를 알려드려요. 단, 힌트를 사용하면 해당 문제의 점수가 절반으로 줄어듭니다.',
  },
  {
    question: '점수는 어떻게 계산되나요?',
    answer: '정답을 맞추면 기본 100점이 주어지고, 빠르게 맞출수록 최대 50점의 보너스가 추가됩니다. 힌트 사용 시 점수가 절반이 되고, 오답이나 시간 초과는 0점입니다.',
  },
];
