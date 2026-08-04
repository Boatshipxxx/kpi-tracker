// 資料請求フォーム（/request/）の挙動。
// サーバー側（lib/lead-validation.js）と同じ検証仕様。片方だけ変更しないこと。
(function () {
  'use strict';

  var form = document.getElementById('leadForm');
  if (!form) return;

  var PAGE_LOADED_AT = Date.now();
  var params = new URLSearchParams(location.search);
  var assetId = params.get('asset') || 'pr-planning-template';

  // --- 資料カタログを読み、ヘッダの資料名を差し替える ---
  fetch('/assets/data/lead-assets.json')
    .then(function (r) { return r.json(); })
    .then(function (catalog) {
      var a = catalog[assetId];
      if (!a) { assetId = 'pr-planning-template'; a = catalog[assetId]; }
      if (a) {
        document.getElementById('assetTitle').textContent = a.title;
        document.getElementById('assetDesc').textContent = a.description || '';
      }
    })
    .catch(function () { /* 表示は既定のままフォームは使える */ });

  // --- 流入元（初回訪問Cookie。main.js が保存している） ---
  function readFirstTouch() {
    var m = document.cookie.match(/(?:^|;\s*)bs_first_touch=([^;]*)/);
    if (!m) return {};
    try { return JSON.parse(decodeURIComponent(m[1])); } catch (e) { return {}; }
  }

  // --- GA4: form_view（仕様 5） ---
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'form_view', { asset_id: assetId });
  }

  // --- 検証（サーバーと同一仕様） ---
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validate(values) {
    var errors = {};
    if (!values.company) errors.company = '会社・団体名を入力してください。個人の方は「個人」とご記入ください。';
    if (!values.name) errors.name = '氏名を入力してください。';
    if (!values.email) errors.email = 'メールアドレスを入力してください。資料はこのアドレスにもお送りします。';
    else if (!EMAIL_RE.test(values.email)) errors.email = 'メールアドレスの形式が正しくありません。例: taro@example.co.jp';
    if (!values.consent) errors.consent = '個人情報の取扱いへの同意が必要です。チェックを入れてください。';
    return errors;
  }

  function showErrors(errors) {
    form.querySelectorAll('.field').forEach(function (f) {
      var key = f.getAttribute('data-field');
      var p = f.querySelector('.field-error');
      if (errors[key]) {
        f.classList.add('invalid');
        p.textContent = errors[key];
      } else {
        f.classList.remove('invalid');
        p.textContent = '';
      }
    });
    var first = form.querySelector('.field.invalid input');
    if (first) first.focus();
  }

  var submitBtn = document.getElementById('leadSubmit');
  var formError = document.getElementById('leadFormError');

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    formError.classList.remove('show');

    var values = {
      company: form.company.value.trim(),
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      department: form.department.value.trim(),
      consent: form.consent.checked,
    };
    var errors = validate(values);
    showErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // 二重送信防止（仕様 4-1）
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中…';

    var ft = readFirstTouch();
    var payload = {
      company: values.company,
      name: values.name,
      email: values.email,
      department: values.department,
      consent: 'on',
      asset_id: assetId,
      // 流入元の記録（仕様 3）: landing_url と form_url は別物
      landing_url: ft.lu || '',
      referrer: ft.ref || document.referrer || '',
      utm_source: ft.us || '',
      utm_medium: ft.um || '',
      utm_campaign: ft.uc || '',
      // form_url = フォームを送信したページ。CTA経由なら ?from= に元記事が入る
      form_url: params.get('from') || document.referrer || location.pathname + location.search,
      website: form.website.value,
      started_at: PAGE_LOADED_AT,
    };

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().then(function (data) { return { status: res.status, data: data }; });
      })
      .then(function (r) {
        if (r.status === 200 && r.data.ok) {
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'form_submit', { asset_id: assetId });
          }
          location.href = r.data.redirect || '/thanks/?asset=' + encodeURIComponent(assetId);
          return;
        }
        if (r.status === 422 && r.data.errors) {
          showErrors(r.data.errors);
        } else {
          formError.textContent = r.data.error || '送信に失敗しました。少し時間をおいて再度お試しください。';
          formError.classList.add('show');
        }
        submitBtn.disabled = false;
        submitBtn.textContent = '資料をダウンロード';
      })
      .catch(function () {
        formError.textContent = '通信に失敗しました。電波状況をご確認のうえ、もう一度お試しください。解決しない場合は contact@boatship.jp までご連絡ください。';
        formError.classList.add('show');
        submitBtn.disabled = false;
        submitBtn.textContent = '資料をダウンロード';
      });
  });
})();
