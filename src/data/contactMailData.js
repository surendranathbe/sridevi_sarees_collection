import logoImg from '../assets/logo_2.png';

export const OWNER_EMAIL = 'sridevicollections1644@gmail.com';
export const STORE_PHONE = '+91 9849837338';
export const STORE_LOCATION = 'Near Sai Baba Temple, Kovur Road, Kandukur - 523105, Andhra Pradesh';

/**
 * Generates an aligned ASCII / Unicode text table for email bodies (compatible with all email clients).
 */
export const generateTextEmailTable = (formData) => {
  const dateStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  const divider = '══════════════════════════════════════════════════════════════════════';
  const subDivider = '──────────────────────────────────────────────────────────────────────';

  return `
✦${divider}✦
            SRIDEVI SAREES & COLLECTIONS (శ్రీదేవి కలెక్షన్స్)
                   NEW CUSTOMER SHOWROOM INQUIRY
✦${divider}✦

${subDivider}
  FIELD                     │  CUSTOMER DETAILS
${subDivider}
  Customer Full Name        │  ${formData.name || 'Not Provided'}
  Phone / WhatsApp Number   │  ${formData.phone || 'Not Provided'}
  Interested Collection     │  ${formData.service || 'Pure Silk Sarees'}
  Special Design / Request  │  ${formData.message ? formData.message.replace(/\n/g, ' ') : 'General showroom inquiry & price quote'}
  Submission Timestamp      │  ${dateStr}
  Store Destination         │  Near Sai Baba Temple, Kovur Road, Kandukur - 523105, AP
${subDivider}

✦ STORE DETAILS & DIRECT ASSISTANCE:
• Showroom Mobile: +91 98498 37338
• Official Email : sridevicollections1644@gmail.com
• Authenticity   : 100% Silk Mark Certified • Computer Work Blouses
• Location       : Near Sai Baba Temple, Kovur Road, Kandukur, AP

✦${divider}✦
`.trim();
};

/**
 * Generates an HTML Table Email template for the store owner with the logo and clean styling.
 */
export const generateHtmlEmailTable = (formData) => {
  const dateStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  return `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #faf5eb; padding: 24px; color: #2b0c1e; max-width: 640px; margin: 0 auto; border-radius: 12px; border: 1.5px solid #d4af37;">
  <!-- Header with Brand Logo & Title -->
  <div style="background: linear-gradient(135deg, #4a101d 0%, #20050e 100%); padding: 22px; text-align: center; border-radius: 8px 8px 0 0; color: #ffffff;">
    <img src="${logoImg}" alt="Sridevi Sarees Collections" style="max-width: 140px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;" />
    <h2 style="margin: 0; font-size: 20px; font-family: Georgia, serif; color: #dfb76c; letter-spacing: 0.05em;">SRIDEVI SAREES &amp; COLLECTIONS</h2>
    <p style="margin: 4px 0 0; font-size: 13px; color: #f7eee2;">✦ శ్రీదేవి కలెక్షన్స్ • Customer Showroom Inquiry ✦</p>
  </div>

  <!-- Inquiry Table -->
  <div style="padding: 24px 20px; background: #ffffff;">
    <h3 style="font-size: 15px; font-weight: bold; color: #722234; margin: 0 0 14px; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #dfb76c; padding-bottom: 6px;">
      Customer Inquiry Details (విచారణ వివరాలు)
    </h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <tbody>
        <tr style="border-bottom: 1px solid #ebdcc5;">
          <th style="background-color: #faf3e6; color: #501321; font-weight: 700; width: 38%; padding: 10px 12px; text-align: left; font-size: 13px;">Customer Name</th>
          <td style="padding: 10px 12px; font-size: 14px; color: #222222; font-weight: 600;">${formData.name || 'Not Provided'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ebdcc5;">
          <th style="background-color: #faf3e6; color: #501321; font-weight: 700; padding: 10px 12px; text-align: left; font-size: 13px;">Phone / WhatsApp</th>
          <td style="padding: 10px 12px; font-size: 14px; color: #722234; font-weight: bold;">${formData.phone || 'Not Provided'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ebdcc5;">
          <th style="background-color: #faf3e6; color: #501321; font-weight: 700; padding: 10px 12px; text-align: left; font-size: 13px;">Interested Collection</th>
          <td style="padding: 10px 12px; font-size: 14px; color: #222222;">${formData.service || 'Pure Silk Sarees'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ebdcc5;">
          <th style="background-color: #faf3e6; color: #501321; font-weight: 700; padding: 10px 12px; text-align: left; font-size: 13px;">Design Request / Notes</th>
          <td style="padding: 10px 12px; font-size: 13px; color: #444444; line-height: 1.5;">${formData.message ? formData.message.replace(/\n/g, '<br/>') : 'General Inquiry regarding saree availability and prices.'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ebdcc5;">
          <th style="background-color: #faf3e6; color: #501321; font-weight: 700; padding: 10px 12px; text-align: left; font-size: 13px;">Submission Timestamp</th>
          <td style="padding: 10px 12px; font-size: 13px; color: #666666;">${dateStr}</td>
        </tr>
        <tr>
          <th style="background-color: #faf3e6; color: #501321; font-weight: 700; padding: 10px 12px; text-align: left; font-size: 13px;">Store Destination</th>
          <td style="padding: 10px 12px; font-size: 13px; color: #444444;">Near Sai Baba Temple, Kovur Road, Kandukur - 523105, AP</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Footer -->
  <div style="background: #faf5eb; padding: 14px; text-align: center; font-size: 12px; color: #665b53; border-top: 1px solid #ebdcc5; border-radius: 0 0 8px 8px;">
    <p style="margin: 0 0 4px; font-weight: 600; color: #722234;">Sridevi Sarees &amp; Collections • 100% Silk Mark Certified Weaves</p>
    <p style="margin: 0;">Phone: +91 98498 37338 • Email: sridevicollections1644@gmail.com</p>
  </div>
</div>
`.trim();
};

// Activated FormSubmit token from owner confirmation email
export const FORMSUBMIT_TOKEN = '86899a1b99b8741f04146a4b82e72b88';

/**
 * Handles generating email URLs and triggers sending to sridevicollections1644@gmail.com
 * Formats the customer details in a clean table format with store logo for the owner.
 */
export const dispatchCustomerInquiry = async (formData) => {
  const dateStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  const subjectText = `[Showroom Inquiry] ${formData.name || 'Customer'} - ${formData.service || 'Silk Sarees'} | Sridevi Sarees`;
  const subjectEncoded = encodeURIComponent(subjectText);
  const textTable = generateTextEmailTable(formData);
  const bodyEncoded = encodeURIComponent(textTable);

  // Mailto link for native mail clients with table body
  const mailtoUrl = `mailto:${OWNER_EMAIL}?subject=${subjectEncoded}&body=${bodyEncoded}`;

  // Direct Web Gmail compose URL with table body
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${OWNER_EMAIL}&su=${subjectEncoded}&body=${bodyEncoded}`;

  // Direct backend delivery to sridevicollections1644@gmail.com with table template & logo attachment
  try {
    const payload = new FormData();
    payload.append('✦ STORE BRAND & LOGO ✦', 'SRIDEVI SAREES & COLLECTIONS (శ్రీదేవి కలెక్షన్స్)');
    payload.append('Customer Full Name', formData.name || 'Not Provided');
    payload.append('Phone / WhatsApp Number', formData.phone || 'Not Provided');
    payload.append('Interested Collection', formData.service || 'Pure Silk Sarees');
    payload.append('Design / Custom Request', formData.message || 'General showroom inquiry & price quote');
    payload.append('Submission Timestamp', dateStr);
    payload.append('Store Destination', 'Near Sai Baba Temple, Kovur Road, Kandukur - 523105, AP');
    payload.append('_subject', subjectText);
    payload.append('_template', 'table');
    payload.append('_captcha', 'false');

    // Attach Sridevi Sarees logo image so it displays directly in the email
    try {
      const logoRes = await fetch(logoImg);
      const logoBlob = await logoRes.blob();
      payload.append('attachment', logoBlob, 'sridevi_sarees_logo.png');
    } catch (attachErr) {
      console.log('Logo attach error:', attachErr);
    }

    // Send to activated token endpoint (with fallback to owner email)
    const targetEndpoint = FORMSUBMIT_TOKEN
      ? `https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN}`
      : `https://formsubmit.co/ajax/${OWNER_EMAIL}`;

    await fetch(targetEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: payload
    });
  } catch (err) {
    console.log('Background mail submission to owner:', err);
  }

  return {
    ownerEmail: OWNER_EMAIL,
    subject: subjectText,
    textTable,
    htmlTable: generateHtmlEmailTable(formData),
    mailtoUrl,
    gmailUrl
  };
};

/**
 * Formats a clean, one-by-one structured message for WhatsApp with bold headers, emojis, and line breaks.
 */
export const generateWhatsAppMessage = (formData) => {
  const name = formData?.name?.trim() || 'Showroom Visitor';
  const phone = formData?.phone?.trim() || 'Not Provided';
  const service = formData?.service || 'Pure Silk Sarees';
  const message = formData?.message?.trim() || 'Inquiring regarding latest saree collections, pricing, and availability.';

  return [
    '✨ *SRIDEVI SAREES & COLLECTIONS* ✨',
    '       _(శ్రీదేవి కలెక్షన్స్ • Kandukur)_',
    '━━━━━━━━━━━━━━━━━━━━━',
    '📋 *NEW CUSTOMER INQUIRY*',
    '━━━━━━━━━━━━━━━━━━━━━',
    `👤 *Customer Name:* ${name}`,
    `📞 *Phone Number:* ${phone}`,
    `🥻 *Interested In:* ${service}`,
    `💬 *Design Request / Notes:*`,
    `   _${message}_`,
    '━━━━━━━━━━━━━━━━━━━━━',
    '📍 *Showroom Location:*',
    'Near Sai Baba Temple, Kovur Road, Kandukur - 523105, AP',
    '📞 *Direct Helpline:* +91 98498 37338',
    '━━━━━━━━━━━━━━━━━━━━━',
    '_Sent via Sridevi Sarees Online Portal_'
  ].join('\n');
};

/**
 * General showroom greeting for the direct WhatsApp card.
 */
export const generateGeneralWhatsAppMessage = () => {
  return [
    '✨ *SRIDEVI SAREES & COLLECTIONS* ✨',
    '       _(శ్రీదేవి కలెక్షన్స్ • Kandukur)_',
    '━━━━━━━━━━━━━━━━━━━━━',
    'Namaste! 🙏',
    'I would like to inquire about:',
    '• Authentic Pure Silk & Kanchipuram Pattu',
    '• Royal Dola Silk Sarees',
    '• Computer Work Blouse Embroidery & Stitching',
    '• Showroom timings & latest festive arrivals',
    '━━━━━━━━━━━━━━━━━━━━━',
    'Kindly share your latest catalogue and price details.'
  ].join('\n');
};
