/* עם מקדשי שביעי — order form behaviour.
 *
 * ORDER_ENDPOINT: where a submitted order is POSTed as JSON.
 * Leave it empty and the form behaves exactly like the design prototype —
 * it validates and shows the confirmation, but sends nothing anywhere.
 * Set it to a URL (Make/Zapier webhook, Google Apps Script, your own API…)
 * to actually deliver orders.
 */
const ORDER_ENDPOINT = '';

(function () {
  'use strict';

  const form = document.getElementById('order-form');
  const success = document.getElementById('success');
  const successName = document.getElementById('success-name');
  const errorBox = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit');

  const nameEl = document.getElementById('name');
  const phoneEl = document.getElementById('phone');
  const addressEl = document.getElementById('address');
  const qtyEl = document.getElementById('qty');
  const consentEl = document.getElementById('consent');

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function clearError() {
    errorBox.textContent = '';
    errorBox.hidden = true;
  }

  [nameEl, phoneEl, addressEl, qtyEl, consentEl].forEach(function (el) {
    el.addEventListener('input', clearError);
    el.addEventListener('change', clearError);
  });

  function showSuccess(name) {
    successName.textContent = name;
    form.hidden = true;
    success.hidden = false;
    success.setAttribute('tabindex', '-1');
    success.focus();
    success.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const order = {
      name: nameEl.value.trim(),
      phone: phoneEl.value.trim(),
      address: addressEl.value.trim(),
      qty: qtyEl.value,
      consent: consentEl.checked,
      product: 'עם מקדשי שביעי',
      submittedAt: new Date().toISOString()
    };

    if (!order.name || !order.phone) {
      showError('נא למלא שם וטלפון');
      (order.name ? phoneEl : nameEl).focus();
      return;
    }
    if (!order.consent) {
      showError('נא לאשר יצירת קשר');
      consentEl.focus();
      return;
    }

    clearError();

    if (!ORDER_ENDPOINT) {
      showSuccess(order.name);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'שולח…';

    fetch(ORDER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        showSuccess(order.name);
      })
      .catch(function () {
        showError('אירעה תקלה בשליחה. נסו שוב או צרו קשר טלפונית.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'אני רוצה את הספר »';
      });
  });
})();
