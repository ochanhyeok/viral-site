import { SEO } from '../components';

export function Terms() {
  return (
    <>
      <SEO
        title="이용약관"
        description="연봉계산기 & 심리테스트 서비스 이용약관"
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">이용약관</h1>

          <div className="prose prose-gray prose-sm max-w-none space-y-6 text-gray-600">
            <p className="text-sm text-gray-500">시행일: 2025년 1월 1일</p>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제1조 (목적)</h2>
              <p>
                이 약관은 "연봉계산기 & 심리테스트" 웹사이트(이하 "서비스")가 제공하는
                모든 서비스의 이용 조건 및 절차, 이용자와 서비스 제공자의 권리, 의무 및
                책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제2조 (정의)</h2>
              <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li>
                  <strong>"서비스"</strong>란 연봉 계산기, 퇴직금 계산기, 심리테스트 등
                  본 웹사이트에서 제공하는 모든 온라인 서비스를 말합니다.
                </li>
                <li>
                  <strong>"이용자"</strong>란 본 약관에 따라 서비스를 이용하는 모든 사용자를 말합니다.
                </li>
                <li>
                  <strong>"콘텐츠"</strong>란 서비스 내에서 제공되는 텍스트, 이미지, 테스트 결과 등
                  모든 정보를 말합니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제3조 (약관의 효력 및 변경)</h2>
              <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li>이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</li>
                <li>
                  서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 웹사이트에
                  공지함으로써 효력이 발생합니다.
                </li>
                <li>
                  이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제4조 (서비스의 제공)</h2>
              <p>서비스는 다음과 같은 기능을 제공합니다.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>연봉 실수령액 계산 서비스</li>
                <li>퇴직금 계산 서비스</li>
                <li>각종 심리테스트 서비스</li>
                <li>테스트 결과 저장 및 공유 기능</li>
                <li>기타 서비스가 정하는 부가 서비스</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제5조 (서비스 이용)</h2>
              <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li>서비스는 별도의 회원가입 없이 누구나 무료로 이용할 수 있습니다.</li>
                <li>서비스는 연중무휴 24시간 제공을 원칙으로 합니다.</li>
                <li>
                  단, 시스템 점검, 장애 발생 등 불가피한 사유가 있는 경우 서비스 제공이
                  일시적으로 중단될 수 있습니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제6조 (결과의 정확성)</h2>
              <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li>
                  연봉 계산기, 퇴직금 계산기의 결과는 <strong>참고용</strong>으로만 활용되어야 하며,
                  실제 금액과 차이가 있을 수 있습니다.
                </li>
                <li>
                  심리테스트 결과는 <strong>오락 목적</strong>으로 제공되며, 전문적인 심리 상담이나
                  진단을 대체할 수 없습니다.
                </li>
                <li>
                  서비스는 계산 결과 및 테스트 결과로 인해 발생하는 어떠한 손해에 대해서도
                  책임을 지지 않습니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제7조 (이용자의 의무)</h2>
              <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                <li>서비스를 이용하여 타인의 권리를 침해하는 행위</li>
                <li>서비스의 콘텐츠를 무단으로 복제, 배포, 상업적으로 이용하는 행위</li>
                <li>자동화된 수단을 이용하여 서비스에 접근하는 행위</li>
                <li>기타 관련 법령에 위반되는 행위</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제8조 (지적재산권)</h2>
              <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li>
                  서비스에서 제공하는 모든 콘텐츠(테스트 문항, 결과 문구, 디자인 등)에 대한
                  저작권은 서비스 제공자에게 있습니다.
                </li>
                <li>
                  이용자는 개인적인 용도로만 콘텐츠를 이용할 수 있으며, 서비스 제공자의
                  사전 동의 없이 상업적으로 이용할 수 없습니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제9조 (광고)</h2>
              <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li>
                  서비스는 운영을 위해 Google AdSense 등을 통한 광고를 게재할 수 있습니다.
                </li>
                <li>
                  광고로 인해 발생하는 이용자와 광고주 간의 거래에 대해 서비스는 책임을 지지 않습니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제10조 (면책조항)</h2>
              <ul className="list-decimal pl-5 space-y-2 mt-2">
                <li>
                  서비스는 천재지변, 시스템 장애 등 불가항력으로 인해 서비스를 제공할 수 없는
                  경우 책임이 면제됩니다.
                </li>
                <li>
                  이용자의 귀책사유로 인한 서비스 이용 장애에 대해서는 책임을 지지 않습니다.
                </li>
                <li>
                  서비스에서 제공하는 정보의 정확성, 완전성, 적시성에 대해 보증하지 않습니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">제11조 (준거법 및 관할)</h2>
              <p>
                이 약관의 해석 및 적용에 관해서는 대한민국 법률을 적용하며,
                서비스 이용과 관련하여 발생하는 분쟁에 대해서는 민사소송법에 따른
                관할 법원에 제소합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">부칙</h2>
              <p>이 약관은 2025년 1월 1일부터 시행합니다.</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              본 약관은 2025년 1월 1일부터 시행됩니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
