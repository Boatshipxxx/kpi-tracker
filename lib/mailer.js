// 自動返信メール（仕様 4-3）。
// - 必ずトランザクションメールサービス（Resend）を使う。sendmail等は使用禁止。
// - 差出人は実在アドレス。no-reply@ は使わない。
// - HTML とプレーンテキストの両方（multipart）で送る。
// - リンクは短縮せずフルURLを表示する。
'use strict';

const FROM = process.env.LEAD_MAIL_FROM || 'BOATship <contact@boatship.jp>';
// 資料請求フォロー個別相談（Webサイト経由）の空き時間リンク。
// assets/js/lead-config.js（サンクスページの埋め込み）と同じURLを保つこと。
const SPIR_BOOKING_URL = process.env.SPIR_BOOKING_URL
  || 'https://app.spirinc.com/t/PzCSnkJVDW6MKMid8j7Im/as/qKLPfOuw3wj6welMiVqd5/confirm';

function buildMail({ company, name, assetTitle, assetUrl, assetDownloadUrl }) {
  const subject = '【BOATship】ご請求の資料をお送りします';

  const bookingBlock = SPIR_BOOKING_URL
    ? `────────────────
30分ほどお時間をいただければ、
貴社の状況にあわせた具体的な進め方をご説明できます。

▼ 日程のご調整
${SPIR_BOOKING_URL}
────────────────

`
    : '';

  const dlUrl = assetDownloadUrl || assetUrl;
  const text = `${company} ${name} 様

資料をご請求いただきありがとうございます。
以下のリンクからPDFをダウンロードいただけます。

▼ ${assetTitle}（PDF）
${dlUrl}

※ ブラウザで読む場合はこちら
${assetUrl}

${bookingBlock}株式会社BOATship
東京都千代田区神保町
contact@boatship.jp
https://www.boatship.jp/
`;

  const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const bookingHtml = SPIR_BOOKING_URL
    ? `<hr style="border:none;border-top:1px solid #ccc;margin:24px 0;">
<p>30分ほどお時間をいただければ、貴社の状況にあわせた具体的な進め方をご説明できます。</p>
<p>▼ 日程のご調整<br><a href="${escapeHtml(SPIR_BOOKING_URL)}">${escapeHtml(SPIR_BOOKING_URL)}</a></p>
<hr style="border:none;border-top:1px solid #ccc;margin:24px 0;">`
    : '';

  const html = `<div style="font-family:sans-serif;font-size:14px;line-height:1.9;color:#111;">
<p>${escapeHtml(company)} ${escapeHtml(name)} 様</p>
<p>資料をご請求いただきありがとうございます。<br>以下のリンクからPDFをダウンロードいただけます。</p>
<p>▼ ${escapeHtml(assetTitle)}（PDF）<br><a href="${escapeHtml(dlUrl)}">${escapeHtml(dlUrl)}</a></p>
<p style="font-size:12px;">※ ブラウザで読む場合はこちら<br><a href="${escapeHtml(assetUrl)}">${escapeHtml(assetUrl)}</a></p>
${bookingHtml}
<p>株式会社BOATship<br>東京都千代田区神保町<br>contact@boatship.jp<br><a href="https://www.boatship.jp/">https://www.boatship.jp/</a></p>
</div>`;

  return { subject, text, html };
}

async function sendLeadMail({ to, company, name, assetTitle, assetUrl, assetDownloadUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const { Resend } = require('resend');
  const resend = new Resend(apiKey);
  const mail = buildMail({ company, name, assetTitle, assetUrl, assetDownloadUrl });
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    replyTo: process.env.LEAD_MAIL_REPLY_TO || 'contact@boatship.jp',
  });
  if (error) throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`);
  return data;
}

// ===== 予約確定メール（Spir Webhook から送る） =====
//
// Spir の標準通知だけでは予約者にミーティング案内が届かない事象があったため、
// 予約確定 Webhook を受けたタイミングで自社から確定メールを送る。
// Web会議URLは payload.onlineMeeting.url を載せる（未発行なら当日案内する旨を書く）。

// ISO日時を日本時間の「2026年8月10日（月）10:00」形式にする
function formatJst(iso, timeZone) {
  const tz = timeZone || 'Asia/Tokyo';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  // month は 'long' だと環境（ICU）によって「8月」「8」と揺れるため numeric で取り、単位は自前で付ける
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric',
    weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(d);
  const get = (t) => (parts.find((x) => x.type === t) || {}).value || '';
  const weekday = get('weekday').replace(/曜日?$/, '');
  return `${get('year')}年${get('month')}月${get('day')}日（${weekday}）${get('hour')}:${get('minute')}`;
}

function formatTimeRange({ startDateTime, endDateTime, timeZone }) {
  const start = formatJst(startDateTime, timeZone);
  if (!start) return null;
  const end = endDateTime ? formatJst(endDateTime, timeZone) : null;
  // 終了は時刻だけ添える（同日前提）
  const endTime = end ? end.slice(end.indexOf('）') + 1) : null;
  return endTime ? `${start} 〜 ${endTime}` : start;
}

function buildBookingMail({ name, company, startDateTime, endDateTime, timeZone, meetingUrl, meetingPassword }) {
  const when = formatTimeRange({ startDateTime, endDateTime, timeZone }) || '（日時は確定メールをご確認ください）';
  const greetName = [company, name].filter(Boolean).join(' ');
  const subject = '【BOATship】ご相談の日程が確定しました';

  const meetingText = meetingUrl
    ? `▼ オンライン会議URL\n${meetingUrl}\n${meetingPassword ? `パスコード: ${meetingPassword}\n` : ''}`
    : '▼ オンライン会議URL\n当日までに別途ご案内します。\n';

  const text = `${greetName} 様

ご相談の日程が確定しましたのでお知らせします。

▼ 日時
${when}（所要30分）

${meetingText}
当日は、お送りした資料の内容を貴社の状況にあてはめて、
具体的に何から始めるかをお話しします。事前のご準備は不要です。

日程の変更・キャンセルをご希望の場合は、このメールにご返信ください。

株式会社BOATship
東京都千代田区神保町
contact@boatship.jp
https://www.boatship.jp/
`;

  const esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const meetingHtml = meetingUrl
    ? `<p>▼ オンライン会議URL<br><a href="${esc(meetingUrl)}">${esc(meetingUrl)}</a>${meetingPassword ? `<br>パスコード: ${esc(meetingPassword)}` : ''}</p>`
    : '<p>▼ オンライン会議URL<br>当日までに別途ご案内します。</p>';

  const html = `<div style="font-family:sans-serif;font-size:14px;line-height:1.9;color:#111;">
<p>${esc(greetName)} 様</p>
<p>ご相談の日程が確定しましたのでお知らせします。</p>
<p>▼ 日時<br><strong>${esc(when)}</strong>（所要30分）</p>
${meetingHtml}
<p>当日は、お送りした資料の内容を貴社の状況にあてはめて、具体的に何から始めるかをお話しします。事前のご準備は不要です。</p>
<p>日程の変更・キャンセルをご希望の場合は、このメールにご返信ください。</p>
<p>株式会社BOATship<br>東京都千代田区神保町<br>contact@boatship.jp<br><a href="https://www.boatship.jp/">https://www.boatship.jp/</a></p>
</div>`;

  return { subject, text, html };
}

async function sendBookingConfirmation({ to, name, company, startDateTime, endDateTime, timeZone, meetingUrl, meetingPassword }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const { Resend } = require('resend');
  const resend = new Resend(apiKey);
  const mail = buildBookingMail({ name, company, startDateTime, endDateTime, timeZone, meetingUrl, meetingPassword });
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    replyTo: process.env.LEAD_MAIL_REPLY_TO || 'contact@boatship.jp',
  });
  if (error) throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`);
  return data;
}

module.exports = { sendLeadMail, buildMail, sendBookingConfirmation, buildBookingMail };
