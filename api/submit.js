export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { fullName, email, phone, projectType, description, package: pkg } = req.body;

  try {
    const response = await fetch('https://formsubmit.co/ajax/support@thelayerstudio.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: fullName,
        email,
        phone: phone || 'Not provided',
        projectType,
        description,
        package: pkg || 'Not selected',
        _subject: '🏗️ New Project Submission — The Layer Studio',
        _captcha: 'false',
        _template: 'table',
        _autoresponse: 'Thank you for choosing The Layer Studio! If you selected a Standard or Pro package, this email serves as your formal deposit invoice (Standard: $325 CAD | Pro: $425 CAD). If you selected Custom Quote, our team will review your project and send you a custom invoice shortly. Please send your deposit via Interac e-Transfer to payment@thelayerstudio.dev. Once your transfer is received, our drafting team will begin immediately!',
      }),
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    console.error('Form error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
