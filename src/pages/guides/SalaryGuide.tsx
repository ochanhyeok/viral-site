import { Link } from 'react-router-dom';
import { SEO } from '../../components';

const faqItems = [
  {
    question: '연봉 협상은 언제 하는 것이 좋은가요?',
    answer: '연봉 협상의 최적 시기는 연말 성과평가 직후, 승진 시점, 또는 중요한 프로젝트 완료 후입니다. 특히 1~2월 연봉 조정 시즌 전에 미리 준비하는 것이 효과적입니다. 이직 시에는 최종 합격 통보 후 처우 협의 단계에서 협상합니다.',
  },
  {
    question: '연봉과 실수령액의 차이는 왜 생기나요?',
    answer: '연봉에서 국민연금(4.5%), 건강보험(3.545%), 장기요양보험(건강보험의 12.95%), 고용보험(0.9%), 소득세, 지방소득세가 공제되기 때문입니다. 연봉 5,000만원 기준 실수령액은 약 3,500~3,600만원 수준입니다.',
  },
  {
    question: '연봉 협상 시 어떤 자료를 준비해야 하나요?',
    answer: '본인의 성과 기록(매출 기여, 비용 절감, 프로젝트 성과), 업계 평균 연봉 데이터, 동종 업계 경쟁사 연봉 수준, 그리고 본인의 역량 개발 내역(자격증, 교육 이수 등)을 준비하세요.',
  },
  {
    question: '연봉 인상률은 보통 얼마인가요?',
    answer: '2025~2026년 기준 일반적인 연봉 인상률은 3~5% 수준입니다. 고성과자의 경우 7~10%, 승진 시에는 10~20% 인상이 가능합니다. 이직 시에는 현재 연봉 대비 10~30% 상승을 목표로 협상할 수 있습니다.',
  },
  {
    question: '비과세 항목에는 무엇이 있나요?',
    answer: '식대(월 20만원 한도), 자가운전보조금(월 20만원), 출산/보육수당(월 10만원), 연구활동비(월 20만원), 야간근로수당, 연장근로수당(생산직), 직무발명보상금(연 500만원) 등이 비과세 항목입니다.',
  },
];

const negotiationTips = [
  {
    title: '시장 조사를 철저히',
    description: '잡코리아, 사람인, 블라인드 등에서 동종 업계/직무의 연봉 수준을 파악하세요.',
  },
  {
    title: '구체적인 숫자로 제시',
    description: '"적당히 올려주세요" 대신 "현재 대비 15% 인상을 희망합니다"처럼 구체적으로 말하세요.',
  },
  {
    title: '성과를 수치화',
    description: '매출 30% 증가 기여, 비용 20% 절감 등 성과를 숫자로 표현하면 설득력이 높아집니다.',
  },
  {
    title: '대안을 준비',
    description: '연봉 인상이 어려우면 상여금, 스톡옵션, 휴가, 재택근무 등 다른 보상을 협상하세요.',
  },
];

const taxBrackets2026 = [
  { range: '1,400만원 이하', rate: '6%' },
  { range: '1,400만원 ~ 5,000만원', rate: '15%' },
  { range: '5,000만원 ~ 8,800만원', rate: '24%' },
  { range: '8,800만원 ~ 1억 5천만원', rate: '35%' },
  { range: '1억 5천만원 ~ 3억원', rate: '38%' },
  { range: '3억원 ~ 5억원', rate: '40%' },
  { range: '5억원 ~ 10억원', rate: '42%' },
  { range: '10억원 초과', rate: '45%' },
];

export function SalaryGuide() {
  return (
    <>
      <SEO
        title="연봉 협상 & 연봉 계산 가이드 | 2026년 최신"
        description="2026년 최신 연봉 협상 전략과 실수령액 계산 방법을 알아보세요. 소득세율, 4대보험, 비과세 항목까지 직장인 필수 정보 총정리."
        keywords="연봉협상,연봉계산,실수령액,4대보험,소득세,비과세,연봉인상,직장인가이드"
      />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl shadow-green-500/30">
            <span className="text-5xl">💰</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            연봉 협상 & 연봉 계산 가이드
          </h1>
          <p className="text-gray-500 text-lg">
            2026년 최신 정보 기준 완벽 가이드
          </p>
        </div>

        {/* 소개 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">연봉, 제대로 알고 협상하자</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              직장인에게 연봉은 단순한 숫자가 아닙니다. <strong>삶의 질</strong>과 직결되는 중요한 요소이며,
              본인의 가치를 인정받는 척도이기도 합니다. 하지만 많은 직장인들이 연봉 협상을 어려워하고,
              실수령액 계산도 복잡하게 느낍니다.
            </p>
            <p>
              이 가이드에서는 <strong>2026년 최신 세율</strong>을 기준으로 연봉 실수령액 계산 방법,
              효과적인 연봉 협상 전략, 그리고 절세 팁까지 상세하게 알려드립니다.
              연봉 협상 시즌을 앞두고 있거나, 이직을 준비 중이라면 반드시 읽어보세요.
            </p>
            <p>
              특히 신입사원부터 경력직까지, 각 상황에 맞는 협상 전략을 제시하고
              실제 협상 대화 예시까지 포함했습니다. 이 가이드를 통해 당당하게 본인의 가치를 어필하고,
              합리적인 연봉을 받을 수 있기를 바랍니다.
            </p>
          </div>
        </div>

        {/* 2026년 소득세율표 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span> 2026년 소득세율표
          </h2>
          <p className="text-gray-600 mb-4">
            과세표준 구간에 따라 세율이 달라집니다. 연봉이 높을수록 높은 세율이 적용되는 누진세 구조입니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700 rounded-tl-lg">과세표준</th>
                  <th className="text-right p-3 font-semibold text-gray-700 rounded-tr-lg">세율</th>
                </tr>
              </thead>
              <tbody>
                {taxBrackets2026.map((bracket, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="p-3 text-gray-600">{bracket.range}</td>
                    <td className="p-3 text-right font-semibold text-emerald-600">{bracket.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            * 지방소득세(소득세의 10%)가 추가로 부과됩니다.
          </p>
        </div>

        {/* 실수령액 계산 방법 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🧮</span> 실수령액 계산 방법
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>월 실수령액 = 월 급여 - 4대보험료 - 소득세 - 지방소득세</strong>
            </p>
            <div className="bg-white rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-gray-800">4대보험 요율 (2026년 기준)</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span>국민연금</span>
                  <span className="font-semibold">4.5%</span>
                </li>
                <li className="flex justify-between">
                  <span>건강보험</span>
                  <span className="font-semibold">3.545%</span>
                </li>
                <li className="flex justify-between">
                  <span>장기요양보험</span>
                  <span className="font-semibold">건강보험의 12.95%</span>
                </li>
                <li className="flex justify-between">
                  <span>고용보험</span>
                  <span className="font-semibold">0.9%</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              예를 들어, 연봉 5,000만원(월 약 417만원)의 경우 4대보험료로 약 38만원,
              소득세 및 지방소득세로 약 15만원이 공제되어 월 실수령액은 약 364만원 수준입니다.
            </p>
          </div>
        </div>

        {/* 연봉 협상 팁 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>💡</span> 연봉 협상 핵심 전략
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {negotiationTips.map((tip, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">{tip.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 연봉 협상 대화 예시 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💬</span> 연봉 협상 대화 예시
          </h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-2">상황: 연말 성과평가 후 연봉 협상</p>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-gray-400 flex-shrink-0">나:</span>
                  <p className="text-gray-700">"올해 담당했던 A 프로젝트에서 목표 대비 120% 매출을 달성했고,
                  신규 고객 유치에도 크게 기여했습니다. 이러한 성과를 바탕으로 현재 연봉 대비 15% 인상을 요청드립니다."</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 flex-shrink-0">상사:</span>
                  <p className="text-gray-700">"성과는 인정하지만, 회사 전체 인상률이 5%로 정해져 있어서..."</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 flex-shrink-0">나:</span>
                  <p className="text-gray-700">"이해합니다. 기본 연봉 인상이 어렵다면, 성과급이나 연차 추가,
                  또는 교육비 지원 등 다른 방식으로 보상받을 수 있을까요?"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 비과세 항목 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🎁</span> 알아두면 좋은 비과세 항목
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              비과세 항목을 잘 활용하면 실수령액을 높일 수 있습니다. 연봉 협상 시 이러한 항목을
              요청하는 것도 좋은 전략입니다.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span><strong>식대</strong>: 월 20만원까지 비과세</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span><strong>자가운전보조금</strong>: 월 20만원까지 비과세 (본인 차량 업무 사용 시)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span><strong>출산/보육수당</strong>: 월 10만원까지 비과세</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span><strong>연구활동비</strong>: 연구직의 경우 월 20만원까지 비과세</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>❓</span> 자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details key={index} className="group">
                <summary className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-800 pr-4">{item.question}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-4 text-gray-600 text-sm leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* CTA 버튼 */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-3">내 연봉 실수령액 계산하기</h2>
          <p className="text-green-100 mb-6">
            2026년 최신 세율 적용, 4대보험 자동 계산
          </p>
          <Link
            to="/salary"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors"
          >
            연봉 계산기 바로가기 →
          </Link>
        </div>

        {/* 관련 콘텐츠 */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">관련 가이드</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/guide/retirement"
              className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <span className="text-2xl">🏦</span>
              <div>
                <h3 className="font-semibold text-gray-800">퇴직금 가이드</h3>
                <p className="text-sm text-gray-500">퇴직금 계산법과 수령 전략</p>
              </div>
            </Link>
            <Link
              to="/guide/tax"
              className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <span className="text-2xl">📋</span>
              <div>
                <h3 className="font-semibold text-gray-800">연말정산 가이드</h3>
                <p className="text-sm text-gray-500">환급금 최대화 전략</p>
              </div>
            </Link>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <Link to="/about" className="hover:text-green-600 transition-colors">
            서비스 소개
          </Link>
          <Link to="/privacy" className="hover:text-green-600 transition-colors">
            개인정보처리방침
          </Link>
          <Link to="/contact" className="hover:text-green-600 transition-colors">
            문의하기
          </Link>
        </div>
      </div>
    </>
  );
}

export default SalaryGuide;
