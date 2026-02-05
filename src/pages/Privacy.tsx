import { useState } from 'react';
import { SEO } from '../components';

export function Privacy() {
  const [showToast, setShowToast] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('pon07084@gmail.com');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <SEO
        title="개인정보처리방침"
        description="연봉계산기 & 심리테스트 개인정보처리방침"
      />

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">개인정보처리방침</h1>

          <div className="prose prose-gray prose-sm max-w-none space-y-6 text-gray-600">
            <p className="text-sm text-gray-500">시행일: 2025년 1월 1일</p>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">1. 개인정보의 처리 목적</h2>
              <p>
                본 웹사이트(이하 "사이트")는 다음의 목적을 위하여 개인정보를 처리합니다.
                처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며,
                이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>서비스 제공 및 운영</li>
                <li>사용자 경험 개선을 위한 통계 분석</li>
                <li>맞춤형 광고 제공</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">2. 수집하는 개인정보 항목</h2>
              <p>사이트는 서비스 제공을 위해 아래와 같은 정보를 수집할 수 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>자동 수집 정보:</strong> IP 주소, 브라우저 유형, 방문 일시, 서비스 이용 기록</li>
                <li><strong>사용자 입력 정보:</strong> 닉네임 (선택), 테스트 결과 (로컬 저장)</li>
              </ul>
              <p className="mt-2">
                * 테스트 결과 및 닉네임은 사용자의 브라우저(LocalStorage)에만 저장되며,
                서버에 개인을 식별할 수 있는 정보는 저장되지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">3. 개인정보의 보유 및 이용 기간</h2>
              <p>
                사이트는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를
                지체 없이 파기합니다. 단, 관련 법령에 의해 보존해야 하는 경우 해당 기간 동안 보관합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>LocalStorage 데이터: 사용자가 직접 삭제 시까지</li>
                <li>서비스 이용 기록: 3개월</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">4. 쿠키 및 광고</h2>
              <p>
                사이트는 Google AdSense를 통해 광고를 게재하고 있습니다.
                Google은 사용자의 관심사에 기반한 광고를 제공하기 위해 쿠키를 사용할 수 있습니다.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Google의 광고 쿠키 사용에 대한 자세한 내용은
                  <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline ml-1">
                    Google 광고 정책
                  </a>을 참조하세요.
                </li>
                <li>사용자는
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline ml-1">
                    Google 광고 설정
                  </a>에서 맞춤 광고를 비활성화할 수 있습니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">5. 개인정보의 제3자 제공</h2>
              <p>
                사이트는 원칙적으로 사용자의 개인정보를 외부에 제공하지 않습니다.
                다만, 아래의 경우에는 예외로 합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>사용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">6. 정보주체의 권리</h2>
              <p>사용자는 다음과 같은 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>개인정보 열람 요청</li>
                <li>오류 등이 있을 경우 정정 요청</li>
                <li>삭제 요청</li>
                <li>처리정지 요청</li>
              </ul>
              <p className="mt-2">
                LocalStorage에 저장된 데이터는 브라우저 설정 또는 사이트 내 "마이페이지 &gt; 데이터 초기화"
                기능을 통해 직접 삭제할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">7. 개인정보 보호책임자</h2>
              <p>
                개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한
                정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="mt-2 p-4 bg-gray-50 rounded-xl flex items-center gap-2">
                <p><strong>이메일:</strong> pon07084@gmail.com</p>
                <button
                  onClick={copyEmail}
                  className="px-2 py-1 text-xs bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition-colors cursor-pointer"
                >
                  복사
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">8. 개인정보처리방침 변경</h2>
              <p>
                이 개인정보처리방침은 법령 및 방침에 따라 변경될 수 있으며,
                변경 시 웹사이트를 통해 공지합니다.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mt-6 mb-3">9. 분석 도구</h2>
              <p>
                사이트는 서비스 개선을 위해 Firebase Analytics를 사용하여
                익명화된 사용 통계를 수집합니다. 수집된 정보는 개인을 식별하는 데 사용되지 않습니다.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              본 방침은 2025년 1월 1일부터 시행됩니다.
            </p>
          </div>
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
