import { useState } from 'react';
import { ChevronDown, ChevronUp, Target, CheckCircle, AlertCircle } from 'lucide-react';
import { monthlyGuides } from '../../data/monthlyGuide';

export default function MonthlyGuide() {
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set([new Date().getMonth() + 1]));
  const currentMonth = new Date().getMonth() + 1; // 1-12

  const toggleMonth = (month: number) => {
    setExpandedMonths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(month)) {
        newSet.delete(month);
      } else {
        newSet.add(month);
      }
      return newSet;
    });
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case '基礎固め':
        return 'bg-blue-100 text-blue-700';
      case '実践強化':
        return 'bg-purple-100 text-purple-700';
      case '深化と統合':
        return 'bg-green-100 text-green-700';
      case '完成と飛躍':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMonthStatus = (month: number) => {
    if (month < currentMonth) return 'past';
    if (month === currentMonth) return 'current';
    return 'future';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">12ヶ月の変容ガイド</h1>
        <p className="text-sm text-gray-500">あなたの内なる旅路</p>
      </div>

      {/* Phase Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">4つのフェーズ</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">基礎固め (1-3月)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-gray-600">実践強化 (4-6月)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">深化と統合 (7-9月)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-600">完成と飛躍 (10-12月)</span>
          </div>
        </div>
      </div>

      {/* Monthly Cards */}
      <div className="space-y-5">
        {monthlyGuides.map((guide) => {
          const isExpanded = expandedMonths.has(guide.month);
          const status = getMonthStatus(guide.month);
          const isCurrent = status === 'current';
          const isPast = status === 'past';

          return (
            <div
              key={guide.month}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                isCurrent
                  ? 'border-primary shadow-lg shadow-primary/20'
                  : isPast
                  ? 'border-gray-200 opacity-90'
                  : 'border-gray-200 opacity-75'
              }`}
            >
              {/* Card Header */}
              <button
                onClick={() => toggleMonth(guide.month)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-t-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                      isCurrent
                        ? 'bg-primary'
                        : isPast
                        ? 'bg-gray-400'
                        : 'bg-gray-300'
                    }`}
                  >
                    {guide.month}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPhaseColor(guide.phase)}`}>
                        {guide.phase}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary text-white">
                          今月
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-gray-800">{guide.theme}</div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Card Content */}
              {isExpanded && (
                <div className="px-6 pb-6 space-y-6 border-t border-gray-100 pt-6">
                  {/* KPIs Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-primary" />
                      <h4 className="text-sm font-semibold text-gray-700">KPI目標</h4>
                    </div>
                    <div className="space-y-3">
                      {guide.kpis.map((kpi, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-gray-50 rounded-lg p-4"
                        >
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">{kpi.name}</div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              目標: {kpi.target}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-secondary" />
                      <h4 className="text-sm font-semibold text-gray-700">推奨アクション</h4>
                    </div>
                    <div className="space-y-3">
                      {guide.actions.map((action, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 bg-gray-50 rounded-lg p-4"
                        >
                          <div className="w-6 h-6 flex items-center justify-center bg-secondary/10 text-secondary rounded-full text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-800">{action.action}</div>
                            <div className="text-xs text-gray-600 mt-0.5">
                              頻度: {action.frequency}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checkpoint Section */}
                  <div className="bg-blue-50 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-primary mb-2">
                          チェックポイント
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed">{guide.checkpoint}</div>
                      </div>
                    </div>
                  </div>

                  {/* Special Note */}
                  {guide.specialNote && (
                    <div className="bg-warning/10 border-l-4 border-warning rounded-r-lg p-5">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-semibold text-warning mb-2">
                            特別なお知らせ
                          </div>
                          <div className="text-sm text-gray-700 leading-relaxed">{guide.specialNote}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>この12ヶ月の旅を通じて、あなたは新しい自分に生まれ変わります。</p>
        <p className="mt-1">焦らず、一歩ずつ進んでいきましょう。</p>
      </div>
    </div>
  );
}
