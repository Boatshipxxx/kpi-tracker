/*
 * BOATship Notes — アクセス計測モジュール
 * Cookie不使用・端末ローカル(localStorage)に閲覧数と読了を記録する。
 * beaconEndpoint を設定すると外部計測サービス(GoatCounter等の収集URL)にも送信できる。
 * 記録したデータは /admin の「📊 Insights」でチューニング判断に使う。
 */
var NOTES_ANALYTICS_CONFIG = {
  beaconEndpoint: '' // 例: 'https://boatship.goatcounter.com/count' — 空なら端末ローカルのみ
};

var BSNotesAnalytics = (function () {
  var KEY = 'bs_notes_analytics_v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function entryFor(data, id) {
    if (!data[id]) data[id] = { views: 0, reads: 0, daily: {}, lastViewedAt: '' };
    return data[id];
  }
  function beacon(type, id) {
    if (!NOTES_ANALYTICS_CONFIG.beaconEndpoint || !navigator.sendBeacon) return;
    try {
      navigator.sendBeacon(
        NOTES_ANALYTICS_CONFIG.beaconEndpoint,
        JSON.stringify({ type: type, id: id, path: location.pathname + location.search, ts: Date.now() })
      );
    } catch (e) {}
  }

  return {
    trackView: function (id) {
      if (!id) return;
      var data = load();
      var e = entryFor(data, id);
      e.views += 1;
      e.daily[todayKey()] = (e.daily[todayKey()] || 0) + 1;
      e.lastViewedAt = new Date().toISOString();
      save(data);
      beacon('view', id);
    },
    trackReadComplete: function (id) {
      if (!id) return;
      var data = load();
      entryFor(data, id).reads += 1;
      save(data);
      beacon('read', id);
    },
    statsFor: function (id) {
      return load()[id] || { views: 0, reads: 0, daily: {}, lastViewedAt: '' };
    },
    all: function () {
      return load();
    }
  };
})();
