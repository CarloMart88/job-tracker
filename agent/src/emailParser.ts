import { simpleParser } from 'mailparser';
import { RawEmail, ParsedEmail } from './types';

export async function parseEmails(rawEmails: RawEmail[]): Promise<ParsedEmail[]> {
  const parsed: ParsedEmail[] = [];

  for (const raw of rawEmails) {
    try {
      const mail = await simpleParser(raw.source);

      const fromAddr = mail.from?.value?.[0];
      const from = fromAddr?.name || fromAddr?.address || 'Unknown';
      const fromAddress = fromAddr?.address || '';
      const subject = mail.subject || '(no subject)';
      const body = mail.text || stripHtml(mail.html || '') || '';
      const date = mail.date || new Date();

      parsed.push({
        uid: raw.uid,
        from,
        fromAddress: fromAddress.toLowerCase(),
        subject,
        body,
        date,
      });
    } catch {
      // Skip emails that can't be parsed
    }
  }

  return parsed;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}
