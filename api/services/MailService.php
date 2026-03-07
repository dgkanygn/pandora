<?php
/**
 * Mail Service
 * Handles email sending using PHPMailer
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

class MailService {
    private $mailer;

    public function __construct() {
        $this->mailer = new PHPMailer(true);

        // Server settings
        // $this->mailer->SMTPDebug = SMTP::DEBUG_SERVER; // Enable detailed debug output
        $this->mailer->isSMTP();
        $this->mailer->Host       = getenv('MAIL_HOST');
        $this->mailer->SMTPAuth   = true;
        $this->mailer->Username   = getenv('MAIL_USERNAME');
        $this->mailer->Password   = getenv('MAIL_PASSWORD');
        $this->mailer->SMTPSecure = getenv('MAIL_ENCRYPTION') === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port       = getenv('MAIL_PORT');
        $this->mailer->CharSet    = 'UTF-8';

        // Default Sender
        $this->mailer->setFrom(getenv('MAIL_FROM_ADDRESS'), getenv('MAIL_FROM_NAME'));
    }

    /**
     * Send email
     * @param string $to Recipient email
     * @param string $subject Email subject
     * @param string $body Email body (HTML)
     * @return bool
     */
    public function send($to, $subject, $body) {
        try {
            $this->mailer->addAddress($to);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = $subject;
            $this->mailer->Body    = $body;
            $this->mailer->AltBody = strip_tags($body);

            $this->mailer->send();
            $this->mailer->clearAddresses(); // Clear addresses for next send
            return true;
        } catch (Exception $e) {
            // Log error or handle it
            error_log("Message could not be sent. Mailer Error: {$this->mailer->ErrorInfo}");
            return false;
        }
    }

    /**
     * Send Order Created Email
     */
    public function sendOrderCreatedEmail($order) {
        if (empty($order['customer_email'])) {
            return false;
        }

        $subject = 'Siparişiniz Alındı - Sipariş No: ' . $order['order_code'];
        
        $itemsHtml = '';
        foreach ($order['order_items'] as $item) {
            $itemsHtml .= "
                <tr>
                    <td style='padding: 10px; border-bottom: 1px solid #eee;'>{$item['product_name']}</td>
                    <td style='padding: 10px; border-bottom: 1px solid #eee;'>{$item['quantity']} Adet</td>
                    <td style='padding: 10px; border-bottom: 1px solid #eee;'>" . number_format($item['price'], 2) . " TL</td>
                </tr>
            ";
        }

        $body = "
            <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                <h2 style='color: #4CAF50;'>Siparişiniz İçin Teşekkürler!</h2>
                <p>Sayın <strong>{$order['customer_name']}</strong>,</p>
                <p>Siparişiniz başarıyla alınmıştır. Aşağıda sipariş detaylarınızı bulabilirsiniz.</p>
                
                <div style='background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;'>
                    <p><strong>Sipariş Kodu:</strong> {$order['order_code']}</p>
                    <p><strong>Toplam Tutar:</strong> " . number_format($order['total_price'], 2) . " TL</p>
                    <p><strong>Teslimat Adresi:</strong> {$order['address']} / {$order['district']} / {$order['city']}</p>
                </div>

                <h3>Sipariş Detayları</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                    <thead>
                        <tr style='background: #eee;'>
                            <th style='padding: 10px; text-align: left;'>Ürün</th>
                            <th style='padding: 10px; text-align: left;'>Adet</th>
                            <th style='padding: 10px; text-align: left;'>Fiyat</th>
                        </tr>
                    </thead>
                    <tbody>
                        {$itemsHtml}
                    </tbody>
                </table>

                <p style='margin-top: 20px;'>Sipariş durumunuzu web sitemiz üzerinden sipariş numaranızla takip edebilirsiniz.</p>
                
                <p>Saygılarımızla,<br>" . getenv('MAIL_FROM_NAME') . "</p>
            </div>
        ";

        return $this->send($order['customer_email'], $subject, $body);
    }

    /**
     * Send Order Status Updated Email
     */
    public function sendOrderStatusUpdatedEmail($order) {
        if (empty($order['customer_email'])) {
            return false;
        }

        $formattedStatus = strtolower($order['status']);

        $statusMessages = [
            'pending' => 'Siparişiniz beklemede.',
            'paid' => 'Ödemeniz onaylandı. Siparişiniz hazırlanıyor.',
            'shipped' => 'Siparişiniz yola çıktı.',
            'delivered' => 'Siparişiniz teslim edildi. Bizi tercih ettiğiniz için teşekkür ederiz.',
            'cancelled' => 'Siparişiniz iptal edildi.'
        ];

        $statusTranslations = [
            'pending' => 'BEKLEMEDE',
            'paid' => 'ÖDENDİ',
            'shipped' => 'KARGOYA VERİLDİ',
            'delivered' => 'TESLİM EDİLDİ',
            'cancelled' => 'İPTAL EDİLDİ'
        ];

        $statusMsg = $statusMessages[$formattedStatus] ?? 'Sipariş durumunuz güncellendi.';
        $displayStatus = $statusTranslations[$formattedStatus] ?? strtoupper($formattedStatus);
        
        $subject = 'Sipariş Durumu Güncellendi - ' . $order['order_code'];

        $body = "
            <div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                <h2 style='color: #2196F3;'>Sipariş Durumu Güncellemesi</h2>
                <p>Sayın <strong>{$order['customer_name']}</strong>,</p>
                <p><strong>{$order['order_code']}</strong> numaralı siparişinizin durumu güncellendi.</p>
                
                <div style='background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;'>
                    <h3 style='margin: 0; color: #0d47a1; text-transform: uppercase;'>{$displayStatus}</h3>
                    <p>{$statusMsg}</p>
                </div>

                <p>Sipariş detaylarınızı web sitemizden görüntüleyebilirsiniz.</p>
                
                <p>Saygılarımızla,<br>" . getenv('MAIL_FROM_NAME') . "</p>
            </div>
        ";

        try {
            return $this->send($order['customer_email'], $subject, $body);
        } catch (Exception $e) {
            error_log("Mail gönderim hatası: " . $e->getMessage());
            return false;
        }
    }
}
