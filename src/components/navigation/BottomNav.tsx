import { Link, useLocation } from 'react-router-dom';
import { Home, PenLine, BarChart3, Calendar } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'ホーム' },
  { path: '/daily-log', icon: PenLine, label: '記録' },
  { path: '/weekly-review', icon: BarChart3, label: '振り返り' },
  { path: '/monthly-guide', icon: Calendar, label: 'ガイド' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-bottom">
      <div className="max-w-4xl mx-auto px-3 py-2">
        <div className="flex items-center justify-around gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1.5 px-5 py-4 min-w-[75px] rounded-lg transition-all ${
                  isActive
                    ? 'text-primary bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-7 h-7 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
