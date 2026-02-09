import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import DailyLogForm from './components/daily-log/DailyLogForm';
import WeeklyReviewForm from './components/weekly-review/WeeklyReviewForm';
import MonthlyGuide from './components/monthly-guide/MonthlyGuide';
import BottomNav from './components/navigation/BottomNav';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily-log" element={<DailyLogForm />} />
            <Route path="/weekly-review" element={<WeeklyReviewForm />} />
            <Route path="/monthly-guide" element={<MonthlyGuide />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
