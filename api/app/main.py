from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.mailer import MailDeliveryError, send_contact_email
from app.schemas import ContactRequest, ContactResponse, HealthResponse
from app.settings import get_settings
from app.turnstile import TurnstileVerificationError, verify_turnstile_token

settings = get_settings()

app = FastAPI(title="Portfolio API")

FIELD_ERROR_MESSAGES = {
    "name": "Zadajte meno.",
    "email": "Zadajte platný e-mail.",
    "message": "Napíšte správu aspoň s jedným slovom.",
}


def get_client_ip(request: Request) -> str | None:
    cf_connecting_ip = request.headers.get("cf-connecting-ip")
    if cf_connecting_ip:
        return cf_connecting_ip

    forwarded_for = request.headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()

    return request.client.host if request.client else None

if settings.contact_allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.contact_allowed_origins,
        allow_credentials=False,
        allow_methods=["POST", "GET"],
        allow_headers=["Content-Type"],
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    errors: dict[str, str] = {}

    for error in exc.errors():
        field = next((part for part in reversed(error["loc"]) if isinstance(part, str)), None)
        if not field or field == "body" or field in errors:
            continue

        errors[field] = FIELD_ERROR_MESSAGES.get(field, error["msg"])

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={
            "ok": False,
            "message": "Nepodarilo sa odoslať správu. Skontrolujte vyplnené polia.",
            "errors": errors,
        },
    )


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(ok=True)


@app.post("/api/contact", response_model=ContactResponse)
async def contact(payload: ContactRequest, request: Request) -> ContactResponse:
    if payload.company:
        return ContactResponse(ok=True)

    client_ip = get_client_ip(request)

    try:
        await verify_turnstile_token(payload.turnstile_token, settings, client_ip)
    except TurnstileVerificationError:
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={
                "ok": False,
                "code": "turnstile_failed",
                "message": "Nepodarilo sa overiť ochranu formulára. Skúste to znova.",
            },
        )

    try:
        await send_contact_email(payload, settings, client_ip)
    except MailDeliveryError:
        return JSONResponse(
            status_code=status.HTTP_502_BAD_GATEWAY,
            content={
                "ok": False,
                "message": "Správu sa nepodarilo odoslať. Skúste to, prosím, neskôr.",
            },
        )

    return ContactResponse(ok=True)
