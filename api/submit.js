import { Resend } from 'resend';

export const config = {
  api: { bodyParser: { sizeLimit: '25mb' } },
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      client_type, name, email, phone,
      company, project_type, services_needed, project_address, timeline,
      brokerage, has_measurements,
      project_goal, has_sketches, budget,
      attachments = [],
    } = req.body;

    // ── Build type-specific detail rows ──
    let detailRows = '';
    if (client_type === 'contractor') {
      detailRows = `
        <tr><td><b>Company:</b></td><td>${company || '—'}</td></tr>
        <tr><td><b>Project Type:</b></td><td>${project_type || '—'}</td></tr>
        <tr><td><b>Services Needed:</b></td><td>${services_needed || '—'}</td></tr>
        <tr><td><b>Project Address:</b></td><td>${project_address || '—'}</td></tr>
        <tr><td><b>Timeline:</b></td><td>${timeline || '—'}</td></tr>`;
    } else if (client_type === 'realest') {
      detailRows = `
        <tr><td><b>Brokerage:</b></td><td>${brokerage || '—'}</td></tr>
        <tr><td><b>Services Needed:</b></td><td>${services_needed || '—'}</td></tr>
        <tr><td><b>Has Measurements:</b></td><td>${has_measurements || '—'}</td></tr>`;
    } else if (client_type === 'homeowner') {
      detailRows = `
        <tr><td><b>Project Goal:</b></td><td>${project_goal || '—'}</td></tr>
        <tr><td><b>Has Sketches/Measurements:</b></td><td>${has_sketches || '—'}</td></tr>
        <tr><td><b>Budget:</b></td><td>${budget || '—'}</td></tr>`;
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
        <div style="background:#111;padding:28px 32px;">
          <p style="color:#c9a84c;font-size:13px;letter-spacing:3px;margin:0 0 6px;text-transform:uppercase;">TLS Studio</p>
          <h1 style="color:#fff;margin:0;font-size:22px;">New Project Submission</h1>
        </div>
        <div style="padding:28px 32px;background:#fafafa;">
          <h3 style="color:#111;margin:0 0 12px;border-bottom:1px solid #eee;padding-bottom:8px;">Contact Info</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 0;width:160px;color:#555"><b>Name</b></td><td>${name}</td></tr>
            <tr><td style="padding:6px 0;color:#555"><b>Email</b></td><td><a href="mailto:${email}" style="color:#c9a84c">${email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#555"><b>Phone</b></td><td>${phone || 'Not provided'}</td></tr>
            <tr><td style="padding:6px 0;color:#555"><b>Client Type</b></td><td style="text-transform:capitalize">${client_type}</td></tr>
          </table>
          <h3 style="color:#111;margin:20px 0 12px;border-bottom:1px solid #eee;padding-bottom:8px;">Project Details</h3>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            ${detailRows}
          </table>
          ${attachments.length > 0 ? `<p style="margin-top:16px;font-size:13px;color:#555;">📎 <b>${attachments.length} file(s) attached</b> to this email.</p>` : ''}
        </div>
        <div style="background:#111;padding:16px 32px;text-align:center;">
          <p style="color:#666;margin:0;font-size:11px;letter-spacing:1px;">© TLS STUDIO — thelayerstudio.net</p>
        </div>
      </div>`;

    // ── Convert base64 files to Resend attachment format ──
    const resendAttachments = attachments.map(file => ({
      filename: file.name,
      content: Buffer.from(file.data, 'base64'),
    }));

    const { error } = await resend.emails.send({
      from: 'TLS Studio <onboarding@resend.dev>',
      to: ['support@thelayerstudio.dev'],
      reply_to: email,
      subject: `🏗️ New Project — ${String(client_type).charAt(0).toUpperCase() + String(client_type).slice(1)} — ${name}`,
      html,
      attachments: resendAttachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
