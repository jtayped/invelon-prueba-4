Here’s a fleshed-out “Setup” section you can drop into your README (or a `docs/SETUP.md`). Adjust any paths or env-var names to match your project:

````markdown
# Setup

## 1. Clone the repository

```bash
git clone git@github.com:your-org/your-repo.git
cd your-repo
```
````

## 2. Create & activate a virtual environment

```bash
python3 -m venv .venv
# macOS / Linux
source .venv/bin/activate
# Windows (PowerShell)
.venv\Scripts\Activate.ps1
```

## 3. Install Python dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## 4. Configure environment variables

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in the information

## 5. Apply database migrations

```bash
python manage.py migrate
```

## 6. Load initial data fixtures

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

## 7. Create an admin user

This will create a user with `is_admin=True`:

```bash
python manage.py create_admin_user \
  --username=admin \
  --email=admin@example.com \
  --password=secret123
```

## 8. Run the development server

```bash
python manage.py runserver
```

Then visit [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.
