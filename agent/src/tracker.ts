import {
  MatchedApplication,
  TrackerSearchResponse,
  TrackerApplication,
  SyncResult,
  SyncAction,
} from './types';

const API_URL = () => process.env.TRACKER_API_URL || 'http://localhost:3001/api/v1';

async function apiGet(path: string): Promise<any> {
  const res = await fetch(`${API_URL()}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status} ${res.statusText}`);
  return res.json();
}

async function apiPost(path: string, body: any): Promise<any> {
  const res = await fetch(`${API_URL()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status} ${res.statusText}`);
  return res.json();
}

async function apiPatch(path: string, body: any): Promise<any> {
  const res = await fetch(`${API_URL()}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PATCH ${path} failed: ${res.status} ${res.statusText}`);
  return res.json();
}

async function findExisting(company: string): Promise<TrackerApplication | null> {
  const searchResponse: TrackerSearchResponse = await apiGet(
    `/applications?search=${encodeURIComponent(company)}&limit=5`
  );

  if (!searchResponse.data.length) return null;

  // Find exact or close match
  const companyLower = company.toLowerCase();
  const exact = searchResponse.data.find(
    (app) => app.company_name.toLowerCase() === companyLower
  );
  if (exact) return exact;

  // Partial match: company name contains or is contained
  const partial = searchResponse.data.find(
    (app) =>
      app.company_name.toLowerCase().includes(companyLower) ||
      companyLower.includes(app.company_name.toLowerCase())
  );
  return partial || null;
}

// Status hierarchy: higher number = more advanced
const STATUS_ORDER: Record<string, number> = {
  Sent: 0,
  Interview: 1,
  Offer: 2,
  Rejected: 3,
};

function shouldUpdateStatus(currentStatus: string, newStatus: string): boolean {
  // Always allow transition to Rejected (can happen from any stage)
  if (newStatus === 'Rejected') return currentStatus !== 'Rejected';
  // Otherwise, only update if new status is more advanced
  return (STATUS_ORDER[newStatus] ?? 0) > (STATUS_ORDER[currentStatus] ?? 0);
}

export async function syncApplication(matched: MatchedApplication): Promise<SyncResult> {
  const existing = await findExisting(matched.company);

  let action: SyncAction;

  if (!existing) {
    // Create new application
    const dateApplied = matched.emailDate.toISOString().split('T')[0];
    await apiPost('/applications', {
      company_name: matched.company,
      position: matched.position,
      date_applied: dateApplied,
      status: matched.status,
      notes: `[Email Agent] Detected from: "${matched.emailSubject}" (${matched.emailFrom})`,
    });
    action = 'created';
  } else if (shouldUpdateStatus(existing.status, matched.status)) {
    // Update status
    await apiPatch(`/applications/${existing.id}/status`, {
      status: matched.status,
      note: `[Email Agent] "${matched.emailSubject}" from ${matched.emailFrom}`,
    });
    action = 'updated';
  } else {
    action = 'skipped';
  }

  return {
    company: matched.company,
    position: matched.position,
    action,
    status: matched.status,
    emailSubject: matched.emailSubject,
    emailFrom: matched.emailFrom,
  };
}
