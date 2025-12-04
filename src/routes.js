const router = require('express').Router();
const openai = require('./providers/openai');
const hf = require('./providers/huggingface');
const googleai = require('./providers/googleai');

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.post('/chat', async (req, res) => {
  try {
    const user = req.body?.message || 'Hello';
    const content = await openai.chat([
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: user }
    ]);
    res.json({ reply: content });
  } catch (error) {
    console.error('[chat]', error);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

router.post('/sentiment', async (req, res) => {
  try {
    const text = req.body?.text || '';
    const result = await hf.sentiment(text);
    res.json({ result });
  } catch (error) {
    console.error('[sentiment]', error);
    res.status(500).json({ error: 'HuggingFace request failed' });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const prompt = req.body?.prompt || 'Share a concise creative idea.';
    const data = await googleai.generate(prompt);
    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .filter(Boolean)
        .join('\n') || '';
    res.json({ text, raw: data });
  } catch (error) {
    console.error('[generate]', error);
    res.status(500).json({ error: 'Google AI request failed' });
  }
});

module.exports = router;
