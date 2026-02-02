import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/dashboard/Dashboard';
import DailyLogForm from './components/daily-log/DailyLogForm';
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
            <Route
              path="/weekly-review"
              element={
                <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
                  <h2 className="text-2xl font-bold text-gray-800">週次振り返り</h2>
                  <p className="text-gray-500 mt-2">準備中...</p>
                </div>
              }
            />
            <Route
              path="/monthly-guide"
              element={
                <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
                  <h2 className="text-2xl font-bold text-gray-800">月次ガイド</h2>
                  <p className="text-gray-500 mt-2">準備中...</p>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
