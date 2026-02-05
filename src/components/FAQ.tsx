import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export function FAQ({ items, title = "자주 묻는 질문" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // schema.org FAQPage 마크업 생성
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">❓</span> {title}
        </h3>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-100 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800 pr-4">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// 각 페이지별 FAQ 데이터
export const salaryFAQ = [
  {
    question: "연봉 실수령액이란 무엇인가요?",
    answer: "연봉 실수령액은 세전 연봉에서 4대 보험료(국민연금, 건강보험, 장기요양보험, 고용보험)와 소득세, 지방소득세를 공제한 후 실제로 받는 금액입니다."
  },
  {
    question: "2025년 4대 보험 요율은 어떻게 되나요?",
    answer: "2025년 기준 국민연금 4.5%, 건강보험 3.545%, 장기요양보험 건강보험의 12.95%, 고용보험 0.9%입니다. 건강보험과 장기요양보험은 매년 조정됩니다."
  },
  {
    question: "부양가족 수에 따라 세금이 달라지나요?",
    answer: "네, 부양가족 수에 따라 소득세 공제액이 달라집니다. 부양가족이 많을수록 세금이 줄어들어 실수령액이 증가합니다."
  },
  {
    question: "비과세액이란 무엇인가요?",
    answer: "비과세액은 세금이 부과되지 않는 급여 항목으로, 식대(월 20만원 한도), 자가운전보조금(월 20만원 한도), 출산/보육수당 등이 포함됩니다."
  },
];

export const retirementFAQ = [
  {
    question: "퇴직금 계산 기준은 무엇인가요?",
    answer: "퇴직금은 '평균임금 × 30일 × (재직일수 ÷ 365일)' 공식으로 계산됩니다. 평균임금은 퇴직 전 3개월간의 임금 총액을 해당 기간의 총 일수로 나눈 금액입니다."
  },
  {
    question: "1년 미만 근무해도 퇴직금을 받을 수 있나요?",
    answer: "근로기준법상 퇴직금은 1년 이상 근무한 경우에 지급됩니다. 다만 회사 규정에 따라 1년 미만이어도 일부 지급하는 경우도 있습니다."
  },
  {
    question: "상여금도 퇴직금 계산에 포함되나요?",
    answer: "네, 정기적으로 지급되는 상여금은 평균임금 계산에 포함됩니다. 연간 상여금을 12로 나눈 후 3개월분을 계산에 반영합니다."
  },
  {
    question: "미사용 연차수당도 포함되나요?",
    answer: "퇴직 시 미사용 연차에 대한 수당이 있다면 이도 평균임금 계산에 포함됩니다. 연차수당은 1일 통상임금 × 미사용 연차일수로 계산합니다."
  },
];

export const spendingFAQ = [
  {
    question: "소비성향 테스트는 어떤 기준으로 분석하나요?",
    answer: "12개의 일상적인 소비 상황에서의 선택을 분석하여 충동적 소비, 계획적 소비, 가치 소비, 절약 성향 등을 종합적으로 평가합니다."
  },
  {
    question: "테스트 결과가 정확한가요?",
    answer: "이 테스트는 재미와 자기 성찰을 위한 목적으로 제작되었습니다. 결과는 참고용이며, 실제 재정 상담이 필요하다면 전문가와 상담하시기를 권장합니다."
  },
  {
    question: "테스트 결과는 저장되나요?",
    answer: "개인정보는 저장되지 않습니다. 나이대별 통계만 익명으로 집계되어 다른 참여자들과 비교하는 데 활용됩니다."
  },
];

export const mbtiFAQ = [
  {
    question: "직장인 MBTI는 일반 MBTI와 다른가요?",
    answer: "직장인 MBTI는 업무 환경에서의 성격 특성에 초점을 맞춘 테스트입니다. 회의, 업무 처리, 팀워크 등 직장 상황에서의 행동 패턴을 분석합니다."
  },
  {
    question: "16가지 유형 모두 나올 수 있나요?",
    answer: "네, 일반 MBTI와 마찬가지로 E/I, S/N, T/F, J/P 4가지 축을 기반으로 16가지 유형이 도출될 수 있습니다."
  },
  {
    question: "결과가 실제 MBTI와 다르면 어떻게 되나요?",
    answer: "직장에서의 모습과 개인 생활에서의 모습이 다를 수 있습니다. 이 테스트는 특히 업무 환경에서의 성향을 반영하므로 차이가 있을 수 있습니다."
  },
];

export const stressFAQ = [
  {
    question: "스트레스 지수는 어떻게 측정하나요?",
    answer: "업무량, 대인관계, 건강/생활, 미래불안, 환경 스트레스 5가지 영역에서 각각 2문항씩 총 10문항으로 측정합니다. 각 문항은 0-5점으로 평가됩니다."
  },
  {
    question: "스트레스 점수가 높으면 어떻게 해야 하나요?",
    answer: "높은 점수는 현재 스트레스 관리가 필요함을 의미합니다. 영역별 분석을 참고하여 특히 높은 영역에 집중하고, 필요시 전문가 상담을 권장합니다."
  },
  {
    question: "테스트는 얼마나 자주 하는 것이 좋나요?",
    answer: "스트레스 수준은 수시로 변할 수 있으므로, 월 1회 정도 정기적으로 체크하면 자신의 스트레스 변화를 파악하는 데 도움이 됩니다."
  },
];

export const kkondaeFAQ = [
  {
    question: "꼰대력 테스트란 무엇인가요?",
    answer: "직장에서의 의사소통 방식, 세대 간 이해도, 유연성 등을 측정하여 '꼰대 성향'을 재미있게 알아보는 테스트입니다."
  },
  {
    question: "꼰대 점수가 높으면 나쁜 건가요?",
    answer: "꼭 그렇지는 않습니다. 경험에서 오는 지혜와 원칙이 있다는 의미일 수 있어요. 다만, 세대 간 소통에서 유연성을 더하면 더 좋은 관계를 만들 수 있습니다."
  },
  {
    question: "MZ세대도 꼰대가 될 수 있나요?",
    answer: "나이와 관계없이 닫힌 사고방식을 가지면 누구나 꼰대 성향을 보일 수 있습니다. 이 테스트는 나이가 아닌 마인드셋을 측정합니다."
  },
];

export const burnoutFAQ = [
  {
    question: "번아웃 테스트는 어떤 기준으로 측정하나요?",
    answer: "신체적 피로, 정서적 소진, 업무 동기 저하, 냉소적 태도 등 번아웃의 핵심 증상을 10개 질문으로 측정합니다. 각 문항은 0-3점으로 평가됩니다."
  },
  {
    question: "번아웃 점수가 높으면 어떻게 해야 하나요?",
    answer: "높은 점수는 현재 충분한 휴식과 관리가 필요함을 의미합니다. 연차 사용, 업무량 조절, 전문가 상담 등을 고려해보세요."
  },
  {
    question: "번아웃과 단순 피로의 차이는 무엇인가요?",
    answer: "단순 피로는 휴식으로 회복되지만, 번아웃은 만성적인 스트레스로 인해 쉬어도 회복되지 않는 상태입니다. 의욕 상실, 냉소적 태도가 동반됩니다."
  },
  {
    question: "이 테스트가 의학적 진단을 대체할 수 있나요?",
    answer: "아닙니다. 이 테스트는 자가진단 목적의 참고용입니다. 심각한 증상이 지속된다면 반드시 정신건강의학과 전문의와 상담하시기 바랍니다."
  },
];

export const hoesikFAQ = [
  {
    question: "회식 생존 테스트는 어떤 것을 측정하나요?",
    answer: "직장 회식 상황에서의 대처 방식, 음주 문화 적응력, 상사/동료와의 관계 유지 능력 등을 8개 질문으로 재미있게 알아봅니다."
  },
  {
    question: "회식을 피하는 게 나쁜 건가요?",
    answer: "아닙니다. 개인의 성향과 상황에 따라 다릅니다. 다만, 팀 내 관계 형성에 회식이 도움이 될 수 있으니 가끔은 참석하는 것도 좋습니다."
  },
  {
    question: "음주를 못하면 회식이 불리한가요?",
    answer: "요즘은 음주를 강요하지 않는 문화가 확산되고 있습니다. 음주 대신 대화와 참여로 충분히 좋은 인상을 줄 수 있습니다."
  },
];

export const investFAQ = [
  {
    question: "투자 성향 테스트는 어떤 기준으로 분석하나요?",
    answer: "위험 감수 성향, 투자 기간, 목표 수익률, 손실 대응 방식 등을 8개 질문으로 분석하여 공격형, 균형형, 안정형, 보수형 4가지 유형으로 분류합니다."
  },
  {
    question: "테스트 결과대로 투자해야 하나요?",
    answer: "이 테스트는 참고용입니다. 실제 투자는 개인의 재정 상황, 투자 목적, 투자 기간 등을 종합적으로 고려해야 합니다. 필요시 전문 자산관리사와 상담하세요."
  },
  {
    question: "투자 성향은 바뀔 수 있나요?",
    answer: "네, 나이, 재정 상황, 투자 경험에 따라 성향이 변할 수 있습니다. 젊을 때는 공격적이다가 은퇴가 가까워지면 안정적으로 바뀌는 경우가 많습니다."
  },
  {
    question: "공격형 투자가 수익률이 더 높나요?",
    answer: "높은 수익 가능성과 함께 높은 손실 위험도 있습니다. 장기적으로는 본인 성향에 맞는 투자가 심리적 안정감과 꾸준한 투자를 가능하게 합니다."
  },
];
