# 바이럴 웹사이트 프로젝트

20-30대 직장인 타겟 바이럴 웹사이트

## 기술 스택
- React 19 + TypeScript + Vite
- Tailwind CSS
- recharts (차트)
- date-fns (날짜 계산)
- react-router-dom (라우팅)
- react-helmet-async (SEO)

## 프로젝트 구조
```
src/
├── components/     # 공통 컴포넌트 (Layout, SEO, Button, Card 등)
├── features/       # 기능별 폴더
│   ├── salary-calc/      # 연봉 실수령액 계산기
│   ├── retirement-calc/  # 퇴직금 계산기
│   ├── spending-quiz/    # 소비성향 테스트
│   └── work-mbti/        # 직장인 MBTI
├── pages/          # 페이지 컴포넌트
├── hooks/          # 공통 훅
├── utils/          # 유틸 함수
└── styles/         # 글로벌 스타일
```

## 주요 기능
1. **연봉 실수령액 계산기**: 2025년 세율 기준, 4대보험 + 소득세 공제
2. **퇴직금 계산기**: 평균임금 기반 퇴직금 계산
3. **소비성향 테스트**: 6가지 유형 (플렉스형, 가치소비형, 짠돌이형, 충동구매형, 계획형, 투자형)
4. **직장인 MBTI**: 16가지 유형 직장 버전

## 개발 명령어
```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

## 배포
Vercel 배포 예정
