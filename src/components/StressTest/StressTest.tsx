import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { stressQuestions, answerOptions, categoryAnalysis } from '../../data/stressQuestions';
import type { Answer, StressResult, StressLevel } from '../../types/stressTest';
import { SEO, Button, ShareButtons, AgeGroupSelect, ageGroupLabels, Recommendations, FAQ, stressFAQ } from '../index';
import { stressTips, stressMusic } from '../../data/stressQuestions';
import { STRESS_LEVELS } from '../../types/stressTest';
import { saveTestResult, useTestStats, calculatePercentage, useTotalParticipants } from '../../hooks/useTestStats';
import { fireConfetti } from '../../hooks/useConfetti';
import { getRarityInfo, getFirstParticipantInfo } from '../../utils/rarityMessage';

type TestPhase = 'intro' | 'ageSelect' | 'questions' | 'result';
type MusicGenre = 'korean' | 'pop';

function getStressLevel(totalScore: number): StressLevel {
  if (totalScore <= 15) return 'low';
  if (totalScore <= 25) return 'moderate';
  if (totalScore <= 35) return 'high';
  return 'veryHigh';
}

function getCategoryLevel(score: number): 'low' | 'moderate' | 'high' | 'danger' {
  if (score <= 1) return 'low';
  if (score <= 2) return 'moderate';
  if (score <= 4) return 'high';
  return 'danger';
}

export function StressTest() {
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<StressResult | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ageGroup, setAgeGroup] = useState<string | null>(null);
  const [resultSaved, setResultSaved] = useState(false);
  const [musicGenre, setMusicGenre] = useState<MusicGenre>('korean');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const confettiFired = useRef(false);

  const { myAgeGroupStats, ageGroupCount } = useTestStats('stress', ageGroup);
  const { totalCount: totalParticipants } = useTotalParticipants('stress');

  // 결과 나올 때 폭죽 발사
  useEffect(() => {
    if (phase === 'result' && result && !confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
    }
  }, [phase, result]);

  const currentQuestion = stressQuestions[currentIndex];
  const progress = ((currentIndex + 1) / stressQuestions.length) * 100;

  // 결과 저장
  useEffect(() => {
    if (result && ageGroup && !resultSaved) {
      saveTestResult('stress', result.level, ageGroup, result.totalScore);
      setResultSaved(true);
    }
  }, [result, ageGroup, resultSaved]);

  const handleStart = useCallback(() => {
    setPhase('ageSelect');
  }, []);

  const handleAgeSelect = useCallback((selectedAge: string) => {
    setAgeGroup(selectedAge);
    setPhase('questions');
    setCurrentIndex(0);
    setAnswers([]);
  }, []);

  const handleAnswer = (score: number) => {
    if (isAnimating) return;

    setSelectedScore(score);
    setIsAnimating(true);

    setTimeout(() => {
      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        score,
      };

      const newAnswers = [...answers, newAnswer];
      setAnswers(newAnswers);

      if (currentIndex < stressQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedScore(null);
      } else {
        // 결과 계산
        const totalScore = newAnswers.reduce((sum, a) => sum + a.score, 0);
        const level = getStressLevel(totalScore);

        // 카테고리별 점수
        const categoryMap = new Map<string, number>();
        newAnswers.forEach((answer) => {
          const question = stressQuestions.find((q) => q.id === answer.questionId);
          if (question) {
            categoryMap.set(question.category, answer.score);
          }
        });

        const categoryScores = Array.from(categoryMap.entries()).map(
          ([category, score]) => ({
            category,
            score,
            maxScore: 5,
          })
        );

        setResult({ totalScore, level, categoryScores });
        setPhase('result');
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleRetry = useCallback(() => {
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
    setSelectedScore(null);
    setAgeGroup(null);
    setResultSaved(false);
    setExpandedCategory(null);
    confettiFired.current = false;
  }, []);

  const levelInfo = useMemo(() => result ? STRESS_LEVELS[result.level] : null, [result]);
  const tips = useMemo(() => result ? stressTips[result.level] : [], [result]);
  const musicList = useMemo(() =>
    result ? stressMusic[result.level].filter(m => m.genre === musicGenre) : [],
    [result, musicGenre]
  );

  // 나이대 비교 데이터
  const myPercentage = useMemo(() =>
    result ? calculatePercentage(myAgeGroupStats, result.level) : 0,
    [myAgeGroupStats, result]
  );

  // 희소성 정보
  const rarityInfo = useMemo(() => {
    if (ageGroup && ageGroupCount > 1) {
      return getRarityInfo(myPercentage, ageGroupLabels[ageGroup], ageGroupCount);
    }
    if (ageGroup) {
      return getFirstParticipantInfo(ageGroupLabels[ageGroup]);
    }
    return null;
  }, [ageGroup, ageGroupCount, myPercentage]);

  // 주의 필요 카테고리 (점수 4 이상)
  const dangerCategories = useMemo(() =>
    result ? result.categoryScores.filter(c => c.score >= 4) : [],
    [result]
  );

  // 양호한 카테고리 (점수 2 이하)
  const goodCategories = useMemo(() =>
    result ? result.categoryScores.filter(c => c.score <= 2) : [],
    [result]
  );

  return (
    <>
      <SEO
        title="스트레스 지수 테스트"
        description="10개의 질문으로 알아보는 나의 스트레스 수준! 수면, 업무, 대인관계 등 영역별 분석과 맞춤 힐링 음악 추천까지!"
        keywords="스트레스테스트,스트레스지수,스트레스측정,심리테스트,멘탈헬스,번아웃테스트,힐링"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Quiz',
          name: '스트레스 지수 테스트',
          description: '10개의 질문으로 스트레스 수준을 측정하고 맞춤 음악을 추천받는 심리테스트',
          url: 'https://viral-site-opal.vercel.app/stress-test',
          educationalLevel: 'beginner',
          about: {
            '@type': 'Thing',
            name: '스트레스 관리'
          }
        }}
      />

      <div className="space-y-6">
        {/* 인트로 */}
        {phase === 'intro' && (
          <div className="text-center animate-fadeIn">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-rose-500/30">
              <span className="text-5xl">🧠</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
              스트레스 지수 테스트
            </h1>
            <p className="text-gray-500 mb-8">
              요즘 나의 스트레스 수준은 어떨까?<br />
              솔직하게 답하면 맞춤 처방을 드려요!
            </p>

            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-around text-sm">
                <div className="text-center">
                  <div className="text-2xl mb-1">📝</div>
                  <div className="text-gray-500">10문항</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl mb-1">⏱️</div>
                  <div className="text-gray-500">2분</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-gray-500">나이대 비교</div>
                </div>
              </div>
            </div>

            {/* 참여자 수 */}
            {totalParticipants > 0 && (
              <div className="flex items-center justify-center gap-2 mb-6 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="text-gray-500">
                  <span className="font-bold text-rose-600">{totalParticipants.toLocaleString()}</span>명이 테스트 완료
                </span>
              </div>
            )}

            <Button onClick={handleStart} size="lg" className="w-full max-w-xs bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600">
              테스트 시작하기
            </Button>
          </div>
        )}

        {/* 나이대 선택 */}
        {phase === 'ageSelect' && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <AgeGroupSelect onSelect={handleAgeSelect} />
            </div>
          </div>
        )}

        {/* 질문 */}
        {phase === 'questions' && currentQuestion && (
          <div className="space-y-6 animate-fadeIn">
            {/* 프로그레스 */}
            <div className="relative">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span className="font-medium text-rose-500">{currentQuestion.category}</span>
                <span>{currentIndex + 1} / {stressQuestions.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-orange-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* 질문 카드 */}
            <div
              className={`bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-8 leading-relaxed text-center">
                  "{currentQuestion.question}"
                </h2>

                <div className="space-y-3">
                  {answerOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      disabled={isAnimating}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                        selectedScore === option.value
                          ? 'border-rose-500 bg-rose-50 scale-[0.98]'
                          : 'border-gray-100 hover:border-rose-200 hover:bg-rose-50/50'
                      } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}`}
                    >
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-gray-700 font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 결과 */}
        {phase === 'result' && result && levelInfo && (
          <div className="space-y-6 animate-fadeIn">
            {/* 결과 헤더 */}
            <div className="text-center">
              <div
                className="w-24 h-24 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-xl"
                style={{ background: `linear-gradient(135deg, ${levelInfo.color}, ${levelInfo.color}dd)` }}
              >
                <span className="text-5xl">
                  {result.level === 'low' && '😊'}
                  {result.level === 'moderate' && '😐'}
                  {result.level === 'high' && '😰'}
                  {result.level === 'veryHigh' && '😫'}
                </span>
              </div>
              {/* 희소성 뱃지 */}
              {rarityInfo && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${rarityInfo.badgeColor} text-white text-sm font-bold mb-3 shadow-lg`}>
                  <span>{rarityInfo.badge}</span>
                  <span className="text-white/80">|</span>
                  <span>{rarityInfo.message}</span>
                </div>
              )}
              <p className="text-gray-400 text-sm mb-1">당신의 스트레스 지수는</p>
              <h1 className="text-4xl font-extrabold mb-2" style={{ color: levelInfo.color }}>
                {result.totalScore}점
              </h1>
              <p className="text-xl font-bold text-gray-900">{levelInfo.label}</p>
            </div>

            {/* 게이지 바 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${(result.totalScore / 50) * 100}%`,
                    background: `linear-gradient(90deg, #22c55e, #eab308, #f97316, #ef4444)`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>낮음</span>
                <span>보통</span>
                <span>높음</span>
                <span>매우 높음</span>
              </div>
            </div>

            {/* 나이대 비교 */}
            {ageGroup && rarityInfo && (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span> {ageGroupLabels[ageGroup]} 비교
                </h3>
                {ageGroupCount > 1 ? (
                  <>
                    <p className="text-indigo-100 text-sm mb-3">
                      {ageGroupLabels[ageGroup]} 참여자 {ageGroupCount.toLocaleString()}명 중
                    </p>
                    <div className="bg-white/20 rounded-2xl p-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${rarityInfo.badgeColor} text-xs font-bold`}>
                          {rarityInfo.badge}
                        </span>
                      </div>
                      <p className="text-2xl font-bold">
                        {myPercentage}%가 같은 결과
                      </p>
                      <p className="text-indigo-100 text-sm mt-2">
                        {rarityInfo.subMessage}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/20 rounded-2xl p-4">
                    <p className="text-xl font-bold mb-1">{rarityInfo.badge}</p>
                    <p className="text-indigo-100 text-sm">
                      {rarityInfo.subMessage}<br />
                      공유해서 친구들과 비교해보세요!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 설명 카드 */}
            <div
              className="rounded-3xl p-6 text-white shadow-xl"
              style={{ background: `linear-gradient(135deg, ${levelInfo.color}, ${levelInfo.color}cc)` }}
            >
              <p className="text-lg leading-relaxed">{levelInfo.description}</p>
            </div>

            {/* 종합 분석 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🔬</span> 종합 분석 리포트
              </h3>

              {/* 주의 필요 영역 */}
              {dangerCategories.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      주의 필요
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dangerCategories.map(cat => {
                      const analysis = categoryAnalysis[cat.category];
                      return (
                        <div key={cat.category} className="bg-red-50 rounded-xl p-3 border border-red-100">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{analysis?.emoji}</span>
                            <span className="font-bold text-red-800">{analysis?.name || cat.category}</span>
                            <span className="ml-auto text-red-600 font-bold">{cat.score}/5</span>
                          </div>
                          <p className="text-red-700 text-sm mt-1">
                            {analysis?.descriptions[cat.score >= 5 ? 'danger' : 'high']}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 양호한 영역 */}
              {goodCategories.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      양호
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {goodCategories.map(cat => {
                      const analysis = categoryAnalysis[cat.category];
                      return (
                        <span key={cat.category} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm border border-green-100">
                          <span>{analysis?.emoji}</span>
                          <span>{cat.category}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 영역별 상세 분석 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📋</span> 영역별 상세 분석
              </h3>
              <div className="space-y-3">
                {result.categoryScores.map((cat) => {
                  const percentage = (cat.score / cat.maxScore) * 100;
                  const catLevel = getCategoryLevel(cat.score);
                  const analysis = categoryAnalysis[cat.category];
                  const isExpanded = expandedCategory === cat.category;

                  let barColor = '#22c55e';
                  let bgColor = 'bg-green-50';
                  let borderColor = 'border-green-100';
                  if (percentage > 40) { barColor = '#eab308'; bgColor = 'bg-yellow-50'; borderColor = 'border-yellow-100'; }
                  if (percentage > 60) { barColor = '#f97316'; bgColor = 'bg-orange-50'; borderColor = 'border-orange-100'; }
                  if (percentage > 80) { barColor = '#ef4444'; bgColor = 'bg-red-50'; borderColor = 'border-red-100'; }

                  return (
                    <div key={cat.category} className={`rounded-2xl border ${borderColor} overflow-hidden`}>
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : cat.category)}
                        className={`w-full p-4 ${bgColor} text-left transition-all`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{analysis?.emoji || '📊'}</span>
                            <span className="font-bold text-gray-800">{cat.category}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold" style={{ color: barColor }}>
                              {cat.score}/5
                            </span>
                            <svg
                              className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%`, backgroundColor: barColor }}
                          />
                        </div>
                      </button>

                      {isExpanded && analysis && (
                        <div className="p-4 bg-white border-t border-gray-100">
                          <p className="text-gray-700 mb-3">
                            {analysis.descriptions[catLevel]}
                          </p>
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">맞춤 TIP</p>
                            {analysis.tips.map((tip, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span className="text-gray-600 text-sm">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-400 text-xs mt-3 text-center">
                각 영역을 클릭하면 상세 분석을 볼 수 있어요
              </p>
            </div>

            {/* 음악 추천 */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-6 border border-violet-100">
              <h3 className="font-bold text-violet-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🎵</span> 지금 이 노래 어때요?
              </h3>

              {/* 장르 선택 토글 */}
              <div className="flex bg-violet-100 rounded-xl p-1 mb-4">
                <button
                  onClick={() => setMusicGenre('korean')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    musicGenre === 'korean'
                      ? 'bg-white text-violet-700 shadow-sm'
                      : 'text-violet-600 hover:text-violet-700'
                  }`}
                >
                  🇰🇷 국내 음악
                </button>
                <button
                  onClick={() => setMusicGenre('pop')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    musicGenre === 'pop'
                      ? 'bg-white text-violet-700 shadow-sm'
                      : 'text-violet-600 hover:text-violet-700'
                  }`}
                >
                  🌎 팝송
                </button>
              </div>

              <div className="space-y-3">
                {musicList.map((music, index) => (
                  <a
                    key={index}
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(music.youtubeQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-2xl p-4 hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">
                        ▶
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{music.title}</p>
                        <p className="text-sm text-gray-500">{music.artist}</p>
                      </div>
                    </div>
                    <p className="text-sm text-violet-600 mt-2">{music.reason}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* 관리 팁 */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> 스트레스 관리 TIP
              </h3>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-blue-800">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 이미지 저장용 카드 */}
            <div
              id="stress-result-capture"
              className="rounded-3xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${levelInfo.color}, ${levelInfo.color}cc)` }}
            >
              <div className="p-6 text-white text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">
                    {result.level === 'low' && '😊'}
                    {result.level === 'moderate' && '😐'}
                    {result.level === 'high' && '😰'}
                    {result.level === 'veryHigh' && '😫'}
                  </span>
                </div>
                <p className="text-white/70 text-sm mb-1">나의 스트레스 지수</p>
                <h2 className="text-4xl font-extrabold mb-1">{result.totalScore}점</h2>
                <p className="text-xl font-bold mb-3">{levelInfo.label}</p>
                <div className="bg-white/15 backdrop-blur rounded-2xl p-3 mb-3">
                  <p className="text-white/90 text-sm leading-relaxed">{levelInfo.description}</p>
                </div>
                <p className="text-white/50 text-xs">연봉계산기 & 심리테스트 | viral-site-opal.vercel.app</p>
              </div>
            </div>

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">
                친구에게 공유하기
              </h3>
              <ShareButtons
                title="스트레스 지수 테스트"
                description={`나의 스트레스 지수: ${result.totalScore}점 (${levelInfo.label})`}
                captureElementId="stress-result-capture"
                captureFileName="stress-result"
              />
            </div>

            <Button onClick={handleRetry} variant="outline" className="w-full" size="lg">
              다시 테스트하기
            </Button>

            {/* 다른 테스트 추천 */}
            <Recommendations currentPath="/stress-test" />

            {/* FAQ */}
            <FAQ items={stressFAQ} />
          </div>
        )}
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
