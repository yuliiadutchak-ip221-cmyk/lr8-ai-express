const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

exports.generate = async (prompt, model = 'gemini-1.5-flash-latest') => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google AI error ${response.status}: ${text}`);
  }

  const json = await response.json();
  return json;
};
