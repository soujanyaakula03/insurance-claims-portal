-- ──────────────────────────────────────────────────────────────────
-- Insurance Claims Portal – Seed Data
-- ──────────────────────────────────────────────────────────────────
-- Passwords are bcrypt hash of 'password123' (rounds=10)

INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'admin@claims.io',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Alice',
    'Admin',
    'admin'
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'adjuster@claims.io',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Bob',
    'Adjuster',
    'adjuster'
  ),
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'viewer@claims.io',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Carol',
    'Viewer',
    'viewer'
  )
ON CONFLICT (email) DO NOTHING;

-- Demo claims
INSERT INTO claims (
  id, claim_number, title, description, type, status, amount_claimed, amount_approved,
  policy_number, claimant_name, claimant_email, claimant_phone,
  incident_date, submitted_by, assigned_to
) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'CLM-2024-0001', 'Rear-end collision on Highway 101', 'Vehicle was struck from behind while stopped at traffic light. Significant rear bumper damage.', 'auto', 'approved', 8500.00, 7200.00, 'POL-AUTO-88221', 'James Miller', 'james.miller@email.com', '415-555-0101', '2024-01-10', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
  ('d1000000-0000-0000-0000-000000000002', 'CLM-2024-0002', 'Water damage from pipe burst', 'Burst pipe in kitchen caused flooding of lower level. Hardwood floors and drywall damaged.', 'home', 'under_review', 22000.00, NULL, 'POL-HOME-44512', 'Sarah Johnson', 'sarah.j@email.com', '510-555-0202', '2024-01-18', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
  ('d1000000-0000-0000-0000-000000000003', 'CLM-2024-0003', 'Emergency appendectomy', 'Emergency surgery required for acute appendicitis. 3-night hospital stay.', 'health', 'submitted', 45000.00, NULL, 'POL-HLTH-77733', 'Robert Chen', 'r.chen@email.com', '650-555-0303', '2024-02-05', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', NULL),
  ('d1000000-0000-0000-0000-000000000004', 'CLM-2024-0004', 'Hail storm roof damage', 'Severe hailstorm caused extensive damage to shingles and gutters. Multiple sections need replacement.', 'home', 'approved', 15000.00, 13500.00, 'POL-HOME-33201', 'Emily Davis', 'emily.d@email.com', '707-555-0404', '2024-02-12', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('d1000000-0000-0000-0000-000000000005', 'CLM-2024-0005', 'Slip and fall liability claim', 'Customer slipped on wet floor in store. Seeking medical and lost wages compensation.', 'liability', 'under_review', 30000.00, NULL, 'POL-LIAB-99001', 'Michael Torres', 'm.torres@email.com', '408-555-0505', '2024-02-20', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
  ('d1000000-0000-0000-0000-000000000006', 'CLM-2024-0006', 'Stolen vehicle claim', 'Vehicle stolen from apartment complex parking lot overnight. Police report filed.', 'auto', 'rejected', 28000.00, NULL, 'POL-AUTO-55678', 'Lisa Wang', 'l.wang@email.com', '925-555-0606', '2024-03-01', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
  ('d1000000-0000-0000-0000-000000000007', 'CLM-2024-0007', 'Term life benefit claim', 'Beneficiary claim following policyholder passing. All documentation submitted.', 'life', 'submitted', 500000.00, NULL, 'POL-LIFE-11100', 'David Wilson', 'd.wilson@email.com', '510-555-0707', '2024-03-10', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', NULL),
  ('d1000000-0000-0000-0000-000000000008', 'CLM-2024-0008', 'Windshield replacement', 'Rock chip caused crack across driver side windshield. Replacement required for safety.', 'auto', 'closed', 650.00, 600.00, 'POL-AUTO-88221', 'James Miller', 'james.miller@email.com', '415-555-0101', '2024-03-15', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
  ('d1000000-0000-0000-0000-000000000009', 'CLM-2024-0009', 'Fire damage to garage', 'Electrical fire in detached garage. Structure and contents significantly damaged.', 'home', 'draft', 40000.00, NULL, 'POL-HOME-55432', 'Patricia Brown', 'p.brown@email.com', '415-555-0909', '2024-03-20', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', NULL),
  ('d1000000-0000-0000-0000-000000000010', 'CLM-2024-0010', 'MRI and physical therapy', 'Lower back injury from auto accident. MRI, specialist visits, and 8 weeks PT required.', 'health', 'under_review', 12000.00, NULL, 'POL-HLTH-22900', 'Kevin Anderson', 'k.anderson@email.com', '650-555-1010', '2024-03-25', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
  ('d1000000-0000-0000-0000-000000000011', 'CLM-2024-0011', 'Tree fall on fence and shed', 'Large oak fell during storm damaging wooden fence and garden shed. Contractor estimate attached.', 'home', 'approved', 5500.00, 5200.00, 'POL-HOME-44512', 'Sarah Johnson', 'sarah.j@email.com', '510-555-0202', '2024-04-02', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', 'b2c3d4e5-f6a7-8901-bcde-f12345678901'),
  ('d1000000-0000-0000-0000-000000000012', 'CLM-2024-0012', 'Side-swipe accident downtown', 'Vehicle side-swiped while legally parked. Other driver identified and insured.', 'auto', 'submitted', 4200.00, NULL, 'POL-AUTO-77123', 'Anna Patel', 'a.patel@email.com', '415-555-1212', '2024-04-08', 'b2c3d4e5-f6a7-8901-bcde-f12345678901', NULL)
ON CONFLICT (claim_number) DO NOTHING;
