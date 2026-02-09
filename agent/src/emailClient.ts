import { ImapFlow } from 'imapflow';
import { RawEmail } from './types';

export async function fetchRecentEmails(days: number): Promise<RawEmail[]> {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER!,
      pass: process.env.GMAIL_APP_PASSWORD!,
    },
    logger: false,
  });

  const emails: RawEmail[] = [];

  try {
    await client.connect();
    console.log('✓ Connected to Gmail.');

    const lock = await client.getMailboxLock('INBOX');

    try {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const sinceStr = since.toISOString().split('T')[0]; // YYYY-MM-DD

      // Search for emails since the given date
      const searchResult = await client.search({ since: new Date(sinceStr) }, { uid: true });
      const uids = Array.isArray(searchResult) ? searchResult : [];

      if (!uids.length) {
        console.log(`✓ No emails found in the last ${days} days.`);
        return emails;
      }

      console.log(`✓ Found ${uids.length} emails. Scanning for job applications...`);

      // Fetch email sources (third param { uid: true } = use UID FETCH)
      const uidRange = uids.join(',');
      for await (const message of client.fetch(uidRange, { source: true, uid: true }, { uid: true })) {
        if (message.source) {
          emails.push({
            uid: message.uid,
            source: message.source,
          });
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }

  return emails;
}
