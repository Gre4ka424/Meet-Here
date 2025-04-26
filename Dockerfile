FROM python:3.11-slim

WORKDIR /app

# Установка зависимостей
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода приложения
COPY . .

# Переменные окружения
ENV PORT=8000
ENV HOST=0.0.0.0

# Установка рабочей директории для запуска и настройка портов
EXPOSE $PORT

# Команда для запуска приложения
CMD uvicorn backend.main:app --host $HOST --port $PORT --reload 