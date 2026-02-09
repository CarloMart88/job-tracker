USE job_tracker;

INSERT INTO applications (company_name, position, url, status, salary_min, salary_max, notes, date_applied) VALUES
('Google', 'Frontend Developer', 'https://careers.google.com/jobs/123', 'Interview', 45000, 60000, 'Applied through LinkedIn. Got a response within 3 days.', '2026-01-15'),
('Microsoft', 'Full Stack Developer', 'https://careers.microsoft.com/jobs/456', 'Sent', 50000, 70000, 'Applied on company website.', '2026-01-20'),
('Amazon', 'React Developer', 'https://amazon.jobs/789', 'Rejected', 40000, 55000, 'Received rejection after technical screening.', '2026-01-10'),
('Spotify', 'Web Developer', 'https://spotify.com/careers/101', 'Offer', 48000, 62000, 'Great culture fit. Offer received!', '2025-12-28'),
('Netflix', 'Senior Frontend Developer', 'https://netflix.com/jobs/202', 'Sent', 60000, 80000, NULL, '2026-02-01'),
('Meta', 'Software Engineer', 'https://meta.com/careers/303', 'Interview', 55000, 75000, 'Phone screen completed. Awaiting next round.', '2026-01-25'),
('Apple', 'iOS/Web Developer', 'https://apple.com/jobs/404', 'Sent', 52000, 68000, 'Applied via referral from ex-colleague.', '2026-02-05'),
('Stripe', 'Full Stack Engineer', 'https://stripe.com/jobs/505', 'Rejected', 50000, 70000, 'Position filled internally.', '2025-12-15'),
('Vercel', 'Frontend Engineer', 'https://vercel.com/careers/606', 'Sent', 45000, 60000, 'Exciting Next.js opportunity.', '2026-02-08'),
('Shopify', 'React Developer', 'https://shopify.com/careers/707', 'Interview', 42000, 58000, 'Technical interview scheduled for next week.', '2026-01-18');

-- Status history for applications that changed status
INSERT INTO status_history (application_id, old_status, new_status, note) VALUES
(1, 'Sent', 'Interview', 'Received email for phone screening'),
(3, 'Sent', 'Rejected', 'Generic rejection email'),
(4, 'Sent', 'Interview', 'First interview with HR'),
(4, 'Interview', 'Offer', 'Received written offer'),
(6, 'Sent', 'Interview', 'Phone screen scheduled'),
(8, 'Sent', 'Rejected', 'Position filled'),
(10, 'Sent', 'Interview', 'Technical challenge received');
