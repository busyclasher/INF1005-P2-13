<?php
// booking_email.php
// Email helper function for booking confirmations

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/email_config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function sendBookingConfirmationEmail($toEmail, $firstName, $lastName, $classTitle, $sessionDate, $startTime, $durationMins) {
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
        $mail->Subject = 'Your KineticHub Booking is Confirmed!';

        $formattedDate = date('l, d F Y', strtotime($sessionDate));
        $formattedTime = date('g:i A', strtotime($startTime));

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
                .booking-details {
                    background: #f9f9f9;
                    border-left: 4px solid #C8F400;
                    padding: 16px 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                .booking-details p {
                    margin: 6px 0;
                }
                .reminder-box {
                    margin-top: 22px;
                    padding: 14px 16px;
                    border: 1px solid #e8e8e8;
                    border-radius: 10px;
                    background: #fafafa;
                }
                .reminder-box p {
                    margin: 0;
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
                    <h2>Booking Confirmed, ' . htmlspecialchars($firstName) . '!</h2>

                    <p>Your class booking has been confirmed. We look forward to seeing you!</p>

                    <div class="booking-details">
                        <p><strong>Class:</strong> ' . htmlspecialchars($classTitle) . '</p>
                        <p><strong>Date:</strong> ' . htmlspecialchars($formattedDate) . '</p>
                        <p><strong>Time:</strong> ' . htmlspecialchars($formattedTime) . '</p>
                        <p><strong>Duration:</strong> ' . (int)$durationMins . ' minutes</p>
                    </div>

                    <p>Please arrive 5-10 minutes early. If you need to cancel, you can do so from your dashboard.</p>

                    <div class="reminder-box">
                        <p><strong>Helpful reminder:</strong> Bring water, a towel, and wear comfortable training attire.</p>
                    </div>

                    <p style="margin-top: 30px;">Train hard, train smart,<br>
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

        // Plain text alternative
        $mail->AltBody = "Booking Confirmed, $firstName $lastName!\n\n" .
                         "Class: $classTitle\n" .
                         "Date: $formattedDate\n" .
                         "Time: $formattedTime\n" .
                         "Duration: {$durationMins} minutes\n\n" .
                         "Please arrive 5-10 minutes early.\n\n" .
                         "Bring water, a towel, and comfortable training attire.\n\n" .
                         "Train hard, train smart,\n" .
                         "The KineticHub Team";

        $mail->send();
        return ['success' => true, 'message' => 'Booking confirmation email sent successfully'];

    } catch (Exception $e) {
        $errorMessage = $mail->ErrorInfo ?: $e->getMessage();
        error_log("Booking email sending failed: {$errorMessage}");
        return ['success' => false, 'error' => $errorMessage];
    }
}
?>
