// 社内Slack通知（仕様 4-6 / 6）。Incoming Webhook を使う。
// リードは反応速度がすべて。通知失敗はこの関数の外に伝播させず、
// console.error に残すだけにする（ユーザー体験に影響させない）。
'use strict';

const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';

async function post(text) {
  if (!WEBHOOK_URL) {
    console.error('[slack] SLACK_WEBHOOK_URL 未設定のため通知をスキップ:', text.split('\n')[0]);
    return false;
  }
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return true;
  } catch (err) {
    console.error('[slack] 通知失敗:', err.message);
    return false;
  }
}

function notifyNewLead({ company, name, assetId, landingUrl }) {
  return post(
    `新規リード\n会社：${company}／氏名：${name}\n資料：${assetId}\n流入元：${landingUrl}`
  );
}

// メール送信失敗の警告（仕様 6）。届いていないことに気づけない状態が最も損失が大きい。
function notifyMailFailure({ company, name, email, leadId, reason }) {
  return post(
    `⚠️ 自動返信メールの送信に失敗\n会社：${company}／氏名：${name}\n宛先：${email}\nlead id：${leadId}\n原因：${reason}\n→ 手動でフォローしてください（資料はサンクスページで表示済み）`
  );
}

function notifyBooking({ email, matched, leadId }) {
  return post(
    matched
      ? `📅 日程調整が確定（資料請求リードと突合済み）\nメール：${email}\nlead id：${leadId}`
      : `📅 日程調整が確定（直接予約 → direct_booking として新規記録）\nメール：${email}\nlead id：${leadId}`
  );
}

module.exports = { notifyNewLead, notifyMailFailure, notifyBooking, post };
