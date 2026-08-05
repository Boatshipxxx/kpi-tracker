// リード導線のクライアント設定。
// SPIR_BOOKING_URL: Spirの「資料請求フォロー個別相談（Webサイト経由）」空き時間リンク。
//   読み込み失敗時、サンクスページはメール相談の代替導線を表示する。
window.BS_LEAD_CONFIG = {
  SPIR_BOOKING_URL: 'https://app.spirinc.com/t/PzCSnkJVDW6MKMid8j7Im/as/qKLPfOuw3wj6welMiVqd5/confirm',
  // iframe埋め込み専用のURL。Spirの管理画面で「埋め込み用」のURL/コードが
  // 提供されている場合はそれをここに貼る（未設定なら SPIR_BOOKING_URL を使う）。
  // 通常ページが X-Frame-Options 等でフレーム表示を拒否する場合の差し替え口。
  SPIR_EMBED_URL: '',
  CONTACT_EMAIL: 'contact@boatship.jp'
};
