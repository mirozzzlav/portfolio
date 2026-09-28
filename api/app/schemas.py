from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class HealthResponse(BaseModel):
    ok: bool


class ContactResponse(BaseModel):
    ok: bool


class ContactRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=4000)
    company: str | None = Field(default=None, max_length=200)
    turnstile_token: str | None = Field(
        default=None,
        alias="turnstileToken",
        max_length=2048,
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Zadajte meno.")

        return stripped

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str) -> str:
        stripped = value.strip()
        if not any(character.isalnum() for character in stripped):
            raise ValueError("Napíšte správu aspoň s jedným slovom.")

        return stripped
