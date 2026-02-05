import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy } from 'react';
import { Layout } from './components';

// 홈페이지는 즉시 로드
import { Home } from './pages/Home';

// 나머지 페이지들은 지연 로드 (코드 스플리팅)
const SalaryCalculator = lazy(() => import('./features/salary-calc/SalaryCalculator').then(m => ({ default: m.SalaryCalculator })));
const RetirementCalculator = lazy(() => import('./features/retirement-calc/RetirementCalculator').then(m => ({ default: m.RetirementCalculator })));
const SpendingQuiz = lazy(() => import('./features/spending-quiz/SpendingQuiz').then(m => ({ default: m.SpendingQuiz })));
const WorkMbti = lazy(() => import('./features/work-mbti/WorkMbti').then(m => ({ default: m.WorkMbti })));
const StressTest = lazy(() => import('./components/StressTest/StressTest').then(m => ({ default: m.StressTest })));
const KkondaeTest = lazy(() => import('./features/kkondae-test/KkondaeTest').then(m => ({ default: m.KkondaeTest })));
const ColorTest = lazy(() => import('./features/color-test/ColorTest').then(m => ({ default: m.ColorTest })));
const ReactionTest = lazy(() => import('./features/reaction-test/ReactionTest').then(m => ({ default: m.ReactionTest })));
const EmojiQuiz = lazy(() => import('./features/emoji-quiz/EmojiQuiz').then(m => ({ default: m.EmojiQuiz })));
const MyPage = lazy(() => import('./pages/MyPage').then(m => ({ default: m.MyPage })));
const RankingPage = lazy(() => import('./pages/RankingPage').then(m => ({ default: m.RankingPage })));
const MultiplayerReaction = lazy(() => import('./pages/MultiplayerReaction').then(m => ({ default: m.MultiplayerReaction })));
const BattleshipGame = lazy(() => import('./features/battleship/BattleshipGame').then(m => ({ default: m.BattleshipGame })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(m => ({ default: m.Terms })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const ResignationTest = lazy(() => import('./features/hidden-tests/ResignationTest').then(m => ({ default: m.ResignationTest })));
const BurnoutTest = lazy(() => import('./features/burnout-test/BurnoutTest').then(m => ({ default: m.BurnoutTest })));
const HoesikTest = lazy(() => import('./features/hoesik-test/HoesikTest').then(m => ({ default: m.HoesikTest })));
const TaxRefundCalculator = lazy(() => import('./features/tax-refund/TaxRefundCalculator').then(m => ({ default: m.TaxRefundCalculator })));

// 로딩 컴포넌트
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-200 border-t-violet-600" />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/salary" element={<SalaryCalculator />} />
              <Route path="/retirement" element={<RetirementCalculator />} />
              <Route path="/spending-quiz" element={<SpendingQuiz />} />
              <Route path="/work-mbti" element={<WorkMbti />} />
              <Route path="/stress-test" element={<StressTest />} />
              <Route path="/kkondae-test" element={<KkondaeTest />} />
              <Route path="/color-test" element={<ColorTest />} />
              <Route path="/reaction-test" element={<ReactionTest />} />
              <Route path="/emoji-quiz" element={<EmojiQuiz />} />
              <Route path="/my" element={<MyPage />} />
              <Route path="/ranking" element={<RankingPage />} />
              <Route path="/play/reaction" element={<MultiplayerReaction />} />
              <Route path="/battleship" element={<BattleshipGame />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* 새 테스트 */}
              <Route path="/burnout-test" element={<BurnoutTest />} />
              <Route path="/hoesik-test" element={<HoesikTest />} />
              <Route path="/tax-refund" element={<TaxRefundCalculator />} />
              {/* 히든 테스트 */}
              <Route path="/resignation-test" element={<ResignationTest />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
