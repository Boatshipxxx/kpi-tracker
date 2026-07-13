/*
 * BOATship 読了率計測 — GA4 送信スクリプト(Notes / Magazine 共通)
 *
 * 送信イベント:
 *   scroll_depth  : スクロール 25 / 50 / 75 / 90% 到達時。params: article_id, percent
 *   read_complete : 本文末尾センチネル(#article-end)が可視 かつ
 *                   滞在時間 >= readTime(分) × 60 × 0.5 秒 の両条件で1回だけ。
 *                   params: article_id, read_time_sec
 *
 * 前提:
 *   - 記事ページに <div id="article-end" data-article-id="..." data-read-time="分数"> を置く
 *   - <head> に GA4 の gtag スニペット(測定ID)を読み込む
 *   - 測定IDは各テンプレの <head> に設定済み(G-P4HKHJ91Z5)。変更時は各テンプレの2箇所を差し替え
 *
 * デバッグ: URL に ?debug=1 を付けると console にイベントログを出力する。
 * 重複発火は sessionStorage で防止(同一セッション・同一記事で1回ずつ)。
 */
(function () {
  'use strict';

  var DEBUG = new URLSearchParams(location.search).has('debug');
  function log() {
    if (DEBUG && window.console) console.log.apply(console, ['[read-tracking]'].concat([].slice.call(arguments)));
  }
  function emit(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    log('event', name, params);
  }
  function seen(key) { try { return !!sessionStorage.getItem(key); } catch (e) { return false; } }
  function mark(key) { try { sessionStorage.setItem(key, '1'); } catch (e) {} }

  function init() {
    var end = document.getElementById('article-end');
    if (!end) { log('no #article-end sentinel — tracking skipped'); return; }

    var articleId = end.getAttribute('data-article-id')
      || new URLSearchParams(location.search).get('id')
      || location.pathname;
    var readMin = parseFloat(end.getAttribute('data-read-time')) || 0;
    var readTimeSec = Math.round(readMin * 60);
    var startedAt = Date.now();
    log('init', { article_id: articleId, read_time_sec: readTimeSec });

    /* ---- scroll_depth (25/50/75/90%) ---- */
    var MARKS = [25, 50, 75, 90];
    function onScroll() {
      var doc = document.documentElement;
      var scrollable = (document.body.scrollHeight || doc.scrollHeight) - window.innerHeight;
      if (scrollable <= 0) return;
      var pct = ((window.scrollY || doc.scrollTop) / scrollable) * 100;
      for (var i = 0; i < MARKS.length; i++) {
        var m = MARKS[i];
        if (pct >= m) {
          var key = 'sd:' + articleId + ':' + m;
          if (!seen(key)) { mark(key); emit('scroll_depth', { article_id: articleId, percent: m }); }
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---- read_complete (センチネル可視 かつ 滞在時間) ---- */
    var completeKey = 'rc:' + articleId;
    var sentinelSeen = false;
    var timer = null;
    function tryComplete() {
      if (seen(completeKey)) { if (timer) { clearInterval(timer); timer = null; } return; }
      var dwellOk = (Date.now() - startedAt) >= readTimeSec * 1000 * 0.5;
      if (sentinelSeen && dwellOk) {
        mark(completeKey);
        emit('read_complete', { article_id: articleId, read_time_sec: readTimeSec });
        if (timer) { clearInterval(timer); timer = null; }
      }
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { sentinelSeen = true; log('sentinel visible'); tryComplete(); }
        });
      }, { threshold: 0 });
      io.observe(end);
    } else {
      sentinelSeen = true; // 古い環境: 滞在条件のみで判定
    }
    // 滞在時間が後から満たされるケースに対応(1秒ごとに再判定)
    timer = setInterval(tryComplete, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
