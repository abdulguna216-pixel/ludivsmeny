const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false, message: 'Метод не поддерживается' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return response.status(503).json({ ok: false, message: 'Telegram ещё не настроен' });
  }

  const name = String(request.body?.name || '').trim().slice(0, 80);
  const phone = String(request.body?.phone || '').trim().slice(0, 40);
  if (!name || !phone) {
    return response.status(400).json({ ok: false, message: 'Заполните имя и телефон' });
  }

  const text = [
    '<b>Новая заявка / ЛЮДИ В СМЕНУ</b>',
    '',
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Телефон:</b> ${escapeHtml(phone)}`,
    `<b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Athens' })}`,
  ].join('\n');

  try {
    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
    if (!telegramResponse.ok) throw new Error('Telegram API rejected the request');
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({ ok: false, message: 'Не удалось отправить заявку' });
  }
}
