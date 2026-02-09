import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, TrendingUp, Heart, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyLog } from '../../types';
import { useStorage, storageKeys } from '../../hooks/useStorage';
import { getCurrentMonthGuide } from '../../data/monthlyGuide';

interface WeeklyStats {
  hasRecordedToday: boolean;
  boundaryTotal: number;
  authenticTotal: number;
  avgDiscomfort: number;
  avgEnergy: number;
  avgAlignment: number;
  totalSoloTime: number;
}

interface ChartData {
  date: string;
  discomfort: number;
  energy: number;
  alignment: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { get } = useStorage();
  const [isLoading, setIsLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    hasRecordedToday: false,
    boundaryTotal: 0,
    authenticTotal: 0,
    avgDiscomfort: 0,
    avgEnergy: 0,
    avgAlignment: 0,
    totalSoloTime: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const currentGuide = getCurrentMonthGuide();
  const today = new Date();
  const formattedToday = storageKeys.formatDate(today);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);

      // Get last 7 days
      const last7Days: string[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push(storageKeys.formatDate(date));
      }

      // Load all daily logs for the last 7 days
      const dailyLogs: (DailyLog | null)[] = await Promise.all(
        last7Days.map((date) => get<DailyLog>(storageKeys.dailyLog(date)))
      );

      // Filter out null values
      const validLogs = dailyLogs.filter((log): log is DailyLog => log !== null);

      // Calculate weekly stats
      const hasToday = validLogs.some((log) => log.date === formattedToday);
      const boundarySum = validLogs.reduce((sum, log) => sum + log.boundaryCount, 0);
      const authenticSum = validLogs.reduce((sum, log) => sum + log.authenticCount, 0);
      const avgDiscomfort =
        validLogs.length > 0
          ? validLogs.reduce((sum, log) => sum + log.discomfortLevel, 0) / validLogs.length
          : 0;
      const avgEnergy =
        validLogs.length > 0
          ? validLogs.reduce((sum, log) => sum + log.energyState, 0) / validLogs.length
          : 0;
      const avgAlignment =
        validLogs.length > 0
          ? validLogs.reduce((sum, log) => sum + log.selfAlignment, 0) / validLogs.length
          : 0;
      const soloTimeSum = validLogs.reduce((sum, log) => sum + log.soloTimeHours, 0);

      setWeeklyStats({
        hasRecordedToday: hasToday,
        boundaryTotal: boundarySum,
        authenticTotal: authenticSum,
        avgDiscomfort: Math.round(avgDiscomfort * 10) / 10,
        avgEnergy: Math.round(avgEnergy * 10) / 10,
        avgAlignment: Math.round(avgAlignment * 10) / 10,
        totalSoloTime: Math.round(soloTimeSum * 10) / 10,
      });

      // Prepare chart data
      const charts: ChartData[] = last7Days.map((date) => {
        const log = validLogs.find((l) => l.date === date);
        const shortDate = date.slice(5); // MM-DD

        return {
          date: shortDate,
          discomfort: log?.discomfortLevel || 0,
          energy: log?.energyState || 0,
          alignment: log?.selfAlignment || 0,
        };
      });

      setChartData(charts);
      setIsLoading(false);
    };

    loadDashboardData();
  }, [get, formattedToday]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-full">
            {currentGuide.month}月
          </span>
          <span className="px-4 py-2 bg-secondary/10 text-secondary text-sm font-medium rounded-full">
            {currentGuide.phase}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{currentGuide.theme}</h1>
        <p className="text-sm text-gray-500">{formattedToday}</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-10 -mx-4 px-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 px-4">今週の状況</h2>
        <div className="flex gap-5 overflow-x-auto pb-4 px-4 snap-x snap-mandatory">
          {/* Today's Record Status */}
          <div className="flex-shrink-0 w-[300px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 snap-start">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">今日の記録</span>
              <PenLine className="w-6 h-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {weeklyStats.hasRecordedToday ? (
                <span className="text-success">✓ 記録済み</span>
              ) : (
                <span className="text-warning">未記録</span>
              )}
            </div>
          </div>

          {/* Boundary Count */}
          <div className="flex-shrink-0 w-[300px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 snap-start">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">境界線設定回数</span>
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary">{weeklyStats.boundaryTotal}</div>
            <div className="text-xs text-gray-500 mt-2">今週の合計</div>
          </div>

          {/* Authentic Count */}
          <div className="flex-shrink-0 w-[300px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 snap-start">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">本音発言回数</span>
              <Heart className="w-6 h-6 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-secondary">{weeklyStats.authenticTotal}</div>
            <div className="text-xs text-gray-500 mt-2">今週の合計</div>
          </div>

          {/* Solo Time */}
          <div className="flex-shrink-0 w-[300px] bg-white rounded-lg shadow-sm border border-gray-200 p-6 snap-start">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">ソロタイム</span>
              <Zap className="w-6 h-6 text-success" />
            </div>
            <div className="text-3xl font-bold text-success">{weeklyStats.totalSoloTime}h</div>
            <div className="text-xs text-gray-500 mt-2">今週の合計</div>
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-5">過去7日間の推移</h2>

        {/* Discomfort Level Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">違和感レベル</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="discomfort"
                stroke="#FFB347"
                strokeWidth={3}
                dot={{ fill: '#FFB347', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">平均: </span>
            <span className="text-lg font-bold text-warning">{weeklyStats.avgDiscomfort}</span>
          </div>
        </div>

        {/* Energy State Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">エネルギー状態</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#50C878"
                strokeWidth={3}
                dot={{ fill: '#50C878', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">平均: </span>
            <span className="text-lg font-bold text-success">{weeklyStats.avgEnergy}</span>
          </div>
        </div>

        {/* Self Alignment Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">自己一致度</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="alignment"
                stroke="#4A90E2"
                strokeWidth={3}
                dot={{ fill: '#4A90E2', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-600">平均: </span>
            <span className="text-lg font-bold text-primary">{weeklyStats.avgAlignment}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-5">クイックアクション</h2>
        <button
          onClick={() => navigate('/daily-log')}
          className="w-full py-5 bg-primary text-white text-lg font-semibold rounded-lg shadow-sm hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <PenLine className="w-6 h-6" />
          今日の記録をする
        </button>
      </div>
    </div>
  );
}
