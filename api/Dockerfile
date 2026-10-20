FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1
WORKDIR /app

COPY api/pyproject.toml ./
COPY api/app ./app
RUN /usr/local/bin/python -m pip install --no-cache-dir . \
    && useradd --system --uid 10001 app

USER app
EXPOSE 8001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
