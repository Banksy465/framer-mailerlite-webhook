import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_GROUP_ID;

  const response = await fetch(`https://api.mailerlite.com/api/v2/groups/${GROUP_ID}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-MailerLite-ApiKey': API_KEY,
    },
    body: JSON.stringify({ email, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    return res.status(500).json({ error: error.error.message || 'MailerLite error' });
  }

  const data = await response.json();
  return res.status(200).json({ success: true, data });
} 