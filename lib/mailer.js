// 自動返信メール（仕様 4-3）。
// - 必ずトランザクションメールサービス（Resend）を使う。sendmail等は使用禁止。
// - 差出人は実在アドレス。no-reply@ は使わない。
// - HTML とプレーンテキストの両方（multipart）で送る。
// - リンクは短縮せずフルURLを表示する。
'use strict';

const FROM = process.env.LEAD_MAIL_FROM || 'BOATship <contact@boatship.jp>';
const SPIR_BOOKING_URL = process.env.SPIR_BOOKING_URL || '';

function buildMail({ company, name, assetTitle, assetUrl }) {
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

  const text = `${company} ${name} 様

資料をご請求いただきありがとうございます。
以下からご覧いただけます。

▼ ${assetTitle}
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
<p>資料をご請求いただきありがとうございます。<br>以下からご覧いただけます。</p>
<p>▼ ${escapeHtml(assetTitle)}<br><a href="${escapeHtml(assetUrl)}">${escapeHtml(assetUrl)}</a></p>
${bookingHtml}
<p>株式会社BOATship<br>東京都千代田区神保町<br>contact@boatship.jp<br><a href="https://www.boatship.jp/">https://www.boatship.jp/</a></p>
</div>`;

  return { subject, text, html };
}

async function sendLeadMail({ to, company, name, assetTitle, assetUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const { Resend } = require('resend');
  const resend = new Resend(apiKey);
  const mail = buildMail({ company, name, assetTitle, assetUrl });
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

module.exports = { sendLeadMail, buildMail };
