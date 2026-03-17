CREATE TABLE IF NOT EXISTS roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(30) NOT NULL,
    email_verified BIT NOT NULL,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    role_id BIGINT NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS crime_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    complaint_number VARCHAR(40) NOT NULL UNIQUE,
    citizen_id BIGINT NOT NULL,
    assigned_officer_id BIGINT,
    category_id BIGINT,
    crime_type VARCHAR(120) NOT NULL,
    title VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    incident_date DATE NOT NULL,
    incident_location VARCHAR(180),
    suspect_reference VARCHAR(180),
    amount_lost DECIMAL(12,2),
    contact_details VARCHAR(255),
    priority_level VARCHAR(20) NOT NULL,
    status VARCHAR(40) NOT NULL,
    resolution_summary TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_complaint_citizen FOREIGN KEY (citizen_id) REFERENCES users(id),
    CONSTRAINT fk_complaint_officer FOREIGN KEY (assigned_officer_id) REFERENCES users(id),
    CONSTRAINT fk_complaint_category FOREIGN KEY (category_id) REFERENCES crime_categories(id)
);

CREATE TABLE IF NOT EXISTS complaint_status_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    complaint_id BIGINT NOT NULL,
    status VARCHAR(40) NOT NULL,
    remarks VARCHAR(255),
    updated_by_id BIGINT,
    created_at DATETIME(6),
    CONSTRAINT fk_status_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    CONSTRAINT fk_status_user FOREIGN KEY (updated_by_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS evidence_files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    complaint_id BIGINT NOT NULL,
    uploaded_by_id BIGINT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    file_size BIGINT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at DATETIME(6),
    CONSTRAINT fk_evidence_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    CONSTRAINT fk_evidence_user FOREIGN KEY (uploaded_by_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS case_notes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    complaint_id BIGINT NOT NULL,
    officer_id BIGINT NOT NULL,
    note TEXT NOT NULL,
    visible_to_citizen BIT NOT NULL,
    created_at DATETIME(6),
    CONSTRAINT fk_note_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    CONSTRAINT fk_note_officer FOREIGN KEY (officer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(160) NOT NULL,
    message VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BIT NOT NULL,
    complaint_id BIGINT,
    created_at DATETIME(6),
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_notification_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(120) NOT NULL,
    entity_name VARCHAR(120) NOT NULL,
    entity_id VARCHAR(80),
    details VARCHAR(255),
    created_at DATETIME(6),
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    complaint_id BIGINT NOT NULL UNIQUE,
    citizen_id BIGINT NOT NULL,
    rating INT NOT NULL,
    satisfaction_score INT NOT NULL,
    comment VARCHAR(255),
    created_at DATETIME(6),
    CONSTRAINT fk_feedback_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    CONSTRAINT fk_feedback_user FOREIGN KEY (citizen_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(160) NOT NULL,
    content TEXT NOT NULL,
    published BIT NOT NULL,
    created_by_id BIGINT NOT NULL,
    created_at DATETIME(6),
    CONSTRAINT fk_announcement_user FOREIGN KEY (created_by_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    subject VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(40) NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES users(id)
);
