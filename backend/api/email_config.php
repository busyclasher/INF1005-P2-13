<?php
// email_config.php
// Email configuration settings

// Use environment variables or hardcode (for development only)
// For production, it's better to use environment variables

$email_config = [
    'host' => 'smtp.gmail.com',        // SMTP server (Gmail, Outlook, etc.)
    'username' => 'kinetichub4@gmail.com', // Your email address
    'password' => 'bqrp bsla sdgt smcj',   // Your app-specific password
    'port' => 587,                       // 587 for TLS, 465 for SSL
    'from_email' => 'noreply@kinetikhub.com',
    'from_name' => 'KineticHub',
    'smtp_auth' => true,
    'smtp_secure' => 'tls'               // 'tls' or 'ssl'
];

// For Gmail, you need to:
// 1. Enable 2-factor authentication on your Google account
// 2. Generate an App Password (16 characters)
// 3. Use that app password here

// For testing, you can also use services like Mailtrap
// 'host' => 'smtp.mailtrap.io',
// 'username' => 'your-mailtrap-username',
// 'password' => 'your-mailtrap-password',
?>