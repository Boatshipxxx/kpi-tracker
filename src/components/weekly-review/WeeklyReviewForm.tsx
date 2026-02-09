import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { DailyLog, WeeklyReview } from '../../types';
import { useStorage, storageKeys } from '../../hooks/useStorage';
import { startOfWeek, endOfWeek, format } from 'date-fns';

interface WeeklySummary {
  boundaryTotal: number;
  authenticTotal: number;
  avgDiscomfort: number;
  avgEnergy: number;
  avgAlignment: number;
  totalSoloTime: number;
  prohibitedAvoidanceRate: number;
  daysRecorded: number;
}

export default function WeeklyReviewForm() {
  const { get, set, list } = useStorage();
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [pastReviews, setPastReviews] = useState<WeeklyReview[]>([]);
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  // Calculate week boundaries only once using useMemo to prevent re-renders
  const { weekStart, weekEnd, weekId, weekStartStr, weekEndStr } = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const end = endOfWeek(today, { weekStartsOn: 1 }); // Sunday

    return {
      weekStart: start,
      weekEnd: end,
      weekId: storageKeys.getWeekId(today),
      weekStartStr: storageKeys.formatDate(start),
      weekEndStr: storageKeys.formatDate(end),
    };
  }, []); // Empty deps = calculate only once on mount

  const [formData, setFormData] = useState<WeeklyReview>({
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    insights: '',
    changes: '',
    challenges: '',
    kpiSummary: {
      boundaryTotal: 0,
      authenticTotal: 0,
      avgDiscomfort: 0,
      avgEnergy: 0,
      avgAlignment: 0,
      totalSoloTime: 0,
    },
  });

  useEffect(() => {
    let isMounted = true;

    const loadWeekData = async () => {
      try {
        setIsLoading(true);

        // Re-calculate weekStart from weekStartStr to avoid Date object in deps
        const currentWeekStart = new Date(weekStartStr);

        // Get all days in current week
        const weekDays: string[] = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(currentWeekStart);
          date.setDate(date.getDate() + i);
          weekDays.push(storageKeys.formatDate(date));
        }

        console.log('Loading weekly review data for days:', weekDays);

        // Load daily logs for the week
        const dailyLogs: (DailyLog | null)[] = await Promise.all(
          weekDays.map((date) => get<DailyLog>(storageKeys.dailyLog(date)))
        );

        console.log('Loaded daily logs:', dailyLogs);

        const validLogs = dailyLogs.filter((log): log is DailyLog => log !== null);

        console.log('Valid logs count:', validLogs.length);

        // Calculate weekly summary
        if (validLogs.length > 0) {
          const boundarySum = validLogs.reduce((sum, log) => sum + log.boundaryCount, 0);
          const authenticSum = validLogs.reduce((sum, log) => sum + log.authenticCount, 0);
          const avgDiscomfort =
            validLogs.reduce((sum, log) => sum + log.discomfortLevel, 0) / validLogs.length;
          const avgEnergy =
            validLogs.reduce((sum, log) => sum + log.energyState, 0) / validLogs.length;
          const avgAlignment =
            validLogs.reduce((sum, log) => sum + log.selfAlignment, 0) / validLogs.length;
          const soloTimeSum = validLogs.reduce((sum, log) => sum + log.soloTimeHours, 0);

          // Calculate prohibited actions avoidance rate
          let totalProhibitedActions = 0;
          let totalAvoidedActions = 0;
          validLogs.forEach((log) => {
            if (!log.prohibitedActions) {
              console.warn('Log missing prohibitedActions:', log);
              return;
            }
            const actions = Object.values(log.prohibitedActions);
            totalProhibitedActions += actions.length;
            totalAvoidedActions += actions.filter((action) => !action).length;
          });

          console.log('Prohibited actions stats:', {
            totalProhibitedActions,
            totalAvoidedActions,
          });

          const avoidanceRate =
            totalProhibitedActions > 0
              ? (totalAvoidedActions / totalProhibitedActions) * 100
              : 100;

          if (isMounted) {
            setWeeklySummary({
              boundaryTotal: boundarySum,
              authenticTotal: authenticSum,
              avgDiscomfort: Math.round(avgDiscomfort * 10) / 10,
              avgEnergy: Math.round(avgEnergy * 10) / 10,
              avgAlignment: Math.round(avgAlignment * 10) / 10,
              totalSoloTime: Math.round(soloTimeSum * 10) / 10,
              prohibitedAvoidanceRate: Math.round(avoidanceRate),
              daysRecorded: validLogs.length,
            });
          }
        }

        // Load existing weekly review if it exists
        const existingReview = await get<WeeklyReview>(storageKeys.weeklyReview(weekId));
        if (existingReview && isMounted) {
          setFormData(existingReview);
        }

        // Load past reviews
        const reviewKeys = await list('weekly-reviews:');
        const reviews = await Promise.all(
          reviewKeys.map((key) => get<WeeklyReview>(key))
        );
        const validReviews = reviews
          .filter((review): review is WeeklyReview => review !== null)
          .sort((a, b) => b.weekStart.localeCompare(a.weekStart));

        if (isMounted) {
          setPastReviews(validReviews.slice(0, 10)); // Show last 10 reviews
        }
      } catch (error) {
        console.error('Error loading weekly review data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadWeekData();

    return () => {
      isMounted = false;
    };
    // Only run once on mount - weekId/weekStartStr/weekEndStr are stable strings
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!weeklySummary) return;

    const reviewData: WeeklyReview = {
      ...formData,
      kpiSummary: {
        boundaryTotal: weeklySummary.boundaryTotal,
        authenticTotal: weeklySummary.authenticTotal,
        avgDiscomfort: weeklySummary.avgDiscomfort,
        avgEnergy: weeklySummary.avgEnergy,
        avgAlignment: weeklySummary.avgAlignment,
        totalSoloTime: weeklySummary.totalSoloTime,
      },
    };

    const success = await set(storageKeys.weeklyReview(weekId), reviewData);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reload past reviews to include the new one
      const reviewKeys = await list('weekly-reviews:');
      const reviews = await Promise.all(
        reviewKeys.map((key) => get<WeeklyReview>(key))
      );
      const validReviews = reviews
        .filter((review): review is WeeklyReview => review !== null)
        .sort((a, b) => b.weekStart.localeCompare(a.weekStart));
      setPastReviews(validReviews.slice(0, 10));
    }
  };

  const toggleReviewExpand = (weekStart: string) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(weekStart)) {
        newSet.delete(weekStart);
      } else {
        newSet.add(weekStart);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-800 mb-3">週次振り返り</h1>
      <p className="text-sm text-gray-500 mb-8">
        {format(weekStart, 'yyyy/MM/dd')} - {format(weekEnd, 'yyyy/MM/dd')}
      </p>

      {/* Weekly Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">今週のKPIサマリー</h2>

        {weeklySummary ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-4">
            <div className="bg-gray-50 rounded-lg p-5">
              <div className="text-xs text-gray-600 mb-2">記録日数</div>
              <div className="text-2xl font-bold text-gray-800">
                {weeklySummary.daysRecorded}
                <span className="text-sm font-normal text-gray-500">/7日</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <div className="text-xs text-gray-600 mb-2">境界線設定</div>
              <div className="text-2xl font-bold text-primary">{weeklySummary.boundaryTotal}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <div className="text-xs text-gray-600 mb-2">本音発言</div>
              <div className="text-2xl font-bold text-secondary">
                {weeklySummary.authenticTotal}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <div className="text-xs text-gray-600 mb-2">平均違和感</div>
              <div className="text-2xl font-bold text-warning">{weeklySummary.avgDiscomfort}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <div className="text-xs text-gray-600 mb-2">平均エネルギー</div>
              <div className="text-2xl font-bold text-success">{weeklySummary.avgEnergy}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <div className="text-xs text-gray-600 mb-2">平均自己一致</div>
              <div className="text-2xl font-bold text-primary">{weeklySummary.avgAlignment}</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <div className="text-xs text-gray-600 mb-2">ソロタイム</div>
              <div className="text-2xl font-bold text-gray-800">
                {weeklySummary.totalSoloTime}h
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 col-span-2">
              <div className="text-xs text-gray-600 mb-2">禁止事項回避率</div>
              <div className="text-2xl font-bold text-success">
                {weeklySummary.prohibitedAvoidanceRate}%
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800 font-medium mb-2">📊 今週の記録がまだありません</p>
            <p className="text-sm text-blue-600">
              「記録」タブから日々のKPIを記録すると、ここに週次サマリーが表示されます。
            </p>
          </div>
        )}
      </div>

      {/* Reflection Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">振り返り</h2>

        <div className="space-y-8">
          {/* Insights */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">今週の気づき</label>
            <textarea
              value={formData.insights}
              onChange={(e) => setFormData((prev) => ({ ...prev, insights: e.target.value }))}
              rows={5}
              placeholder="今週気づいたことを書いてください..."
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Changes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">今週の変化</label>
            <textarea
              value={formData.changes}
              onChange={(e) => setFormData((prev) => ({ ...prev, changes: e.target.value }))}
              rows={5}
              placeholder="今週の変化を書いてください..."
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          {/* Challenges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              今週のチャレンジ
            </label>
            <textarea
              value={formData.challenges}
              onChange={(e) => setFormData((prev) => ({ ...prev, challenges: e.target.value }))}
              rows={5}
              placeholder="今週直面した課題を書いてください..."
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full mt-8 py-5 bg-primary text-white text-lg font-medium rounded-lg shadow-sm hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-6 h-6" />
          保存する
        </button>
      </div>

      {/* Past Reviews */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-5">過去の振り返り</h2>
        {pastReviews.length > 0 ? (
          <div className="space-y-4">
            {pastReviews.map((review) => {
              const isExpanded = expandedReviews.has(review.weekStart);
              const isCurrentWeek = review.weekStart === weekStartStr;

              return (
                <div
                  key={review.weekStart}
                  className={`bg-white rounded-lg shadow-sm border ${
                    isCurrentWeek ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => toggleReviewExpand(review.weekStart)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-800">
                        {review.weekStart} - {review.weekEnd}
                        {isCurrentWeek && (
                          <span className="ml-2 text-xs text-primary">(今週)</span>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-5">
                      {/* KPI Summary */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">境界線:</span>{' '}
                          <span className="font-semibold">{review.kpiSummary.boundaryTotal}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">本音:</span>{' '}
                          <span className="font-semibold">{review.kpiSummary.authenticTotal}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">ソロ:</span>{' '}
                          <span className="font-semibold">{review.kpiSummary.totalSoloTime}h</span>
                        </div>
                      </div>

                      {review.insights && (
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">気づき</div>
                          <div className="text-sm text-gray-700">{review.insights}</div>
                        </div>
                      )}

                      {review.changes && (
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">変化</div>
                          <div className="text-sm text-gray-700">{review.changes}</div>
                        </div>
                      )}

                      {review.challenges && (
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">チャレンジ</div>
                          <div className="text-sm text-gray-700">{review.challenges}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">📝 まだ振り返りを保存していません</p>
            <p className="text-sm text-gray-500 mt-2">
              上の振り返りフォームを記入して保存すると、ここに履歴が表示されます。
            </p>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-success text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">保存しました！</span>
          </div>
        </div>
      )}
    </div>
  );
}
