// Spir Webhook ペイロードの読み取り（公式スキーマ準拠）。
//
// 出典: Spir 公式ヘルプ「Webhookサービス連携」（確認日: 2026-08-04）
// https://help.spirinc.com/ja/webhookサービス連携
//
// event.confirmed の使用キー:
//   webhookEventName            イベント種別（"event.confirmed" のみ処理）
//   webhookEventId              冪等性キー（失敗時10秒×4回のリトライがあるため重複排除に使う）
//   payload.originalUrl         空き時間リンクURL → 振り分けに使う
//   payload.privateTitle        管理用タイトル（予備の振り分けキー）
//   payload.invitee.email       予約した本人 → メール突合に使う
//   payload.startDateTime       予定の開始時刻（ISO8601/UTC）→ booked_at に入れる
//     ※ confirmedAt は「確定操作をした日時」であり開始時刻ではない。取り違え注意。
//   payload.formAnswers[]       質問フォームの回答。question === "会社・団体名" の answer が会社名
//     ※ Spir側でフォームの質問ラベルを変更したら COMPANY_QUESTION も更新すること。
'use strict';

const COMPANY_QUESTION = '会社・団体名';

function parseWebhookBody(body) {
  const b = body || {};
  const p = b.payload || {};
  const formAnswers = Array.isArray(p.formAnswers) ? p.formAnswers : [];

  const answerOf = (question) => {
    const hit = formAnswers.find((a) => a && a.question === question && typeof a.answer === 'string' && a.answer.trim());
    return hit ? hit.answer.trim() : null;
  };

  return {
    eventName: typeof b.webhookEventName === 'string' ? b.webhookEventName : null,
    eventId: typeof b.webhookEventId === 'string' ? b.webhookEventId : null,
    originalUrl: typeof p.originalUrl === 'string' ? p.originalUrl : '',
    privateTitle: typeof p.privateTitle === 'string' ? p.privateTitle : '',
    inviteeEmail: p.invitee && typeof p.invitee.email === 'string' && p.invitee.email.trim()
      ? p.invitee.email.trim()
      : null,
    inviteeName: p.invitee && typeof p.invitee.name === 'string' && p.invitee.name.trim()
      ? p.invitee.name.trim()
      : answerOf('name'),
    startDateTime: typeof p.startDateTime === 'string' && p.startDateTime ? p.startDateTime : null,
    company: answerOf(COMPANY_QUESTION),
  };
}

// リード導線の空き時間リンクか（originalUrl に識別子が含まれるかで判定。privateTitle は予備）
function isLeadBooking(parsed, leadUrlIds) {
  return leadUrlIds.find((id) => id && (parsed.originalUrl.includes(id) || parsed.privateTitle.includes(id))) || null;
}

module.exports = { parseWebhookBody, isLeadBooking, COMPANY_QUESTION };
