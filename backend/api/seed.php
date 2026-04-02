<?php
require_once 'db.php';

echo "Seeding membership plans...\n";
$conn->query("INSERT IGNORE INTO membership_plans (plan_id, plan_name, description, price, duration_days, is_active) VALUES
(1, 'Essential', 'Basic gym access', 29.99, 30, 1),
(2, 'Standard', 'Gym access + group classes', 49.99, 30, 1),
(3, 'Premium', 'All access + personal training', 89.99, 30, 1)
");

echo "Seeding sessions...\n";
// Seed upcoming sessions for ALL classes (safe to run multiple times)
$conn->query("
INSERT INTO sessions (class_id, session_date, start_time, spots_booked, status)
SELECT c.class_id, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', 0, 'scheduled'
FROM classes c
WHERE NOT EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.class_id = c.class_id
    AND s.session_date = DATE_ADD(CURDATE(), INTERVAL 2 DAY)
    AND s.start_time = '08:00:00'
)
");

$conn->query("
INSERT INTO sessions (class_id, session_date, start_time, spots_booked, status)
SELECT c.class_id, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '18:00:00', 0, 'scheduled'
FROM classes c
WHERE NOT EXISTS (
  SELECT 1 FROM sessions s
  WHERE s.class_id = c.class_id
    AND s.session_date = DATE_ADD(CURDATE(), INTERVAL 3 DAY)
    AND s.start_time = '18:00:00'
)
");

echo "Done seeding.\n";
?>
