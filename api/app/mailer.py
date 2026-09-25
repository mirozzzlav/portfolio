from email.message import EmailMessage

import aiosmtplib

from app.schemas import ContactRequest
from app.settings import Settings


class MailDeliveryError(Exception):
    """Raised when SMTP delivery fails."""


def build_contact_message(
    payload: ContactRequest,
    settings: Settings,
    client_ip: str | None,
) -> EmailMessage:
    message = EmailMessage()
    message["From"] = settings.contact_from_email
    message["To"] = settings.contact_to_email
    message["Reply-To"] = str(payload.email)
    message["Subject"] = f"Nová správa z portfólia od {payload.name}"

    body = "\n".join(
        [
            "Nová správa z kontaktného formulára.",
            "",
            f"Meno: {payload.name}",
            f"E-mail: {payload.email}",
            f"IP: {client_ip or 'unknown'}",
            "",
            "Správa:",
            payload.message,
        ]
    )
    message.set_content(body)

    return message


def print_dry_run_message(message: EmailMessage) -> None:
    print("MAIL_DRY_RUN=true; email was not sent.")
    print(f"From: {message['From']}")
    print(f"To: {message['To']}")
    print(f"Reply-To: {message['Reply-To']}")
    print(f"Subject: {message['Subject']}")


async def send_contact_email(
    payload: ContactRequest,
    settings: Settings,
    client_ip: str | None = None,
) -> None:
    message = build_contact_message(payload, settings, client_ip)

    if settings.mail_dry_run:
        print_dry_run_message(message)
        return

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_username,
            password=settings.smtp_password,
            use_tls=settings.smtp_use_tls,
            timeout=settings.smtp_timeout_seconds,
        )
    except (aiosmtplib.SMTPException, OSError, TimeoutError) as exc:
        raise MailDeliveryError("SMTP delivery failed.") from exc
