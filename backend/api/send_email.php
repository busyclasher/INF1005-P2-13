<?php
// send_email.php
// Email helper functions

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/email_config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function sendWelcomeEmail($toEmail, $firstName, $lastName) {
    global $email_config;
    
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->SMTPDebug = SMTP::DEBUG_OFF;
        $mail->isSMTP();
        $mail->Host       = $email_config['host'];
        $mail->SMTPAuth   = $email_config['smtp_auth'];
        $mail->Username   = $email_config['username'];
        $mail->Password   = $email_config['password'];
        $mail->SMTPSecure = $email_config['smtp_secure'];
        $mail->Port       = $email_config['port'];
        
        // Recipients
        $mail->setFrom($email_config['from_email'], $email_config['from_name']);
        $mail->addAddress($toEmail, "$firstName $lastName");
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Welcome to KineticHub!';
        
        // HTML Email Body
        $mail->Body = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: #111111;
                    padding: 20px;
                    text-align: center;
                }
                .header h1 {
                    color: #C8F400;
                    margin: 0;
                }
                .content {
                    padding: 30px;
                    background: #ffffff;
                }
                .button {
                    display: inline-block;
                    padding: 12px 24px;
                    background: #C8F400;
                    color: #111111;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    margin-top: 20px;
                }
                .footer {
                    background: #f5f5f5;
                    padding: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                .highlight {
                    color: #C8F400;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>KINETIC<span style="color: #ffffff">HUB</span></h1>
                </div>
                <div class="content">
                    <h2>Welcome to KineticHub, ' . htmlspecialchars($firstName) . '!</h2>
                    
                    <p>Thank you for joining the KineticHub community! We\'re excited to have you on board and can\'t wait to help you achieve your fitness goals.</p>
                    
                    <h3>Here\'s what you can do next:</h3>
                    <ul>
                        <li><strong>Book your first class</strong> - Explore our schedule and find classes that match your fitness level</li>
                        <li><strong>Complete your profile</strong> - Add your fitness goals and preferences</li>
                        <li><strong>Explore our programmes</strong> - Check out our structured training pathways</li>
                        <li><strong>Track your progress</strong> - Monitor your attendance and achievements in your dashboard</li>
                    </ul>
                    
                    <p>Your first class is <span class="highlight">COMPLETELY FREE</span>! Use this opportunity to experience our state-of-the-art facilities and world-class trainers.</p>
                    
                    <center>
                        <a href="http://35.212.166.173/" class="button">Go to KineticHub</a>
                    </center>
                    
                    <p style="margin-top: 30px;">If you have any questions, feel free to reply to this email or contact our support team. We\'re here to help!</p>
                    
                    <p>Train hard, train smart,<br>
                    <strong>The KineticHub Team</strong></p>
                </div>
                <div class="footer">
                    <p>&copy; ' . date('Y') . ' KineticHub. All rights reserved.</p>
                    <p>123 Fitness Street, Singapore 123456</p>
                    <p>This email was sent to ' . htmlspecialchars($toEmail) . '</p>
                </div>
            </div>
        </body>
        </html>
        ';
        
        // Plain text alternative for email clients that don't support HTML
        $mail->AltBody = "Welcome to KineticHub, $firstName $lastName!\n\n" .
                         "Thank you for joining the KineticHub community! We're excited to have you on board.\n\n" .
                         "Here's what you can do next:\n" .
                         "- Book your first class - Explore our schedule\n" .
                         "- Complete your profile - Add your fitness goals\n" .
                         "- Explore our programmes - Structured training pathways\n" .
                         "- Track your progress - Monitor your achievements\n\n" .
                         "Your first class is COMPLETELY FREE!\n\n" .
                         "Visit your dashboard: http://35.212.166.173/\n\n" .
                         "Train hard, train smart,\n" .
                         "The KineticHub Team";
        
        $mail->send();
        return ['success' => true, 'message' => 'Welcome email sent successfully'];
        
    } catch (Exception $e) {
        error_log("Email sending failed: {$mail->ErrorInfo}");
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}
?>