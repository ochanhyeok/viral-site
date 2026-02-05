import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components';

const faqs = [
  {
    question: '연봉 계산 결과가 실제와 다른 것 같아요',
    answer: '계산기는 일반적인 기준으로 계산되며, 회사별 정책이나 개인 상황에 따라 실제 금액과 차이가 있을 수 있습니다. 정확한 금액은 회사 인사팀에 문의해주세요.',
  },
  {
    question: '테스트 결과가 저장되지 않아요',
    answer: '테스트 결과는 브라우저의 LocalStorage에 저장됩니다. 시크릿 모드를 사용하거나 브라우저 데이터를 삭제하면 결과가 사라질 수 있습니다.',
  },
  {
    question: '새로운 테스트를 제안하고 싶어요',
    answer: '아래 이메일로 제안해주시면 검토 후 반영하겠습니다. 좋은 아이디어는 언제나 환영합니다!',
  },
  {
    question: '광고가 너무 많은 것 같아요',
    answer: '무료 서비스 운영을 위해 광고를 게재하고 있습니다. 사용자 경험을 해치지 않는 선에서 최소한의 광고만 노출하고 있습니다.',
  },
];

export function Contact() {
  const [showToast, setShowToast] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText('pon07084@gmail.com');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <SEO
        title="문의하기"
        description="연봉계산기 & 심리테스트 서비스에 대한 문의, 제안, 오류 신고를 받습니다."
        keywords="문의,연락처,피드백,오류신고"
      />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
            <span className="text-4xl">📬</span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">문의하기</h1>
          <p className="text-gray-500">
            궁금한 점이나 제안사항이 있으시면 연락주세요
          </p>
        </div>

        {/* 연락처 카드 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">연락 방법</h2>

          {/* 이메일 */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-violet-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">이메일 문의</h3>
                <p className="text-sm text-gray-500">평일 기준 24시간 내 답변</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 px-4 py-3 bg-white rounded-lg text-violet-600 font-mono text-sm border border-violet-200">
                pon07084@gmail.com
              </code>
              <button
                onClick={copyEmail}
                className="px-4 py-3 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 transition-colors"
              >
                복사
              </button>
            </div>
          </div>

          {/* 안내 사항 */}
          <div className="mt-6 space-y-3">
            <h3 className="font-bold text-gray-900">문의 시 포함해주세요</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                <span>문의 유형 (버그 신고, 기능 제안, 일반 문의 등)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                <span>사용 중인 브라우저 및 기기 (오류 발생 시)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-500">•</span>
                <span>문제 상황에 대한 자세한 설명</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">자주 묻는 질문</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 피드백 종류 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100 text-center">
            <span className="text-3xl mb-2 block">💡</span>
            <h3 className="font-bold text-gray-900 mb-1">기능 제안</h3>
            <p className="text-xs text-gray-500">새로운 테스트나 기능 아이디어</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100 text-center">
            <span className="text-3xl mb-2 block">🐛</span>
            <h3 className="font-bold text-gray-900 mb-1">버그 신고</h3>
            <p className="text-xs text-gray-500">오류나 문제 발견 시</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100 text-center">
            <span className="text-3xl mb-2 block">💬</span>
            <h3 className="font-bold text-gray-900 mb-1">일반 문의</h3>
            <p className="text-xs text-gray-500">기타 질문이나 의견</p>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <Link to="/about" className="hover:text-violet-600 transition-colors">
            서비스 소개
          </Link>
          <Link to="/terms" className="hover:text-violet-600 transition-colors">
            이용약관
          </Link>
          <Link to="/privacy" className="hover:text-violet-600 transition-colors">
            개인정보처리방침
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          showToast
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-lg">
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          이메일이 복사되었습니다
        </div>
      </div>
    </>
  );
}
