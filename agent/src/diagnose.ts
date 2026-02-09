import 'dotenv/config';
import { fetchRecentEmails } from './emailClient';
import { parseEmails } from './emailParser';

// Companies currently in the tracker
const TRACKED_COMPANIES = [
  'ruralis', 'idromet', 'theras', 'nettowork', 'huntr',
  'reteinformaticalavoro', 'blapp', 'loredana', 'humans.tech',
  'rextart', 'dachser', 'fercam', 'f2informatica', 'apuliasoft',
];

async function diagnose() {
  console.log('Fetching emails...\n');

  const days = parseInt(process.env.SCAN_DAYS || '30', 10);
  const rawEmails = await fetchRecentEmails(days);
  const emails = await parseEmails(rawEmails);

  console.log(`\nSearching ${emails.length} emails for updates on tracked companies...\n`);
  console.log('='.repeat(60));

  for (const company of TRACKED_COMPANIES) {
    const related = emails.filter(e => {
      const text = `${e.from} ${e.fromAddress} ${e.subject} ${e.body.slice(0, 500)}`.toLowerCase();
      return text.includes(company);
    });

    if (related.length === 0) continue;

    console.log(`\n📌 ${company.toUpperCase()} (${related.length} email):`);
    for (const e of related) {
      const dateStr = e.date.toISOString().split('T')[0];
      console.log(`  [${dateStr}] "${e.subject}"`);
      console.log(`    From: ${e.fromAddress}`);

      // Check for rejection/interview/offer keywords in body
      const bodyLower = e.body.toLowerCase().slice(0, 2000);
      const signals: string[] = [];
      if (/purtroppo|unfortunately|regret|dispiace|non proseguire|not selected|not moving/i.test(bodyLower)) signals.push('REJECTION?');
      if (/colloquio|interview|phone screen|video call|assessment/i.test(bodyLower)) signals.push('INTERVIEW?');
      if (/offer|offerta di lavoro|proposta|contratto/i.test(bodyLower)) signals.push('OFFER?');
      if (/ricevuto|received|conferma|candidatura/i.test(bodyLower)) signals.push('CONFIRMATION');

      if (signals.length) console.log(`    Signals: ${signals.join(', ')}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Done.\n');
}

diagnose().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
