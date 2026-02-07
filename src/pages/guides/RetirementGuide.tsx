import { Link } from 'react-router-dom';
import { SEO } from '../../components';

const faqItems = [
  {
    question: '퇴직금은 언제부터 발생하나요?',
    answer: '퇴직금은 계속근로기간이 1년 이상이고, 주 15시간 이상 근무한 경우 발생합니다. 수습기간도 계속근로기간에 포함되며, 휴직 기간(육아휴직 등)도 원칙적으로 포함됩니다. 다만, 1년 미만 근무 후 퇴사하면 퇴직금을 받을 수 없습니다.',
  },
  {
    question: '퇴직금과 퇴직연금의 차이는 무엇인가요?',
    answer: '퇴직금은 퇴사 시 일시금으로 받는 것이고, 퇴직연금은 회사가 외부 금융기관에 적립하는 제도입니다. 퇴직연금은 DB형(확정급여형)과 DC형(확정기여형)으로 나뉘며, DB형은 퇴사 시 급여 기준으로 계산, DC형은 매년 적립금의 운용 수익에 따라 결정됩니다.',
  },
  {
    question: '퇴직금 계산 시 평균임금이란?',
    answer: '평균임금은 퇴직 전 3개월간 받은 총 급여를 그 기간의 총 일수로 나눈 금액입니다. 기본급, 정기 상여금, 연장/야간/휴일근로수당 등이 포함됩니다. 비정기적인 보너스나 경조사비 등은 제외될 수 있습니다.',
  },
  {
    question: '퇴직금에도 세금이 부과되나요?',
    answer: '네, 퇴직소득세가 부과됩니다. 다만 근속연수에 따른 공제가 있어 일반 소득보다 세금 부담이 적습니다. 2026년 기준 근속연수 5년 이하는 연 30만원씩, 5~10년은 연 50만원씩, 10~20년은 연 80만원씩, 20년 초과는 연 120만원씩 공제됩니다.',
  },
  {
    question: '중간정산을 받을 수 있나요?',
    answer: '주택 구입, 전세금 마련, 본인/배우자/부양가족의 6개월 이상 요양, 파산/개인회생, 천재지변 등 법정 사유가 있을 때만 중간정산이 가능합니다. 단순히 돈이 필요하다는 이유로는 중간정산을 받을 수 없습니다.',
  },
  {
    question: '퇴직금을 IRP로 이체하면 어떤 혜택이 있나요?',
    answer: '퇴직금을 IRP(개인형 퇴직연금)로 이체하면 퇴직소득세 납부를 연금 수령 시까지 이연할 수 있습니다. 55세 이후 연금으로 수령하면 퇴직소득세의 30~40%만 납부하면 됩니다. 또한 추가 납입 시 세액공제 혜택(연 최대 900만원 한도)도 받을 수 있습니다.',
  },
];

const retirementTypes = [
  {
    type: 'DB형 (확정급여형)',
    description: '회사가 책임지고 운용, 퇴사 시 급여 기준으로 퇴직금 결정',
    pros: ['퇴사 직전 급여가 높으면 유리', '운용 위험 없음'],
    cons: ['회사 부도 시 위험', '이직이 잦으면 불리'],
  },
  {
    type: 'DC형 (확정기여형)',
    description: '매년 연봉의 1/12을 적립, 본인이 운용',
    pros: ['이직이 잦아도 불이익 없음', '운용 수익 본인 귀속'],
    cons: ['운용 손실 위험', '금융 지식 필요'],
  },
  {
    type: 'IRP (개인형퇴직연금)',
    description: '퇴직금 수령 및 추가 적립 가능한 개인 계좌',
    pros: ['세액공제 혜택', '다양한 금융상품 선택'],
    cons: ['55세 전 인출 시 불이익', '중도해지 시 세금 부담'],
  },
];

export function RetirementGuide() {
  return (
    <>
      <SEO
        title="퇴직금 완벽 가이드 | 2026년 최신"
        description="2026년 최신 퇴직금 계산법, 퇴직연금 제도, 세금 절감 방법까지. 퇴직금에 대한 모든 것을 알려드립니다."
        keywords="퇴직금,퇴직연금,IRP,DB형,DC형,퇴직소득세,중간정산,퇴직금계산"
      />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
            <span className="text-5xl">🏦</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            퇴직금 완벽 가이드
          </h1>
          <p className="text-gray-500 text-lg">
            2026년 기준 퇴직금의 모든 것
          </p>
        </div>

        {/* 소개 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">퇴직금, 얼마나 알고 계신가요?</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              퇴직금은 직장인이 퇴사할 때 받는 중요한 자산입니다. <strong>근로기준법</strong>에 따라
              1년 이상 근무한 근로자에게 지급되며, 평균임금 기준 30일분 이상을 받을 수 있습니다.
              하지만 많은 분들이 정확한 계산 방법이나 수령 방법을 잘 모르고 계십니다.
            </p>
            <p>
              특히 2022년 4월부터 <strong>퇴직연금 의무화</strong>가 확대되면서,
              DB형, DC형, IRP 등 다양한 퇴직연금 제도에 대한 이해가 필수가 되었습니다.
              이 가이드에서는 퇴직금의 기본 개념부터 계산 방법, 세금 문제,
              그리고 현명한 수령 전략까지 상세히 알려드립니다.
            </p>
            <p>
              퇴직을 앞두고 있거나, 이직을 준비 중이거나, 또는 미래를 위해 미리 알아두고 싶은 분들께
              이 가이드가 도움이 되길 바랍니다. 퇴직금은 <strong>노후 자금의 핵심</strong>이므로,
              정확히 이해하고 현명하게 관리하는 것이 중요합니다.
            </p>
          </div>
        </div>

        {/* 퇴직금 계산 공식 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🧮</span> 퇴직금 계산 공식
          </h2>
          <div className="bg-white rounded-xl p-6 text-center mb-4">
            <p className="text-lg font-bold text-gray-800">
              퇴직금 = <span className="text-blue-600">1일 평균임금</span> × <span className="text-indigo-600">30일</span> × <span className="text-purple-600">(재직일수 ÷ 365)</span>
            </p>
          </div>
          <div className="space-y-3 text-gray-700 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1일 평균임금:</span>
              <span>퇴직 전 3개월 총 급여 ÷ 퇴직 전 3개월 총 일수</span>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <p className="text-amber-800">
                <strong>예시:</strong> 월급 400만원, 3년 근무 시<br/>
                - 3개월 급여: 1,200만원<br/>
                - 3개월 일수: 약 91일<br/>
                - 1일 평균임금: 약 131,868원<br/>
                - 퇴직금: 131,868 × 30 × (1,095 ÷ 365) = <strong>약 1,187만원</strong>
              </p>
            </div>
          </div>
        </div>

        {/* 퇴직연금 종류 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📊</span> 퇴직연금 종류 비교
          </h2>
          <div className="space-y-6">
            {retirementTypes.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.type}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-semibold text-green-600 mb-1">장점</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {item.pros.map((pro, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-green-500">+</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-600 mb-1">단점</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {item.cons.map((con, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="text-red-500">-</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 퇴직소득세 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💸</span> 퇴직소득세 계산
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              퇴직금에도 세금이 부과되지만, 근속연수에 따른 공제와 분류과세로 인해
              일반 소득세보다 부담이 적습니다.
            </p>
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">2026년 근속연수공제</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>5년 이하</span>
                  <span className="font-semibold">연 30만원 × 근속연수</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>5~10년</span>
                  <span className="font-semibold">150만원 + 연 50만원 × (근속연수-5)</span>
                </li>
                <li className="flex justify-between border-b border-gray-100 pb-2">
                  <span>10~20년</span>
                  <span className="font-semibold">400만원 + 연 80만원 × (근속연수-10)</span>
                </li>
                <li className="flex justify-between">
                  <span>20년 초과</span>
                  <span className="font-semibold">1,200만원 + 연 120만원 × (근속연수-20)</span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              <strong>절세 팁:</strong> 퇴직금을 IRP로 이체하면 퇴직소득세 납부를 연금 수령 시까지
              이연할 수 있으며, 연금으로 수령 시 세금이 30~40% 감면됩니다.
            </p>
          </div>
        </div>

        {/* 퇴직 전 체크리스트 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>✅</span> 퇴직 전 체크리스트
          </h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
              <input type="checkbox" className="mt-1 w-5 h-5 accent-blue-600" />
              <span className="text-gray-700">퇴직금 예상 금액 계산해보기</span>
            </label>
            <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
              <input type="checkbox" className="mt-1 w-5 h-5 accent-blue-600" />
              <span className="text-gray-700">회사 퇴직연금 제도(DB/DC) 확인하기</span>
            </label>
            <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
              <input type="checkbox" className="mt-1 w-5 h-5 accent-blue-600" />
              <span className="text-gray-700">IRP 계좌 개설 여부 결정하기</span>
            </label>
            <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
              <input type="checkbox" className="mt-1 w-5 h-5 accent-blue-600" />
              <span className="text-gray-700">연차 잔여일수 확인 및 사용 계획 세우기</span>
            </label>
            <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
              <input type="checkbox" className="mt-1 w-5 h-5 accent-blue-600" />
              <span className="text-gray-700">4대보험 처리 방법 알아보기</span>
            </label>
            <label className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
              <input type="checkbox" className="mt-1 w-5 h-5 accent-blue-600" />
              <span className="text-gray-700">실업급여 수급 자격 및 금액 확인하기</span>
            </label>
          </div>
        </div>

        {/* 현명한 퇴직금 활용 */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💡</span> 현명한 퇴직금 활용법
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</span>
              <div>
                <h3 className="font-semibold">IRP로 이체하여 세금 이연</h3>
                <p className="text-sm text-gray-600">55세 이후 연금으로 수령하면 세금 절감</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</span>
              <div>
                <h3 className="font-semibold">비상금 6개월치 확보</h3>
                <p className="text-sm text-gray-600">새 직장을 구하는 동안의 생활비 마련</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</span>
              <div>
                <h3 className="font-semibold">고금리 부채 상환</h3>
                <p className="text-sm text-gray-600">신용대출, 카드론 등 고금리 부채 먼저 정리</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</span>
              <div>
                <h3 className="font-semibold">자기계발 투자</h3>
                <p className="text-sm text-gray-600">이직이나 커리어 전환을 위한 교육/자격증</p>
              </div>
            </div>
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-3">내 퇴직금 계산하기</h2>
          <p className="text-blue-100 mb-6">
            근속연수와 급여만 입력하면 예상 퇴직금을 바로 확인
          </p>
          <Link
            to="/retirement"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors"
          >
            퇴직금 계산기 바로가기 →
          </Link>
        </div>

        {/* 관련 콘텐츠 */}
        <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">관련 가이드</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/guide/salary"
              className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <span className="text-2xl">💰</span>
              <div>
                <h3 className="font-semibold text-gray-800">연봉 가이드</h3>
                <p className="text-sm text-gray-500">연봉 협상과 실수령액 계산</p>
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
          <Link to="/about" className="hover:text-blue-600 transition-colors">
            서비스 소개
          </Link>
          <Link to="/privacy" className="hover:text-blue-600 transition-colors">
            개인정보처리방침
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">
            문의하기
          </Link>
        </div>
      </div>
    </>
  );
}

export default RetirementGuide;
