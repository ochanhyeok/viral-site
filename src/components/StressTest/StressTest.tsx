import { useState, useEffect } from 'react';
import { stressQuestions, answerOptions } from '../../data/stressQuestions';
import type { Answer, StressResult, StressLevel } from '../../types/stressTest';
import { SEO, Button, ShareButtons, AgeGroupSelect, ageGroupLabels } from '../index';
import { stressTips, stressMusic } from '../../data/stressQuestions';
import { STRESS_LEVELS } from '../../types/stressTest';
import { saveTestResult, useTestStats, calculatePercentage } from '../../hooks/useTestStats';

type TestPhase = 'intro' | 'ageSelect' | 'questions' | 'result';

function getStressLevel(totalScore: number): StressLevel {
  if (totalScore <= 15) return 'low';
  if (totalScore <= 25) return 'moderate';
  if (totalScore <= 35) return 'high';
  return 'veryHigh';
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

  const { myAgeGroupStats, ageGroupCount } = useTestStats('stress', ageGroup);

  const currentQuestion = stressQuestions[currentIndex];
  const progress = ((currentIndex + 1) / stressQuestions.length) * 100;

  // 결과 저장
  useEffect(() => {
    if (result && ageGroup && !resultSaved) {
      saveTestResult('stress', result.level, ageGroup, result.totalScore);
      setResultSaved(true);
    }
  }, [result, ageGroup, resultSaved]);

  const handleStart = () => {
    setPhase('ageSelect');
  };

  const handleAgeSelect = (selectedAge: string) => {
    setAgeGroup(selectedAge);
    setPhase('questions');
    setCurrentIndex(0);
    setAnswers([]);
  };

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

  const handleRetry = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
    setSelectedScore(null);
    setAgeGroup(null);
    setResultSaved(false);
  };

  const levelInfo = result ? STRESS_LEVELS[result.level] : null;
  const tips = result ? stressTips[result.level] : [];
  const musicList = result ? stressMusic[result.level] : [];

  // 나이대 비교 데이터
  const myPercentage = result ? calculatePercentage(myAgeGroupStats, result.level) : 0;

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

            <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-gray-100">
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
            {ageGroup && (
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span> {ageGroupLabels[ageGroup]} 비교
                </h3>
                {ageGroupCount > 1 ? (
                  <>
                    <p className="text-indigo-100 text-sm mb-3">
                      {ageGroupLabels[ageGroup]} 참여자 {ageGroupCount}명 중
                    </p>
                    <div className="bg-white/20 rounded-2xl p-4">
                      <p className="text-2xl font-bold">
                        {myPercentage}%가 같은 결과
                      </p>
                      <p className="text-indigo-100 text-sm mt-1">
                        {myPercentage >= 30
                          ? `${ageGroupLabels[ageGroup]}에서 흔한 스트레스 수준이에요`
                          : myPercentage >= 10
                          ? `${ageGroupLabels[ageGroup]} 평균과 비슷한 수준이에요`
                          : `${ageGroupLabels[ageGroup]}에서는 드문 케이스예요`}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/20 rounded-2xl p-4">
                    <p className="text-xl font-bold mb-1">🎉 첫 번째 참여자!</p>
                    <p className="text-indigo-100 text-sm">
                      {ageGroupLabels[ageGroup]}에서 처음으로 테스트했어요.<br />
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

            {/* 영역별 분석 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">영역별 분석</h3>
              <div className="space-y-3">
                {result.categoryScores.map((cat) => {
                  const percentage = (cat.score / cat.maxScore) * 100;
                  let barColor = '#22c55e';
                  if (percentage > 40) barColor = '#eab308';
                  if (percentage > 60) barColor = '#f97316';
                  if (percentage > 80) barColor = '#ef4444';

                  return (
                    <div key={cat.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{cat.category}</span>
                        <span className="font-medium" style={{ color: barColor }}>
                          {cat.score}/5
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%`, backgroundColor: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 음악 추천 */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-6 border border-violet-100">
              <h3 className="font-bold text-violet-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🎵</span> 지금 이 노래 어때요?
              </h3>
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

            {/* 공유 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 text-center">
                친구에게 공유하기
              </h3>
              <ShareButtons
                title="스트레스 지수 테스트"
                description={`나의 스트레스 지수: ${result.totalScore}점 (${levelInfo.label})`}
              />
            </div>

            <Button onClick={handleRetry} variant="outline" className="w-full" size="lg">
              다시 테스트하기
            </Button>
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
