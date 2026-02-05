# 연봉계산기 & 심리테스트 모음

20-30대 직장인을 위한 바이럴 웹사이트. 연봉 계산부터 재미있는 심리테스트까지!

🔗 **Live Demo**: [viral-site-opal.vercel.app](https://viral-site-opal.vercel.app)

![Preview](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-blue) ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

---

## 주요 기능

### 계산기
| 기능 | 설명 |
|------|------|
| 💰 **연봉 실수령액** | 2025년 세율 기준, 4대보험/세금 공제 계산 |
| 🏦 **퇴직금 계산기** | 입사일/퇴사일 기준 예상 퇴직금 |

### 심리테스트
| 기능 | 설명 |
|------|------|
| 💳 **소비성향 테스트** | 6가지 소비 유형 분석 |
| 👔 **직장인 MBTI** | 회사에서의 나의 성격 유형 |
| 🧠 **스트레스 테스트** | 현재 스트레스 수준 체크 |
| 👴 **꼰대력 테스트** | MZ vs 꼰대 성향 분석 |

### 게임/퀴즈
| 기능 | 설명 |
|------|------|
| 🎨 **색감 테스트** | 15라운드 색상 구분 능력 측정 |
| ⚡ **반응속도 테스트** | 밀리초 단위 반사신경 측정 |
| 🧩 **이모지 퀴즈** | 이모지 조합으로 정답 맞추기 |

### 소셜 기능
- 🏆 **랭킹 시스템** - 실시간 TOP 100
- 🎖️ **뱃지 시스템** - 20개 수집형 뱃지 (CSS/SVG 커스텀 아이콘)
- 👥 **같이하기 모드** - 친구와 실시간 대결 (반응속도)
- 📱 **결과 공유** - 카카오톡, 트위터, 이미지 저장

---

## 기술 스택

```
Frontend:  React 18 + TypeScript + Vite
Styling:   Tailwind CSS
Backend:   Firebase Realtime Database
Deploy:    Vercel
```

### 주요 라이브러리
- `react-router-dom` - 라우팅
- `react-helmet-async` - SEO 메타태그
- `recharts` - 차트 시각화
- `canvas-confetti` - 축하 효과
- `html2canvas` - 결과 이미지 캡처
- `date-fns` - 날짜 계산

---

## 프로젝트 구조

```
src/
├── components/        # 공통 컴포넌트
│   ├── BadgeIcon.tsx  # CSS/SVG 뱃지 아이콘
│   ├── Layout.tsx     # 레이아웃
│   ├── ShareButtons/  # 공유 버튼
│   └── ...
├── features/          # 기능별 모듈
│   ├── salary-calc/   # 연봉 계산기
│   ├── color-test/    # 색감 테스트
│   ├── reaction-test/ # 반응속도 테스트
│   ├── emoji-quiz/    # 이모지 퀴즈
│   └── ...
├── hooks/             # 커스텀 훅
│   ├── useMultiplayer.ts  # 멀티플레이어
│   ├── useRanking.ts      # 랭킹
│   ├── useBadges.ts       # 뱃지
│   └── useLocalStorage.ts # 로컬 저장
├── pages/             # 페이지 컴포넌트
└── data/              # 정적 데이터
```

---

## 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

---

## 환경 변수

Firebase 연동을 위해 별도 설정 필요 없음 (공개 DB URL 사용)

---

## 라이선스

MIT License

---

## 연락처

- Email: pon07084@gmail.com
