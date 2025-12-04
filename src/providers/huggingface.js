const axios = require('axios');

exports.sentiment = async (
  text,
  model = 'finiteautomata/bertweet-base-sentiment-analysis'
) => {
  try {
    const { data } = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`
        }
      }
    );

    return data;
  } catch (err) {
    // Log detailed error for easier debugging of HF failures (401, 404, 429, etc.)
    const status = err.response?.status;
    const body = err.response?.data;
    console.error('HuggingFace error', status, body || err.message);
    throw err;
  }
};
