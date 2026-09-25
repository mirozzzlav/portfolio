import os
from functools import lru_cache

from pydantic import BaseModel, Field


def _get_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default

    return value.strip().lower() in {"1", "true", "yes", "on"}


def _get_int(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None:
        return default

    return int(value)


def _get_list(name: str) -> list[str]:
    value = os.getenv(name, "")

    return [item.strip() for item in value.split(",") if item.strip()]


class Settings(BaseModel):
    contact_to_email: str = Field(min_length=3)
    contact_from_email: str = Field(min_length=3)
    contact_allowed_origins: list[str]
    mail_dry_run: bool
    smtp_host: str = Field(min_length=1)
    smtp_port: int
    smtp_username: str = Field(min_length=1)
    smtp_password: str
    smtp_use_tls: bool
    smtp_timeout_seconds: int


@lru_cache
def get_settings() -> Settings:
    return Settings(
        contact_to_email=os.environ["CONTACT_TO_EMAIL"],
        contact_from_email=os.environ["CONTACT_FROM_EMAIL"],
        contact_allowed_origins=_get_list("CONTACT_ALLOWED_ORIGINS"),
        mail_dry_run=_get_bool("MAIL_DRY_RUN", False),
        smtp_host=os.getenv("SMTP_HOST", "smtp.mx.cloudflare.net"),
        smtp_port=_get_int("SMTP_PORT", 465),
        smtp_username=os.getenv("SMTP_USERNAME", "api_token"),
        smtp_password=os.getenv("SMTP_PASSWORD", ""),
        smtp_use_tls=_get_bool("SMTP_USE_TLS", True),
        smtp_timeout_seconds=_get_int("SMTP_TIMEOUT_SECONDS", 10),
    )
