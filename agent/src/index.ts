import 'dotenv/config';
import { fetchRecentEmails } from './emailClient';
import { parseEmails } from './emailParser';
import { matchJobEmails } from './matcher';
import { syncApplication } from './tracker';
import { SyncResult } from './types';

async function main() {
  console.log('\n📬 Email Agent - Job Tracker');
  console.log('─'.repeat(40));

  // Validate env
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env');
    process.exit(1);
  }

  const days = parseInt(process.env.SCAN_DAYS || '7', 10);
  console.log(`Connecting to Gmail (${process.env.GMAIL_USER})...`);

  // 1. Fetch raw emails
  const rawEmails = await fetchRecentEmails(days);
  if (!rawEmails.length) {
    console.log('\nNo emails to process. Done.');
    return;
  }

  // 2. Parse emails
  console.log('Parsing emails...');
  const parsedEmails = await parseEmails(rawEmails);

  // 3. Match job-related emails
  const matched = matchJobEmails(parsedEmails);

  if (!matched.length) {
    console.log('\n✓ No job-related emails found in the last', days, 'days.');
    return;
  }

  console.log(`\nFound ${matched.length} job-related email(s):\n`);

  // 4. Sync with Job Tracker
  const results: SyncResult[] = [];

  for (const app of matched) {
    try {
      const result = await syncApplication(app);
      results.push(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ⚠ Error syncing ${app.company}: ${message}`);
      results.push({
        company: app.company,
        position: app.position,
        action: 'skipped',
        status: app.status,
        emailSubject: app.emailSubject,
        emailFrom: app.emailFrom,
      });
    }
  }

  // 5. Print results
  results.forEach((r, i) => {
    const tag = r.action === 'created' ? 'NEW'
      : r.action === 'updated' ? 'UPDATED'
      : 'SKIPPED';
    console.log(`  ${i + 1}. [${tag}] ${r.company} - ${r.position}`);
    console.log(`     Status: ${r.status}`);
    console.log(`     Source: "${r.emailSubject}" from ${r.emailFrom}`);
    console.log();
  });

  // 6. Summary
  const created = results.filter(r => r.action === 'created').length;
  const updated = results.filter(r => r.action === 'updated').length;
  const skipped = results.filter(r => r.action === 'skipped').length;

  console.log('─'.repeat(40));
  console.log(`Summary: ${created} new, ${updated} updated, ${skipped} skipped`);
  console.log();
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err.message || err);
  process.exit(1);
});
