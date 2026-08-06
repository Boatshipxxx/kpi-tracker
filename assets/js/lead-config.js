// リード導線のクライアント設定。
// SPIR_BOOKING_URL: Spirの「資料請求フォロー個別相談（Webサイト経由）」空き時間リンク。
//   サンクスページの「日程を調整する ↗」が別タブでこのURLを開く。
//   Spir は iframe 埋め込み用のURL/コードを提供していないため、ページ内埋め込みはしない。
//   未設定にするとボタンが消え、メール相談の案内だけが残る。
window.BS_LEAD_CONFIG = {
  SPIR_BOOKING_URL: 'https://app.spirinc.com/t/PzCSnkJVDW6MKMid8j7Im/as/qKLPfOuw3wj6welMiVqd5/confirm',
  CONTACT_EMAIL: 'contact@boatship.jp'
};
