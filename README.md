# MeetHere - Платформа для встреч и общения


## Структура проекта

```
/
├── backend/               # Бэкенд на FastAPI
│   └── main.py            # Основной файл приложения
├── frontend/              # Фронтенд на HTML/CSS/JS
│   ├── index.html         # Главная страница
│   ├── styles.css         # CSS стили
│   └── script.js          # JavaScript для фронтенда
├── Dockerfile             # Для развертывания на Railway
├── requirements.txt       # Зависимости Python
└── README.md              # Документация проекта
```

## Технологии

- **Бэкенд**: Python, FastAPI, SQLAlchemy, SQLite (с возможностью перехода на PostgreSQL)
- **Фронтенд**: HTML, CSS, JavaScript
- **Деплой**: Docker, Railway

## Локальный запуск

### Предварительные требования

- Python 3.8 или выше
- pip (менеджер пакетов Python)

### Шаги для запуска

1. Клонируйте репозиторий:
   ```
   git clone [ссылка на репозиторий]
   cd [название директории проекта]
   ```

2. Установите зависимости:
   ```
   pip install -r requirements.txt
   ```

3. Запустите бэкенд:
   ```
   cd backend
   uvicorn main:app --reload
   ```

4. Откройте фронтенд:
   - Откройте файл `frontend/index.html` в вашем браузере
   - Или используйте HTTP-сервер, например:
     ```
     cd frontend
     python -m http.server
     ```
     и перейдите по адресу http://localhost:8000

## Деплой на Railway

Railway - это современная платформа для развертывания приложений, которая значительно упрощает процесс деплоя.

### Шаги для деплоя

1. Зарегистрируйтесь на [Railway](https://railway.app/) и установите CLI:
   ```
   npm i -g @railway/cli
   ```

2. Войдите в свой аккаунт:
   ```
   railway login
   ```

3. Инициализируйте проект:
   ```
   railway init
   ```

4. Добавьте PostgreSQL в проект:
   ```
   railway add
   ```
   Выберите PostgreSQL из списка.

5. Задеплойте проект:
   ```
   railway up
   ```

6. Настройте переменные окружения в консоли Railway:
   - DATABASE_URL - строка подключения к PostgreSQL (Railway заполнит автоматически)
   - Другие необходимые переменные

7. Откройте URL вашего приложения, который предоставит Railway.

## Автоматическая миграция базы данных

Проект настроен таким образом, что при запуске происходит автоматическая миграция базы данных благодаря SQLAlchemy:

```python
Base.metadata.create_all(bind=engine)
```

При первом запуске будут созданы все необходимые таблицы в базе данных.

## Контакты

Если у вас возникли вопросы или предложения по улучшению проекта, пожалуйста, свяжитесь со мной по адресу [ваш email]. 
