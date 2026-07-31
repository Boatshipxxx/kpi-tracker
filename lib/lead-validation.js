// フォーム入力の検証。クライアント側（request/index.html）と同じ仕様で
// サーバー側でも必ず検証する（仕様 4-1）。
// エラーメッセージは「何をどう直せばよいか」を書く。「入力エラー」だけの表示は不可。
'use strict';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = 200;

// 送信までの経過時間がこれ未満なら bot とみなして拒否（仕様 4-1）
const MIN_ELAPSED_MS = 3000;

function validateLeadInput(body) {
  const errors = {};
  const b = body || {};

  const company = String(b.company || '').trim();
  const name = String(b.name || '').trim();
  const email = String(b.email || '').trim();
  const department = String(b.department || '').trim();

  if (!company) errors.company = '会社・団体名を入力してください。個人の方は「個人」とご記入ください。';
  else if (company.length > MAX_LEN) errors.company = `会社・団体名は${MAX_LEN}文字以内で入力してください。`;

  if (!name) errors.name = '氏名を入力してください。';
  else if (name.length > MAX_LEN) errors.name = `氏名は${MAX_LEN}文字以内で入力してください。`;

  if (!email) errors.email = 'メールアドレスを入力してください。資料はこのアドレスにもお送りします。';
  else if (!EMAIL_RE.test(email)) errors.email = 'メールアドレスの形式が正しくありません。例: taro@example.co.jp';
  else if (email.length > MAX_LEN) errors.email = `メールアドレスは${MAX_LEN}文字以内で入力してください。`;

  if (department.length > MAX_LEN) errors.department = `部署・役職は${MAX_LEN}文字以内で入力してください。`;

  if (b.consent !== 'on' && b.consent !== true && b.consent !== 'true') {
    errors.consent = '個人情報の取扱いへの同意が必要です。チェックを入れてください。';
  }

  return { errors, values: { company, name, email, department: department || null } };
}

// スパム判定。ユーザーにフィールドエラーとしては返さない（botに手がかりを与えない）。
function isSpam(body) {
  const b = body || {};
  // honeypot: 画面には表示されないフィールド。埋まっていたら bot。
  if (String(b.website || '').trim() !== '') return 'honeypot';
  const started = Number(b.started_at);
  if (!Number.isFinite(started)) return 'no_timer';
  if (Date.now() - started < MIN_ELAPSED_MS) return 'too_fast';
  return null;
}

module.exports = { validateLeadInput, isSpam, MIN_ELAPSED_MS };
