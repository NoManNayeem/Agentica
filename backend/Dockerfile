# backend/Dockerfile

# 1. Base image
FROM python:3.12-slim

# 2. Prevent Python buffering & bytecode
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# 3. Set workdir
WORKDIR /app

# 4. System deps for Pillow, etc.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      libjpeg-dev \
      zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

# 5. Copy & install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Gunicorn for serving the app
RUN pip install --no-cache-dir gunicorn

# 6. Copy project
COPY . .

# 7. Ensure STATIC_ROOT exists (matches settings.py STATIC_ROOT)
RUN mkdir -p /app/staticfiles

# 8. Collect static files
RUN python manage.py collectstatic --noinput

# 9. Expose & run with Gunicorn
EXPOSE 8000
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
