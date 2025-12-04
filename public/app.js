const endpoints = {
  chat: '/api/chat'
};

const setStatus = (el, text) => {
  if (el) el.textContent = text;
};

const toggleBusy = (btn, busy) => {
  if (!btn) return;
  btn.disabled = busy;
  btn.style.opacity = busy ? 0.7 : 1;
};

const request = async (url, payload) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  return res.json();
};

const renderSentiment = (result) => {
  if (!result) return 'No prediction returned.';
  const rows = Array.isArray(result) ? result.flat() : [result];
  const formatted = rows
    .map((item) => {
      if (typeof item === 'string') return item;
      const label = item.label || item?.[0]?.label;
      const score = (item.score ?? item?.[0]?.score ?? 0) * 100;
      return label ? `${label}: ${score.toFixed(2)}%` : JSON.stringify(item);
    })
    .filter(Boolean);
  return formatted.length ? formatted.join('\n') : JSON.stringify(result, null, 2);
};

const attachHandlers = () => {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatMessage');
  const chatOutput = document.getElementById('chatOutput');
  const chatStatus = document.getElementById('chatStatus');
  const chatBtn = document.getElementById('chatBtn');

  chatForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;
    setStatus(chatStatus, 'Запит до OpenAI…');
    toggleBusy(chatBtn, true);
    try {
      const data = await request(endpoints.chat, { message });
      chatOutput.textContent = data.reply?.trim() || 'No reply received.';
      setStatus(chatStatus, 'Готово');
    } catch (err) {
      console.error(err);
      chatOutput.textContent = `Помилка: ${err.message}`;
      setStatus(chatStatus, 'Помилка');
    } finally {
      toggleBusy(chatBtn, false);
    }
  });
};

document.addEventListener('DOMContentLoaded', attachHandlers);
