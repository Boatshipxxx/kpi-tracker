// テスト用のメモリDB。lib/leads-db.js が発行するSQLだけを解釈する。
// 本物のPostgresではないため、SQL文面が変わったらここも追従が必要。
'use strict';

const crypto = require('crypto');

function createMemoryDb() {
  const rows = [];
  const webhookEvents = new Set();

  return {
    rows,
    webhookEvents,
    async query(text, params) {
      const sql = text.replace(/\s+/g, ' ').trim();

      if (sql.startsWith('INSERT INTO webhook_events')) {
        // claimWebhookEvent: ON CONFLICT DO NOTHING 相当
        const [id] = params;
        if (webhookEvents.has(id)) return [];
        webhookEvents.add(id);
        return [{ id }];
      }

      if (sql.includes("'direct_booking'")) {
        // insertDirectBooking（insertLead と前方一致するため先に判定する）
        const [company, name, email, sourceUrl, bookedAt] = params;
        const row = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          company, name, email, department: null,
          asset_id: 'direct_booking',
          landing_url: sourceUrl, form_url: sourceUrl,
          referrer: null, utm_source: null, utm_medium: null, utm_campaign: null,
          consent_at: new Date().toISOString(),
          mail_status: 'sent', mail_sent_at: null, booked_at: bookedAt,
        };
        rows.push(row);
        return [{ id: row.id }];
      }

      if (sql.startsWith('INSERT INTO leads (company')) {
        // insertLead
        const [company, name, email, department, asset_id, landing_url, form_url,
          referrer, utm_source, utm_medium, utm_campaign, consent_at] = params;
        const row = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          company, name, email, department, asset_id, landing_url, form_url,
          referrer, utm_source, utm_medium, utm_campaign, consent_at,
          mail_status: 'queued', mail_sent_at: null, booked_at: null,
        };
        rows.push(row);
        return [{ id: row.id, created_at: row.created_at }];
      }

      if (sql.startsWith('UPDATE leads SET mail_status')) {
        const [id, status] = params;
        const row = rows.find((r) => r.id === id);
        if (row) {
          row.mail_status = status;
          if (status === 'sent') row.mail_sent_at = new Date().toISOString();
        }
        return [];
      }

      if (sql.startsWith('UPDATE leads SET booked_at')) {
        // markBookedByEmail: 最新レコードのみ更新
        const [email, bookedAt] = params;
        const candidates = rows
          .filter((r) => r.email.toLowerCase() === String(email).toLowerCase())
          .sort((a, b) => b.created_at.localeCompare(a.created_at));
        if (candidates.length === 0) return [];
        candidates[0].booked_at = bookedAt;
        return [{ id: candidates[0].id }];
      }

      throw new Error('memory-db: 未対応のSQL: ' + sql.slice(0, 80));
    },
  };
}

module.exports = { createMemoryDb };
