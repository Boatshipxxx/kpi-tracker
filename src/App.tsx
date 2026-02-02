import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Calendar, TrendingUp, Menu } from 'lucide-react';
import DailyLogForm from './components/daily-log/DailyLogForm';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-primary">KPI Tracker</h1>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="メニュー"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<DailyLogForm />} />
            <Route
              path="/dashboard"
              element={
                <div className="max-w-2xl mx-auto px-4 py-6">
                  <h2 className="text-2xl font-bold text-gray-800">ダッシュボード</h2>
                  <p className="text-gray-500 mt-2">準備中...</p>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-around py-2">
              <Link
                to="/"
                className="flex flex-col items-center gap-1 px-6 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Calendar className="w-6 h-6" />
                <span className="text-xs font-medium">今日の記録</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex flex-col items-center gap-1 px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-xs font-medium">ダッシュボード</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </BrowserRouter>
  );
}

export default App;
