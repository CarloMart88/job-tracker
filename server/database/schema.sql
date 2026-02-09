CREATE DATABASE IF NOT EXISTS job_tracker;
USE job_tracker;

CREATE TABLE IF NOT EXISTS applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  url VARCHAR(2048),
  status ENUM('Sent', 'Interview', 'Offer', 'Rejected') NOT NULL DEFAULT 'Sent',
  salary_min INT,
  salary_max INT,
  notes TEXT,
  date_applied DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  old_status ENUM('Sent', 'Interview', 'Offer', 'Rejected'),
  new_status ENUM('Sent', 'Interview', 'Offer', 'Rejected') NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  note VARCHAR(500),
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
