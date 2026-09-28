import httpx

from app.settings import Settings


class TurnstileVerificationError(Exception):
    """Raised when Cloudflare Turnstile rejects or cannot verify a token."""


async def verify_turnstile_token(
    token: str | None,
    settings: Settings,
    remote_ip: str | None = None,
) -> None:
    if not settings.turnstile_secret_key:
        return

    if not token:
        raise TurnstileVerificationError

    payload = {
        "secret": settings.turnstile_secret_key,
        "response": token,
    }

    if remote_ip:
        payload["remoteip"] = remote_ip

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.post(settings.turnstile_verify_url, data=payload)
            response.raise_for_status()
            data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise TurnstileVerificationError from exc

    if not data.get("success"):
        raise TurnstileVerificationError
