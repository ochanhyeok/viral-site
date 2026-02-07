import { Link } from 'react-router-dom';
import { SEO } from '../../components';

const faqItems = [
  {
    question: '연말정산은 왜 하는 건가요?',
    answer: '매월 급여에서 원천징수된 소득세는 예상치이므로, 연말에 실제 소득과 공제 항목을 반영하여 정확한 세금을 계산합니다. 더 낸 세금은 환급받고, 덜 낸 세금은 추가 납부합니다. 공제 항목을 잘 챙기면 환급을 받을 수 있습니다.',
  },
  {
    question: '연말정산 간소화 서비스는 언제 열리나요?',
    answer: '매년 1월 15일경 국세청 홈택스에서 연말정산 간소화 서비스가 오픈됩니다. 1월 20일 이후에는 누락된 자료가 추가되므로, 가능하면 1월 20일 이후에 조회하는 것이 좋습니다. 2026년 귀속분은 2027년 1월에 조회 가능합니다.',
  },
  {
    question: '맞벌이 부부는 어떻게 공제받는 것이 유리한가요?',
    answer: '일반적으로 소득이 높은 배우자가 공제를 받는 것이 유리합니다. 다만, 의료비는 총급여의 3%를 초과한 금액만 공제되므로, 소득이 낮은 배우자가 받는 것이 유리할 수 있습니다. 부양가족 공제는 한 명만 받을 수 있으므로 미리 협의하세요.',
  },
  {
    question: '신용카드와 체크카드, 어떤 것이 더 유리한가요?',
    answer: '공제율은 체크카드/현금영수증(30%)이 신용카드(15%)보다 높습니다. 하지만 총급여의 25%까지는 공제가 안 되므로, 25%까지는 신용카드 혜택을 누리고, 이후에는 체크카드를 쓰는 것이 효율적입니다. 전통시장/대중교통은 40%로 공제율이 가장 높습니다.',
  },
  {
    question: '중도입사자도 연말정산을 하나요?',
    answer: '네, 중도입사자도 연말정산 대상입니다. 전 직장 원천징수영수증을 현 직장에 제출해야 합니다. 이직 전 회사에서 원천징수영수증을 발급받지 못했다면 홈택스에서 조회할 수 있습니다.',
  },
  {
    question: '연말정산에서 놓치기 쉬운 공제 항목은?',
    answer: '안경/렌즈 구입비(의료비), 교복/체육복 구입비(교육비), 월세액 공제, 기부금(종교단체 포함), 주택청약저축, 개인연금저축, 중소기업 취업 청년 소득세 감면 등이 자주 놓치는 항목입니다.',
  },
];

const deductionItems = [
  {
    category: '소득공제',
    items: [
      { name: '인적공제', detail: '기본공제 150만원, 부양가족 1인당 150만원' },
      { name: '국민연금', detail: '납입액 전액 공제' },
      { name: '건강보험료', detail: '납입액 전액 공제' },
      { name: '주택청약저축', detail: '연 240만원 한도, 무주택 세대주' },
      { name: '신용카드 등', detail: '총급여 25% 초과분, 300만원 한도' },
    ],
  },
  {
    category: '세액공제',
    items: [
      { name: '자녀세액공제', detail: '1명 15만원, 2명 35만원, 3명+ 35만원+30만원' },
      { name: '연금계좌', detail: '연 900만원 한도, 16.5% 또는 13.2% 공제' },
      { name: '보험료', detail: '보장성보험 연 100만원 한도, 12% 공제' },
      { name: '의료비', detail: '총급여 3% 초과분, 15% 공제' },
      { name: '교육비', detail: '본인 전액, 자녀 1인 300만원 한도, 15% 공제' },
      { name: '기부금', detail: '15~30% 세액공제' },
      { name: '월세', detail: '연 750만원 한도, 15~17% 공제' },
    ],
  },
];

const monthlyChecklist = [
  { month: '1~3월', task: '연말정산 결과 확인, 추가 납부/환급금 수령' },
  { month: '4~6월', task: '신용카드 사용 현황 점검, 전통시장/대중교통 이용 늘리기' },
  { month: '7~9월', task: '연금저축/IRP 납입 현황 점검, 기부금 영수증 모으기' },
  { month: '10~12월', task: '공제 한도 점검 후 추가 납입, 의료비/교육비 영수증 정리' },
];

export function TaxGuide() {
  return (
    <>
      <SEO
        title="연말정산 환급 꿀팁 | 2026년 최신"
        description="2026년 연말정산 완벽 가이드. 환급금을 최대화하는 공제 항목과 절세 전략, 맞벌이 부부 팁까지 총정리."
        keywords="연말정산,환급,소득공제,세액공제,절세,신용카드공제,의료비공제,교육비공제,연금저축"
      />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/30">
            <span className="text-5xl">📋</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
            연말정산 환급 꿀팁
          </h1>
          <p className="text-gray-500 text-lg">
            2026년 환급금 최대화 전략
          </p>
        </div>

        {/* 소개 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">13월의 월급, 제대로 받자!</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              연말정산은 직장인에게 <strong>'13월의 월급'</strong>이라 불릴 만큼 중요한 이벤트입니다.
              하지만 복잡한 공제 항목과 계산 방식 때문에 많은 분들이 놓치는 혜택이 많습니다.
              제대로 알고 준비하면 수십만원에서 수백만원까지 환급받을 수 있습니다.
            </p>
            <p>
              이 가이드에서는 <strong>2026년 귀속 연말정산</strong>을 기준으로
              소득공제와 세액공제의 차이, 각 공제 항목의 한도와 요건,
              그리고 환급금을 최대화하는 전략을 상세히 알려드립니다.
            </p>
            <p>
              특히 맞벌이 부부의 공제 배분 전략, 신용카드 vs 체크카드 사용 전략,
              연금저축과 IRP 활용법 등 실제로 도움이 되는 꿀팁들을 담았습니다.
              미리 준비하면 연말에 당황하지 않고, 최대한의 환급을 받을 수 있습니다.
            </p>
          </div>
        </div>

        {/* 소득공제 vs 세액공제 */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border border-purple-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span> 소득공제 vs 세액공제
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-bold text-purple-600 mb-2">소득공제</h3>
              <p className="text-sm text-gray-600 mb-2">
                과세표준(세금 계산 기준 금액)을 줄여주는 공제
              </p>
              <p className="text-xs text-gray-500">
                예: 연봉 5,000만원에서 500만원 소득공제 시<br/>
                → 4,500만원 기준으로 세금 계산
              </p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-bold text-pink-600 mb-2">세액공제</h3>
              <p className="text-sm text-gray-600 mb-2">
                계산된 세금에서 직접 차감하는 공제
              </p>
              <p className="text-xs text-gray-500">
                예: 산출세금 300만원에서 50만원 세액공제 시<br/>
                → 250만원만 납부
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4 bg-white rounded-lg p-3">
            <strong>Tip:</strong> 세액공제가 더 직접적인 혜택! 같은 금액이면 세액공제가 유리합니다.
          </p>
        </div>

        {/* 주요 공제 항목 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>💡</span> 주요 공제 항목 총정리
          </h2>
          {deductionItems.map((category, idx) => (
            <div key={idx} className="mb-6 last:mb-0">
              <h3 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <span className="text-purple-500 mt-1">●</span>
                    <div>
                      <span className="font-semibold text-gray-800">{item.name}</span>
                      <span className="text-gray-500 text-sm ml-2">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 신용카드 공제 전략 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💳</span> 신용카드 공제 전략
          </h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold mb-2">공제율 비교</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>신용카드</span>
                  <span className="font-bold text-amber-600">15%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>체크카드/현금</span>
                  <span className="font-bold text-green-600">30%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>전통시장</span>
                  <span className="font-bold text-purple-600">40%</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>대중교통</span>
                  <span className="font-bold text-purple-600">40%</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold mb-2">효율적인 사용 전략</h3>
              <ol className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="bg-amber-100 text-amber-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>총급여의 25%까지는 신용카드 포인트/혜택 활용</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-amber-100 text-amber-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>25% 초과분부터 체크카드/현금영수증 사용</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-amber-100 text-amber-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span>전통시장, 대중교통 이용 적극 활용 (40% 공제)</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* 연금저축/IRP */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🏦</span> 연금저축 & IRP 활용법
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              연금계좌(연금저축 + IRP)는 <strong>연간 최대 900만원</strong>까지 세액공제 혜택을 받을 수 있는
              강력한 절세 수단입니다.
            </p>
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold mb-3">2026년 세액공제 한도</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-2">총급여</th>
                    <th className="text-right p-2">공제율</th>
                    <th className="text-right p-2">최대 절세액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="p-2">5,500만원 이하</td>
                    <td className="text-right p-2 font-semibold text-green-600">16.5%</td>
                    <td className="text-right p-2">148.5만원</td>
                  </tr>
                  <tr>
                    <td className="p-2">5,500만원 초과</td>
                    <td className="text-right p-2 font-semibold text-green-600">13.2%</td>
                    <td className="text-right p-2">118.8만원</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> 연금저축은 연 600만원, IRP는 추가로 300만원까지
              합산하여 900만원 한도로 공제받을 수 있습니다. 12월에 몰아서 납입해도 공제 가능!
            </p>
          </div>
        </div>

        {/* 월별 체크리스트 */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📅</span> 월별 연말정산 준비 체크리스트
          </h2>
          <div className="space-y-3">
            {monthlyChecklist.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">
                  {item.month}
                </span>
                <p className="text-gray-700">{item.task}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 놓치기 쉬운 공제 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔍</span> 놓치기 쉬운 공제 항목
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">👓</span>
              <span className="text-sm">안경/렌즈 구입비 (의료비)</span>
            </div>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">🏫</span>
              <span className="text-sm">교복/체육복 구입비 (교육비)</span>
            </div>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">🏠</span>
              <span className="text-sm">월세액 공제 (무주택자)</span>
            </div>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">💒</span>
              <span className="text-sm">종교단체 기부금</span>
            </div>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">🦷</span>
              <span className="text-sm">치과 임플란트/교정 (의료비)</span>
            </div>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">🏋️</span>
              <span className="text-sm">헬스장 PT비 (일부)</span>
            </div>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">📚</span>
              <span className="text-sm">대학원 등록금 (본인)</span>
            </div>
            <div className="bg-white rounded-xl p-3 flex items-center gap-2">
              <span className="text-xl">🏡</span>
              <span className="text-sm">주택청약저축 (무주택 세대주)</span>
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 sm:p-8 text-white text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-3">내 예상 환급금 계산하기</h2>
          <p className="text-purple-100 mb-6">
            간단한 정보 입력으로 환급 예상액 확인
          </p>
          <Link
            to="/tax-refund"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors"
          >
            연말정산 계산기 바로가기 →
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
              to="/guide/retirement"
              className="p-4 bg-white rounded-xl hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <span className="text-2xl">🏦</span>
              <div>
                <h3 className="font-semibold text-gray-800">퇴직금 가이드</h3>
                <p className="text-sm text-gray-500">퇴직금 계산법과 수령 전략</p>
              </div>
            </Link>
          </div>
        </div>

        {/* 하단 링크 */}
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <Link to="/about" className="hover:text-purple-600 transition-colors">
            서비스 소개
          </Link>
          <Link to="/privacy" className="hover:text-purple-600 transition-colors">
            개인정보처리방침
          </Link>
          <Link to="/contact" className="hover:text-purple-600 transition-colors">
            문의하기
          </Link>
        </div>
      </div>
    </>
  );
}

export default TaxGuide;
