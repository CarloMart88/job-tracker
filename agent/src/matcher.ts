import { ParsedEmail, MatchedApplication, ApplicationStatus } from './types';

// ── Blacklisted senders (newsletters, marketing, non-job) ──

const SENDER_BLACKLIST = [
  'newsletters-noreply@linkedin.com',
  'jobalerts-noreply@linkedin.com',
  'jobs-listings@linkedin.com',
  'noreply@github.com',
  'temu@',
  'nintendo@',
  'newsletter@ticonsiglio.com',
  'hello@huntr.co',       // Huntr marketing (not notifications)
  'no-reply@twinehq.com', // Twine job alerts (not applications)
];

// ── Blacklisted subject patterns (clearly not applications) ──

const SUBJECT_BLACKLIST = [
  /nintendo/i,
  /eShop/i,
  /wishlist/i,
  /offerta fantastica/i,
  /corso gratuito/i,
  /OAuth application/i,
  /third-party/i,
  /sta assumendo/i,       // "[Company] sta assumendo" = job alert, not application
  /is hiring/i,           // "[Company] is hiring" = job alert
  /new job opportunity/i, // Twine-style alerts
  /e altr[io] \d+ nuov[io]/i, // Indeed digest: "e altri 8 nuovi annunci"
  /nuovi annunci/i,       // Indeed digest variant
];

// ── Senders that confirm it's a real application email ──

const APPLICATION_SENDERS = [
  'jobs-noreply@linkedin.com',    // "La tua candidatura" emails
  'hit-reply@linkedin.com',       // LinkedIn message replies about applications
  // Indeed excluded: donotreply@match.indeed.com sends mostly digest/alert emails
  'noreply@infojobs.it',
  'noreply@infojobs.net',
  'noreply@monster.com',
  'noreply@welcometothejungle.com',
  'noreply@talent.io',
  'noreply@hired.com',
  'noreply@wellfound.com',
];

// ── Subject patterns that indicate a real application ──

const APPLICATION_SUBJECT_PATTERNS = [
  /la tua candidatura/i,
  /la sua candidatura/i,
  /your application/i,
  /conferma ricezione candidatura/i,
  /candidatura.*è stata/i,
  /avanzamento candidatura/i,
  /application.*received/i,
  /application.*update/i,
  /application.*status/i,
  /candidatura carlo martino/i,
  /colloquio carlo martino/i,
  /ti sei.*candidat[oa]/i,
  /hai inviato.*candidatura/i,
  /your resume review/i,
];

// ── Body patterns that confirm application context ──

const APPLICATION_BODY_PATTERNS = [
  'la tua candidatura',
  'la sua candidatura',
  'your application',
  'thank you for applying',
  'we have received your',
  'candidatura ricevuta',
  'abbiamo ricevuto il tuo',
  'conferma ricezione',
  'avanzamento candidatura',
  'colloquio fissato',
  'interview scheduled',
  'we are pleased to inform',
  'ci dispiace comunicarti',
  'we regret to inform',
  'hai inviato una candidatura',
  'ti sei candidat',
];

// ── Status classification patterns ──

const REJECTION_PATTERNS = [
  'unfortunately we', 'we regret to inform', 'not moving forward',
  'not been selected', 'decided not to proceed', 'other candidates',
  'will not be proceeding', 'position has been filled',
  'ci dispiace comunicarti', 'ci dispiace informarti',
  'purtroppo non', 'non proseguire con la tua',
  'non è stato selezionat',
];

const INTERVIEW_PATTERNS = [
  'interview invitation', 'interview scheduled', 'colloquio fissato',
  'colloquio carlo', 'phone screen', 'video call scheduled',
  'schedule a call with', 'assessment invitation', 'coding challenge',
  'technical test invitation', 'test tecnico',
  'vorremmo conoscerti', 'would like to meet',
  'invito a colloquio', 'convocazione colloquio',
];

const OFFER_PATTERNS = [
  'we are pleased to offer you', 'offer letter',
  'offer of employment', 'we would like to offer you',
  'formal offer', 'siamo lieti di offrirti',
  'proposta di assunzione',
];

// ── Main matching function ──

export function matchJobEmails(emails: ParsedEmail[]): MatchedApplication[] {
  const results: MatchedApplication[] = [];

  for (const email of emails) {
    // Skip blacklisted senders
    if (isBlacklistedSender(email.fromAddress)) continue;
    if (isBlacklistedSubject(email.subject)) continue;

    // Check if it's a real application email
    if (!isApplicationEmail(email)) continue;

    const status = classifyStatus(email);
    const company = extractCompany(email);
    const position = extractPosition(email);

    if (!company) continue;

    results.push({
      company,
      position: position || 'Unknown Position',
      status,
      emailSubject: email.subject,
      emailFrom: email.fromAddress,
      emailDate: email.date,
    });
  }

  return deduplicateByCompany(results);
}

function isBlacklistedSender(address: string): boolean {
  return SENDER_BLACKLIST.some(b => address.includes(b));
}

function isBlacklistedSubject(subject: string): boolean {
  return SUBJECT_BLACKLIST.some(p => p.test(subject));
}

function isApplicationEmail(email: ParsedEmail): boolean {
  const fromLower = email.fromAddress.toLowerCase();
  const subjectLower = email.subject.toLowerCase();
  const bodyLower = email.body.toLowerCase().slice(0, 3000);

  // Check if from a known application sender
  if (APPLICATION_SENDERS.some(s => fromLower.includes(s))) {
    // Even from known senders, subject must contain application-related content
    if (APPLICATION_SUBJECT_PATTERNS.some(p => p.test(email.subject))) return true;
    // Or body must clearly mention applications
    if (APPLICATION_BODY_PATTERNS.some(kw => bodyLower.includes(kw))) return true;
    return false;
  }

  // Check subject patterns (strong signal)
  if (APPLICATION_SUBJECT_PATTERNS.some(p => p.test(email.subject))) return true;

  // Check body patterns from non-platform senders (need at least 2 matches)
  const bodyMatches = APPLICATION_BODY_PATTERNS.filter(kw => bodyLower.includes(kw)).length;
  if (bodyMatches >= 2) return true;

  // Direct recruiter emails: from a company domain + subject mentions candidatura/application
  const isCompanyEmail = !fromLower.includes('linkedin.com') &&
    !fromLower.includes('indeed.com') &&
    !fromLower.includes('gmail.com') &&
    !fromLower.includes('yahoo.') &&
    !fromLower.includes('hotmail.') &&
    !fromLower.includes('outlook.');

  if (isCompanyEmail) {
    const hasJobSubject = /candidatura|candidat[oa]|application|colloquio|interview/i.test(subjectLower);
    if (hasJobSubject) return true;
  }

  return false;
}

function classifyStatus(email: ParsedEmail): ApplicationStatus {
  const text = `${email.subject} ${email.body.slice(0, 3000)}`.toLowerCase();

  // Check in order of specificity: Offer > Rejected > Interview > Sent
  if (OFFER_PATTERNS.some(p => text.includes(p))) return 'Offer';
  if (REJECTION_PATTERNS.some(p => text.includes(p))) return 'Rejected';
  if (INTERVIEW_PATTERNS.some(p => text.includes(p))) return 'Interview';

  // Default: application confirmation
  return 'Sent';
}

// ── Company extraction ──

function extractCompany(email: ParsedEmail): string | null {
  const subject = email.subject;
  const from = email.from;
  const fromAddress = email.fromAddress;

  // LinkedIn "La tua candidatura: [Position] presso [Company]"
  const linkedinPresso = subject.match(/presso\s+(.+?)(?:\s*\|.*)?$/i);
  if (linkedinPresso?.[1]) {
    return cleanCompanyName(linkedinPresso[1]);
  }

  // LinkedIn "La tua candidatura è stata visualizzata da [Company]"
  const linkedinVisualizzata = subject.match(/visualizzata da\s+(.+)$/i);
  if (linkedinVisualizzata?.[1]) {
    return cleanCompanyName(linkedinVisualizzata[1]);
  }

  // "Candidatura [Name] - [Company]"
  const candidaturaName = subject.match(/candidatura\s+carlo\s+martino\s*[-–]\s*(.+)/i);
  if (candidaturaName?.[1]) {
    return cleanCompanyName(candidaturaName[1]);
  }

  // "Colloquio Carlo Martino" - company from sender
  if (/colloquio carlo martino/i.test(subject)) {
    return extractCompanyFromSender(from, fromAddress);
  }

  // "Conferma ricezione candidatura: [Position]" - company from sender
  if (/conferma ricezione candidatura/i.test(subject)) {
    return extractCompanyFromSender(from, fromAddress);
  }

  // Indeed: "[Position] presso [Company]"
  const indeedPresso = subject.match(/presso\s+(.+?)(?:\s*$)/i);
  if (indeedPresso?.[1]) {
    return cleanCompanyName(indeedPresso[1]);
  }

  // "La sua candidatura - [Company]"
  const suaCandidatura = subject.match(/la sua candidatura\s*[-–]\s*(.+)/i);
  if (suaCandidatura?.[1]) {
    return cleanCompanyName(suaCandidatura[1]);
  }

  // "Avanzamento candidatura – [Position] | [Company]"
  const avanzamento = subject.match(/\|\s*(.+?)$/);
  if (avanzamento?.[1]) {
    return cleanCompanyName(avanzamento[1]);
  }

  // "Your application at [Company]" / "application update - [Company]"
  const atCompany = subject.match(/(?:at|@|from|with)\s+([A-Z][A-Za-z0-9\s&.'-]+?)(?:\s*[-–|]|$)/i);
  if (atCompany?.[1]) {
    const c = cleanCompanyName(atCompany[1]);
    if (c.length > 1 && c.length < 50) return c;
  }

  // Fallback: extract from sender
  return extractCompanyFromSender(from, fromAddress);
}

function extractCompanyFromSender(from: string, fromAddress: string): string | null {
  // Skip platform senders for domain extraction
  if (isKnownPlatformDomain(fromAddress)) return null;

  // Try sender display name
  if (from) {
    const cleaned = from
      .replace(/\b(careers|recruiting|hiring|talent|hr|jobs|noreply|no-reply|team|candidati|placement)\b/gi, '')
      .replace(/[<>"']/g, '')
      .trim();
    if (cleaned && cleaned.length > 1 && cleaned.length < 50) {
      return cleanCompanyName(cleaned);
    }
  }

  // Try domain
  const domainMatch = fromAddress.match(/@([^.]+)\./);
  if (domainMatch?.[1]) {
    const domain = domainMatch[1];
    const genericDomains = ['gmail', 'yahoo', 'hotmail', 'outlook', 'mail', 'noreply', 'donotreply'];
    if (!genericDomains.includes(domain) && domain.length > 2) {
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
  }

  return null;
}

function isKnownPlatformDomain(address: string): boolean {
  const platforms = ['linkedin.com', 'indeed.com', 'glassdoor.com', 'github.com'];
  return platforms.some(p => address.includes(p));
}

// ── Position extraction ──

function extractPosition(email: ParsedEmail): string | null {
  const subject = email.subject;

  // LinkedIn "La tua candidatura: [Position] presso [Company]"
  const linkedinPosition = subject.match(/candidatura:\s*(.+?)\s+presso\s/i);
  if (linkedinPosition?.[1]) return cleanPosition(linkedinPosition[1]);

  // "Avanzamento candidatura – [Position] | Company"
  const avanzamento = subject.match(/candidatura\s*[-–]\s*(.+?)\s*\|/i);
  if (avanzamento?.[1]) return cleanPosition(avanzamento[1]);

  // Indeed: "[Position] presso [Company]"
  const indeedPosition = subject.match(/^(.+?)\s+presso\s/i);
  if (indeedPosition?.[1]) {
    const pos = indeedPosition[1].replace(/^(application support\s*[-–]\s*)/i, '');
    return cleanPosition(pos);
  }

  // "Conferma ricezione candidatura: [Position]"
  const conferma = subject.match(/conferma ricezione candidatura:\s*(.+)/i);
  if (conferma?.[1]) return cleanPosition(conferma[1]);

  // "candidato ad una offerta per [Position]"
  const offertaPer = subject.match(/offerta per\s+(.+?)(?:\s*\(|$)/i);
  if (offertaPer?.[1]) return cleanPosition(offertaPer[1]);

  // Generic tech position pattern in subject or first part of body
  const text = `${subject} ${email.body.slice(0, 1000)}`;
  const techRole = text.match(
    /((?:Senior|Junior|Mid[- ]?Level|Lead|Staff|Principal)\s+)?(?:Frontend|Backend|Full[- ]?Stack|Software|Web|Mobile|DevOps|Data|ML|AI|QA|Cloud|UI\/UX)\s+(?:Developer|Engineer|Designer|Analyst)/i
  );
  if (techRole?.[0]) return cleanPosition(techRole[0]);

  return null;
}

function cleanPosition(pos: string): string {
  return pos.replace(/[<>"']/g, '').replace(/\s+/g, ' ').trim();
}

// ── Deduplication ──

function cleanCompanyName(name: string): string {
  return name
    .replace(/[<>"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function deduplicateByCompany(applications: MatchedApplication[]): MatchedApplication[] {
  const byCompany = new Map<string, MatchedApplication>();

  const sorted = [...applications].sort((a, b) => a.emailDate.getTime() - b.emailDate.getTime());

  for (const app of sorted) {
    const key = app.company.toLowerCase();
    const existing = byCompany.get(key);

    if (!existing) {
      byCompany.set(key, app);
    } else {
      const statusPriority: Record<ApplicationStatus, number> = {
        Sent: 0,
        Interview: 1,
        Offer: 2,
        Rejected: 3,
      };
      if (statusPriority[app.status] >= statusPriority[existing.status]) {
        byCompany.set(key, app);
      }
    }
  }

  return Array.from(byCompany.values());
}
