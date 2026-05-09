export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName, email, phone, projectType, description } = req.body;

  // Send via Web3Forms (no API key needed for basic forwarding)
  // Or use Resend / any email API. For now, we'll forward to Web3Forms.
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        subject: `New Project Submission — ${projectType} — ${fullName}`,
        from_name: 'The Layer Studio Website',
        name: fullName,
        email: email,
        phone: phone || 'Not provided',
        project_type: projectType,
        description: description,
      }),
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true, message: 'Project submitted successfully!' });
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    console.error('Form error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please email us directly at support@thelayerstudio.dev' });
  }
}
