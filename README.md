# KPI セルフマネジメント (KPI Tracker)

個人KPI追跡・自己成長管理のためのプログレッシブウェブアプリケーション (PWA)

## 🎯 Features

### 📱 Daily Log (日々の記録)
- 境界線設定回数・本音発言回数のカウンター
- 禁止行動チェックリスト (4項目)
- 違和感レベル・エネルギー状態・自己一致度のスライダー (1-10)
- ソロタイム記録
- メモ機能
- localStorage への自動保存

### 🏠 Dashboard (ダッシュボード)
- 今月のテーマ表示
- 週間統計カード (4種類)
- 7日間のトレンドチャート (3種類)
- 週間合計・平均値の計算
- クイックアクションボタン

### 📝 Weekly Review (週次振り返り)
- KPIサマリーの自動計算
  - 記録日数
  - 境界線設定・本音発言の合計
  - 違和感・エネルギー・自己一致の平均
  - ソロタイムの合計
  - 禁止事項回避率
- 気づき・変化・チャレンジの記録
- 過去の振り返り履歴 (最大10件)

### 📅 Monthly Guide (月次ガイド)
- 12ヶ月の変容ジャーニー
- 4つのフェーズ (基礎固め → 実践強化 → 深化と統合 → 完成と飛躍)
- 各月のKPI目標
- 推奨アクション
- チェックポイント
- 今月のハイライト表示

### 🧭 Navigation
- 固定式ボトムナビゲーション (4タブ)
- アクティブステート表示
- iPhone ノッチ対応

## 🚀 Tech Stack

- **Framework:** React 18.3.1
- **Build Tool:** Vite 6.0.5
- **Language:** TypeScript 5.7.2
- **Routing:** React Router DOM 7.12.0
- **Charts:** Recharts 3.6.0
- **Icons:** Lucide React 0.562.0
- **Styling:** Tailwind CSS 4.1.18
- **Date Utils:** date-fns 4.1.0
- **PWA:** vite-plugin-pwa 1.2.0

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Boatshipxxx/kpi-tracker.git
cd kpi-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Boatshipxxx/kpi-tracker)

## 📱 PWA Features

- ✅ Installable as native app
- ✅ Offline support
- ✅ Service worker caching
- ✅ iOS Safari compatible
- ✅ Home screen icons
- ✅ Splash screen
- ✅ Portrait orientation lock

## 💾 Data Storage

All data is stored in browser's localStorage:
- No server required
- Privacy-first design
- Data stays on your device
- ~136 KB per year of usage

### Storage Keys
```
daily-logs:{YYYY-MM-DD}      → Daily log entries
weekly-reviews:{YYYY-Www}    → Weekly review entries
```

## 🎨 Design System

### Color Palette
- **Primary:** #4A90E2 (Blue) - Boundaries, Current items
- **Secondary:** #7B68EE (Purple) - Authentic expression
- **Success:** #50C878 (Green) - Energy, Recorded status
- **Warning:** #FFB347 (Orange) - Discomfort, Alerts

### Phase Colors (Monthly Guide)
- **Blue:** 基礎固め (1-3月)
- **Purple:** 実践強化 (4-6月)
- **Green:** 深化と統合 (7-9月)
- **Orange:** 完成と飛躍 (10-12月)

## 📊 Project Structure

```
src/
├── components/
│   ├── daily-log/          # Daily tracking form
│   ├── dashboard/          # Home screen with charts
│   ├── navigation/         # Bottom navigation
│   ├── weekly-review/      # Weekly reflection
│   └── monthly-guide/      # 12-month journey
├── hooks/
│   └── useStorage.ts       # localStorage wrapper
├── types/
│   └── index.ts            # TypeScript interfaces
├── data/
│   └── monthlyGuide.ts     # 12-month journey data
└── utils/
    └── index.ts            # Utility functions
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Code Statistics

- **Components:** 5 main components (1,262 lines)
- **Custom Hooks:** 1 hook (133 lines)
- **TypeScript Types:** 8 interfaces
- **Data:** 12-month journey (Japanese)
- **Total:** 1,706 lines of code

## 📱 Browser Support

- Chrome 90+ ✅
- Safari 14+ ✅
- Firefox 88+ ✅
- Edge 90+ ✅
- Mobile browsers (iOS Safari, Chrome Mobile) ✅

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for personal or educational purposes.

## 🙏 Acknowledgments

- Built with React and Vite
- Charts powered by Recharts
- Icons from Lucide React
- Inspired by personal growth and self-management principles

## 📞 Support

For issues or questions:
- Open an issue: https://github.com/Boatshipxxx/kpi-tracker/issues

---

**Made with ❤️ for personal growth and self-management**
