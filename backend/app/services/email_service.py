import os
import smtplib
import socket
import logging
from email.mime.text import MIMEText
from email.utils import formataddr


logger = logging.getLogger(__name__)


class SmtpEmailClient:
    def __init__(self):
        # Modes:
        #  - smtp (default): send via configured SMTP server
        #  - console: print email to console (useful in dev without SMTP)
        self.mode = os.getenv("SMTP_MODE", "console").lower()

        self.host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.port = int(os.getenv("SMTP_PORT", "465"))
        self.username = os.getenv("SMTP_USERNAME", "")
        self.password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("SMTP_FROM_EMAIL", "no-reply@food-rescue.local")
        self.from_name = os.getenv("SMTP_FROM_NAME", "Food Rescue")
        self.use_tls = os.getenv("SMTP_USE_TLS", "false").lower() == "true"
        self.use_ssl = os.getenv("SMTP_USE_SSL", "true").lower() == "true"  # Default to SSL for Gmail
        # If true, raise errors when send fails (recommended in prod)
        self.strict = os.getenv("SMTP_STRICT", "false").lower() == "true"

    def send(self, to_email: str, subject: str, body: str):
        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = subject
        msg["From"] = formataddr((self.from_name, self.from_email))
        msg["To"] = to_email

        if self.mode == "console":
            logger.info("[SMTP console mode] To=%s Subject=%s\n%s", to_email, subject, body)
            return

        # Default: SMTP mode
        try:
            # Primary attempt based on configured flags
            if self.use_ssl:
                with smtplib.SMTP_SSL(self.host, self.port, timeout=10) as server:
                    if self.username:
                        server.login(self.username, self.password)
                    server.sendmail(self.from_email, [to_email], msg.as_string())
                    logger.info(f"Email sent successfully to {to_email} via SSL:{self.host}:{self.port}")
                    return

            with smtplib.SMTP(self.host, self.port, timeout=10) as server:
                if self.use_tls:
                    server.starttls()
                if self.username:
                    server.login(self.username, self.password)
                server.sendmail(self.from_email, [to_email], msg.as_string())
                logger.info(f"Email sent successfully to {to_email} via TLS:{self.host}:{self.port}" if self.use_tls else f"Email sent successfully to {to_email} via plain SMTP:{self.host}:{self.port}")
                return
        except smtplib.SMTPAuthenticationError as exc:
            logger.error("SMTP Authentication failed. Check your SMTP_USERNAME and SMTP_PASSWORD. Error: %s", exc)
            if self.strict:
                raise
            logger.warning("[SMTP fallback console] To=%s Subject=%s\n%s", to_email, subject, body)
        except (smtplib.SMTPException, OSError, socket.timeout) as exc:
            logger.error("Failed to send email via SMTP (%s:%s): %s", self.host, self.port, exc)
            # Attempt automatic fallback between SSL(465) and TLS(587) when using common providers
            try:
                if self.use_ssl:
                    # Fallback to TLS:587
                    with smtplib.SMTP(self.host, 587, timeout=10) as server:
                        server.starttls()
                        if self.username:
                            server.login(self.username, self.password)
                        server.sendmail(self.from_email, [to_email], msg.as_string())
                        logger.info(f"Email sent successfully to {to_email} via TLS fallback:{self.host}:587")
                        return
                else:
                    # Fallback to SSL:465
                    with smtplib.SMTP_SSL(self.host, 465, timeout=10) as server:
                        if self.username:
                            server.login(self.username, self.password)
                        server.sendmail(self.from_email, [to_email], msg.as_string())
                        logger.info(f"Email sent successfully to {to_email} via SSL fallback:{self.host}:465")
                        return
            except Exception as fallback_exc:
                logger.error("Email send fallback also failed: %s", fallback_exc)
                if self.strict:
                    raise
                # Non-strict: fall back to console log so flows continue in dev
                logger.warning("[SMTP fallback console] To=%s Subject=%s\n%s", to_email, subject, body)


email_client = SmtpEmailClient()

def send_otp_email(to_email: str, code: str, expires_minutes: int = 10):
    subject = "Your Food Rescue OTP Code"
    body = (
        f"Your OTP code is: {code}\n\n"
        f"This code will expire in {expires_minutes} minutes.\n"
        f"If you did not request this, you can ignore this email."
    )
    email_client.send(to_email, subject, body)



