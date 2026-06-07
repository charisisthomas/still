import { Resend } from 'resend';

export const prerender = false;

export async function POST(context) {
  const { request, locals } = context;
  try {
    const data = await request.json();
    const { name, email, weddingDate, date, location, guests, services, message } = data;

    // Simple validation
    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required fields.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Cloudflare Workers environment variables are bound to context.locals.runtime.env
    const cfEnv = locals.runtime?.env || {};

    // Initialize Resend
    const resendApiKey = cfEnv.RESEND_API_KEY || import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is not configured.');
      return new Response(JSON.stringify({ error: 'Mail server configuration is missing.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const resend = new Resend(resendApiKey);

    const toEmail = cfEnv.RESEND_TO_EMAIL || import.meta.env.RESEND_TO_EMAIL || process.env.RESEND_TO_EMAIL || 'hello@still.com';
    const fromEmail = cfEnv.RESEND_FROM_EMAIL || import.meta.env.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    // Compile email template
    const servicesList = Array.isArray(services) ? services.join(', ') : (services || 'None selected');
    
    // Support either weddingDate or date field names
    const finalDate = weddingDate || date || 'Not specified';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Inquiry | Still Studio</title>
        <style>
          body {
            font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #faf9f6;
            color: #303330;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid rgba(176, 179, 174, 0.3);
            border-radius: 2px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(48, 51, 48, 0.02);
          }
          .header {
            text-align: center;
            border-bottom: 1px solid rgba(233, 204, 139, 0.5);
            padding-bottom: 30px;
            margin-bottom: 30px;
          }
          .logo {
            font-family: Georgia, serif;
            font-size: 24px;
            font-weight: bold;
            color: #725c27;
            letter-spacing: 0.15em;
            text-transform: uppercase;
          }
          .subtitle {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: #5f5f5f;
            margin-top: 5px;
          }
          h2 {
            font-family: Georgia, serif;
            font-size: 20px;
            color: #725c27;
            margin-top: 0;
            margin-bottom: 24px;
            font-weight: normal;
            font-style: italic;
          }
          .field {
            margin-bottom: 24px;
          }
          .label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #5f5f5f;
            font-weight: bold;
            margin-bottom: 6px;
          }
          .value {
            font-size: 15px;
            line-height: 1.6;
            color: #303330;
          }
          .message-box {
            background-color: #f4f4f0;
            border-left: 2px solid #725c27;
            padding: 16px 20px;
            margin-top: 8px;
            font-style: italic;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid rgba(176, 179, 174, 0.2);
            font-size: 11px;
            color: #5f5f5f;
            letter-spacing: 0.05em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Still Studio</div>
            <div class="subtitle">Bespoke Digital Wedding Commissions</div>
          </div>
          
          <h2>New Event Commission Inquiry</h2>
          
          <div class="field">
            <div class="label">Client Name</div>
            <div class="value">${name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${email}" style="color: #725c27; text-decoration: underline;">${email}</a></div>
          </div>
          
          <div class="field">
            <div class="label">Target Date</div>
            <div class="value">${finalDate}</div>
          </div>
          
          <div class="field">
            <div class="label">Event Location & Venues</div>
            <div class="value">${location || 'Not specified'}</div>
          </div>
          
          <div class="field">
            <div class="label">Estimated Guest Count</div>
            <div class="value">${guests || 'Not specified'}</div>
          </div>
          
          ${servicesList !== 'None selected' ? `
          <div class="field">
            <div class="label">Services of Interest</div>
            <div class="value">${servicesList}</div>
          </div>
          ` : ''}
          
          ${message ? `
          <div class="field">
            <div class="label">Vision & Technical Requirements</div>
            <div class="value message-box">${message.replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}
          
          <div class="footer">
            Sent automatically from the Still Studio website.<br>
            All rights reserved &copy; 2026.
          </div>
        </div>
      </body>
      </html>
    `;

    // Call Resend API
    const response = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `New Inquiry: ${name} — ${location || 'Wedding'}`,
      html: htmlContent,
      replyTo: email
    });

    if (response.error) {
      console.error('Resend error:', response.error);
      return new Response(JSON.stringify({ error: response.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, id: response.data?.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact endpoint error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
