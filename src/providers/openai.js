const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

exports.chat = async (messages, model = 'gpt-4o-mini') => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({ model, messages, temperature: 0.2 })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI error ${response.status}: ${text}`);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content || JSON.stringify(json);
};
