import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Add CORS headers to allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  console.log("Received request body:", req.body);

  const { email, group_id, ...fields } = req.body;

  if (!email || !group_id) {
    return res
      .status(400)
      .json({ message: 'Email and Group ID are required.' });
  }

  const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
  const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api/subscribers';

  if (!MAILERLITE_API_KEY) {
    console.error('MailerLite API Key is not configured in environment variables.');
    return res
      .status(500)
      .json({ message: 'Server configuration error.' });
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({
      email: email,
      groups: [group_id],
      fields: fields,
    }),
  };

  try {
    const response = await fetch(MAILERLITE_API_URL, options);
    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite API Error:', data);
      return res
        .status(response.status)
        .json({ message: data.message || 'An error occurred submitting to MailerLite.' });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
} 