import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components';
import { Home } from './pages/Home';
import { SalaryCalculator } from './features/salary-calc/SalaryCalculator';
import { RetirementCalculator } from './features/retirement-calc/RetirementCalculator';
import { SpendingQuiz } from './features/spending-quiz/SpendingQuiz';
import { WorkMbti } from './features/work-mbti/WorkMbti';
import { StressTest } from './components/StressTest/StressTest';
import { KkondaeTest } from './features/kkondae-test/KkondaeTest';
import { ColorTest } from './features/color-test/ColorTest';
import { ReactionTest } from './features/reaction-test/ReactionTest';
import { EmojiQuiz } from './features/emoji-quiz/EmojiQuiz';
import { MyPage } from './pages/MyPage';
import { RankingPage } from './pages/RankingPage';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout>
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
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
