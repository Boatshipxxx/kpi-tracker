import { useState, useEffect } from 'react';
import { Check, Plus, Minus } from 'lucide-react';
import { DailyLog } from '../../types';
import { useStorage, storageKeys } from '../../hooks/useStorage';

const EMOJI_INDICATORS = {
  discomfort: ['😌', '🙂', '😐', '😕', '😟', '😰', '😨', '😱', '😵', '🤯'],
  energy: ['😴', '🥱', '😑', '😐', '🙂', '😊', '😄', '🤗', '🚀', '⚡'],
  alignment: ['😞', '😔', '😐', '🤔', '🙂', '😊', '😌', '✨', '🌟', '💫'],
};

const PROHIBITED_ACTIONS = [
  { key: 'action1', label: '我慢して関係を続ける' },
  { key: 'action2', label: '丸め込む' },
  { key: 'action3', label: '説得で圧をかける' },
  { key: 'action4', label: '契約を急ぐ' },
] as const;

export default function DailyLogForm() {
  const { get, set } = useStorage();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const today = storageKeys.formatDate(new Date());

  const [formData, setFormData] = useState<DailyLog>({
    date: today,
    boundaryCount: 0,
    authenticCount: 0,
    prohibitedActions: {
      action1: false,
      action2: false,
      action3: false,
      action4: false,
    },
    discomfortLevel: 5,
    energyState: 5,
    selfAlignment: 5,
    soloTimeHours: 0,
    notes: '',
  });

  // Load existing data for today
  useEffect(() => {
    const loadTodayData = async () => {
      const key = storageKeys.dailyLog(today);
      const existingData = await get<DailyLog>(key);
      if (existingData) {
        setFormData(existingData);
      }
      setIsLoading(false);
    };
    loadTodayData();
  }, [get, today]);

  const handleCounterChange = (field: 'boundaryCount' | 'authenticCount', delta: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta),
    }));
  };

  const handleProhibitedActionChange = (key: keyof DailyLog['prohibitedActions']) => {
    setFormData((prev) => ({
      ...prev,
      prohibitedActions: {
        ...prev.prohibitedActions,
        [key]: !prev.prohibitedActions[key],
      },
    }));
  };

  const handleSliderChange = (
    field: 'discomfortLevel' | 'energyState' | 'selfAlignment',
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const key = storageKeys.dailyLog(today);
    const success = await set(key, formData);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">今日の記録</h2>
        <p className="text-sm text-gray-500 mb-6">{today}</p>

        {/* Counter Section */}
        <div className="space-y-6 mb-8">
          {/* Boundary Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              境界線設定回数
            </label>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <button
                type="button"
                onClick={() => handleCounterChange('boundaryCount', -1)}
                className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
                aria-label="減らす"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-3xl font-bold text-primary">{formData.boundaryCount}</span>
              <button
                type="button"
                onClick={() => handleCounterChange('boundaryCount', 1)}
                className="w-12 h-12 flex items-center justify-center bg-primary text-white rounded-full shadow-sm hover:bg-blue-600 active:scale-95 transition-transform"
                aria-label="増やす"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Authentic Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              本音発言回数
            </label>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <button
                type="button"
                onClick={() => handleCounterChange('authenticCount', -1)}
                className="w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-transform"
                aria-label="減らす"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-3xl font-bold text-secondary">
                {formData.authenticCount}
              </span>
              <button
                type="button"
                onClick={() => handleCounterChange('authenticCount', 1)}
                className="w-12 h-12 flex items-center justify-center bg-secondary text-white rounded-full shadow-sm hover:bg-purple-600 active:scale-95 transition-transform"
                aria-label="増やす"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Prohibited Actions */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            禁止行動チェック
          </label>
          <div className="space-y-3">
            {PROHIBITED_ACTIONS.map((action) => (
              <label
                key={action.key}
                className="flex items-start p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={formData.prohibitedActions[action.key]}
                  onChange={() => handleProhibitedActionChange(action.key)}
                  className="w-5 h-5 mt-0.5 text-warning border-gray-300 rounded focus:ring-warning focus:ring-2"
                />
                <span className="ml-3 text-sm text-gray-700">{action.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Range Sliders */}
        <div className="space-y-6 mb-8">
          {/* Discomfort Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              違和感レベル
            </label>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">快適</span>
              <span className="text-2xl">
                {EMOJI_INDICATORS.discomfort[formData.discomfortLevel - 1]}
              </span>
              <span className="text-xs text-gray-500">不快</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.discomfortLevel}
              onChange={(e) => handleSliderChange('discomfortLevel', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-warning"
            />
            <div className="text-center mt-1">
              <span className="text-lg font-bold text-warning">{formData.discomfortLevel}</span>
              <span className="text-xs text-gray-500"> / 10</span>
            </div>
          </div>

          {/* Energy State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              エネルギー状態
            </label>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">低</span>
              <span className="text-2xl">
                {EMOJI_INDICATORS.energy[formData.energyState - 1]}
              </span>
              <span className="text-xs text-gray-500">高</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.energyState}
              onChange={(e) => handleSliderChange('energyState', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-success"
            />
            <div className="text-center mt-1">
              <span className="text-lg font-bold text-success">{formData.energyState}</span>
              <span className="text-xs text-gray-500"> / 10</span>
            </div>
          </div>

          {/* Self Alignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              自己一致度
            </label>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">低</span>
              <span className="text-2xl">
                {EMOJI_INDICATORS.alignment[formData.selfAlignment - 1]}
              </span>
              <span className="text-xs text-gray-500">高</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.selfAlignment}
              onChange={(e) => handleSliderChange('selfAlignment', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="text-center mt-1">
              <span className="text-lg font-bold text-primary">{formData.selfAlignment}</span>
              <span className="text-xs text-gray-500"> / 10</span>
            </div>
          </div>
        </div>

        {/* Solo Time */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ソロタイム（時間）
          </label>
          <input
            type="number"
            min="0"
            max="24"
            step="0.5"
            value={formData.soloTimeHours}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, soloTimeHours: Number(e.target.value) }))
            }
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Notes */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">メモ</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            rows={4}
            placeholder="今日の気づきや振り返りを書いてください..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-4 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-blue-600 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          保存する
        </button>
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
