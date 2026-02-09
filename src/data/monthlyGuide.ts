import { MonthlyGuide } from '../types';

/**
 * 12-Month Personal Development Journey
 * Japanese content for themes, checkpoints, and special notes
 */
export const monthlyGuides: MonthlyGuide[] = [
  {
    month: 1,
    phase: '基礎固め',
    theme: '自己認識と境界線の確立',
    kpis: [
      { name: '境界線を引いた回数', target: '週15回', unit: '回' },
      { name: '本音を表現した回数', target: '週10回', unit: '回' },
      { name: '禁止行動ゼロ日数', target: '月20日', unit: '日' },
    ],
    actions: [
      { action: '朝のチェックイン（感情・ニーズ確認）', frequency: '毎日' },
      { action: '境界線を引く練習', frequency: '1日2回以上' },
      { action: '週次振り返り', frequency: '週1回' },
    ],
    checkpoint: '自分の感情とニーズに気づき、小さなノーが言えるようになる',
  },
  {
    month: 2,
    phase: '基礎固め',
    theme: '違和感センサーの研ぎ澄まし',
    kpis: [
      { name: '違和感に気づいた回数', target: '週20回', unit: '回' },
      { name: '自己対話の実践', target: '毎日', unit: '日' },
      { name: 'ソロタイム確保時間', target: '週10時間', unit: '時間' },
    ],
    actions: [
      { action: '違和感日記をつける', frequency: '毎日' },
      { action: '自分との対話時間を確保', frequency: '1日30分' },
      { action: '感情を名付ける練習', frequency: '違和感ごと' },
    ],
    checkpoint: '体の声（違和感）を素早くキャッチできるようになる',
  },
  {
    month: 3,
    phase: '基礎固め',
    theme: '自己信頼の土台作り',
    kpis: [
      { name: '自分との約束を守った回数', target: '週5回', unit: '回' },
      { name: 'セルフケア実践日数', target: '月25日', unit: '日' },
      { name: 'エネルギーレベル平均', target: '7/10以上', unit: 'ポイント' },
    ],
    actions: [
      { action: '小さな自己約束を立て守る', frequency: '週5回' },
      { action: 'セルフケアルーティン実践', frequency: '毎日' },
      { action: '成功体験を記録する', frequency: '毎日' },
    ],
    checkpoint: '自分を裏切らない、自分を大切にする習慣が定着する',
    specialNote: '第1四半期の統合：基礎が固まり始める時期',
  },
  {
    month: 4,
    phase: '実践強化',
    theme: '関係性の見直しと選択',
    kpis: [
      { name: '関係性の境界線設定', target: '月5回', unit: '回' },
      { name: '有害な関係への対処', target: '即時対応', unit: '回' },
      { name: '自己尊重度', target: '8/10以上', unit: 'ポイント' },
    ],
    actions: [
      { action: '人間関係マップを作成', frequency: '月初' },
      { action: 'エネルギーを奪う関係を特定', frequency: '週次' },
      { action: '必要な距離感を実践', frequency: '継続' },
    ],
    checkpoint: 'どの関係を続け、どの関係から離れるべきか判断できる',
  },
  {
    month: 5,
    phase: '実践強化',
    theme: '感情の自由と表現力',
    kpis: [
      { name: '感情を正直に表現した回数', target: '週15回', unit: '回' },
      { name: '感情抑圧ゼロ日数', target: '月20日', unit: '日' },
      { name: '不快感との付き合い方', target: '適切な対処', unit: '回' },
    ],
    actions: [
      { action: 'ネガティブ感情を歓迎する', frequency: '感情発生時' },
      { action: '感情を言語化する練習', frequency: '毎日' },
      { action: '感情日記をつける', frequency: '毎日' },
    ],
    checkpoint: 'すべての感情を否定せず、適切に扱えるようになる',
  },
  {
    month: 6,
    phase: '実践強化',
    theme: '本物の自分の発見と表現',
    kpis: [
      { name: '本音で生きた時間', target: '週90%以上', unit: '%' },
      { name: '仮面を外した回数', target: '週10回', unit: '回' },
      { name: '自己一致度', target: '9/10以上', unit: 'ポイント' },
    ],
    actions: [
      { action: '本音と建前のギャップを観察', frequency: '毎日' },
      { action: 'ありのままを表現する練習', frequency: '1日3回' },
      { action: '自己開示の実践', frequency: '適切な場面で' },
    ],
    checkpoint: '本物の自分で生きることが自然になる',
    specialNote: '第2四半期の統合：自己表現力が大きく向上する',
  },
  {
    month: 7,
    phase: '深化と統合',
    theme: '価値観の明確化と優先順位',
    kpis: [
      { name: '価値観に沿った決断', target: '週5回', unit: '回' },
      { name: '優先順位の実践', target: '毎日', unit: '日' },
      { name: '時間の自己投資率', target: '70%以上', unit: '%' },
    ],
    actions: [
      { action: '価値観リストを作成し更新', frequency: '月初・月末' },
      { action: '日々の選択を価値観で評価', frequency: '毎日' },
      { action: 'ノーと言うべきものにノーと言う', frequency: '必要時' },
    ],
    checkpoint: '自分の価値観が明確で、それに基づいて生きられる',
  },
  {
    month: 8,
    phase: '深化と統合',
    theme: '内なる声との対話深化',
    kpis: [
      { name: '直感に従った決断', target: '週3回', unit: '回' },
      { name: '静寂の時間', target: '1日1時間', unit: '時間' },
      { name: '内省の質', target: '8/10以上', unit: 'ポイント' },
    ],
    actions: [
      { action: '瞑想・静寂の時間確保', frequency: '毎日' },
      { action: '内なる声に耳を傾ける', frequency: '決断前' },
      { action: 'ジャーナリング深化', frequency: '毎日' },
    ],
    checkpoint: '外の雑音に惑わされず、内なる声を信頼できる',
  },
  {
    month: 9,
    phase: '深化と統合',
    theme: '自己実現への行動',
    kpis: [
      { name: '本当にやりたいことへの行動', target: '週5回', unit: '回' },
      { name: '他人軸ゼロ日数', target: '月25日', unit: '日' },
      { name: '充実感レベル', target: '9/10以上', unit: 'ポイント' },
    ],
    actions: [
      { action: '本当の望みリストを作成', frequency: '月初' },
      { action: '小さな一歩を毎日踏む', frequency: '毎日' },
      { action: '他人の期待を手放す', frequency: '継続' },
    ],
    checkpoint: '自分の人生を自分で創造している実感を持つ',
    specialNote: '第3四半期の統合：内面の安定と方向性が定まる',
  },
  {
    month: 10,
    phase: '完成と飛躍',
    theme: '新しい自己イメージの確立',
    kpis: [
      { name: '自己肯定感', target: '9/10以上', unit: 'ポイント' },
      { name: '新しいアイデンティティの実践', target: '毎日', unit: '日' },
      { name: '過去の自分との決別', target: '完了', unit: '回' },
    ],
    actions: [
      { action: '新しい自己イメージを描く', frequency: '月初' },
      { action: '古いパターンに気づき手放す', frequency: '発生時' },
      { action: '新しい自分として行動する', frequency: '毎日' },
    ],
    checkpoint: '生まれ変わった自分を生きている',
  },
  {
    month: 11,
    phase: '完成と飛躍',
    theme: '統合と調和',
    kpis: [
      { name: '全側面での調和', target: '8/10以上', unit: 'ポイント' },
      { name: 'ライフバランス', target: '適切な配分', unit: '状態' },
      { name: '持続可能性', target: '確立', unit: '状態' },
    ],
    actions: [
      { action: 'ライフエリアごとの確認', frequency: '週次' },
      { action: 'バランス調整', frequency: '必要時' },
      { action: '長期的視点での評価', frequency: '月次' },
    ],
    checkpoint: 'すべてが調和し、無理なく持続できている',
  },
  {
    month: 12,
    phase: '完成と飛躍',
    theme: '新しいステージへ',
    kpis: [
      { name: '1年の統合と祝福', target: '完了', unit: '状態' },
      { name: '次のビジョン設定', target: '明確化', unit: '状態' },
      { name: '感謝と自己承認', target: '毎日', unit: '日' },
    ],
    actions: [
      { action: '1年間の振り返り', frequency: '月初' },
      { action: '成長の証を確認する', frequency: '週次' },
      { action: '次のステージを描く', frequency: '月末' },
    ],
    checkpoint: '完全に生まれ変わり、次のステージへ進む準備ができている',
    specialNote: '完成の月：1年間の旅の統合と新たな出発',
  },
];

/**
 * Get guide for specific month
 */
export const getMonthlyGuide = (month: number): MonthlyGuide | undefined => {
  return monthlyGuides.find((guide) => guide.month === month);
};

/**
 * Get current month's guide
 */
export const getCurrentMonthGuide = (): MonthlyGuide => {
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed
  return getMonthlyGuide(currentMonth) || monthlyGuides[0];
};

/**
 * Get all phases
 */
export const getPhases = (): string[] => {
  return Array.from(new Set(monthlyGuides.map((guide) => guide.phase)));
};
