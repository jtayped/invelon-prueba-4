# Setup

## 1. Create & activate a virtual environment

```bash
python3 -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1
```

## 2. Install Python dependencies

```bash
cd backend
pip install -r requirements.txt
```

## 3. Configure environment variables

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in the information

## 4. Apply database migrations

```bash
python manage.py migrate
```

## 5. Load initial data fixtures

```bash
python manage.py loaddata fixtures/screens.json
python manage.py loaddata fixtures/movies.json
python manage.py loaddata fixtures/sessions.json
```

> **Tip:** If you ever need to start with a clean database, you can drop it and then re-run steps 5–6:
>
> ```bash
> python manage.py flush --no-input
> python manage.py migrate
> python manage.py loaddata fixtures/screens.json fixtures/movies.json fixtures/sessions.json
> ```

## 6. Create an admin user

This will create a user with `is_admin=True`:

```bash
python manage.py create_admin_user --username=admin --email=admin@example.com --password=secret123
```

## 7. Run the development server

```bash
python manage.py runserver
```

Then visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.
