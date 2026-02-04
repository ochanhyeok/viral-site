import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components';
import { Home } from './pages/Home';
import { SalaryCalculator } from './features/salary-calc/SalaryCalculator';
import { RetirementCalculator } from './features/retirement-calc/RetirementCalculator';
import { SpendingQuiz } from './features/spending-quiz/SpendingQuiz';
import { WorkMbti } from './features/work-mbti/WorkMbti';
import { StressTest } from './components/StressTest/StressTest';

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
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
