# Invelon Prueba 4 - Cine

## Prerequisites

Make sure you have the following installed on your machine:

- **Git**
- **Node.js** (v16.x or v18.x recommended)
- **npm** (comes with Node)
- **Python** (v3.9 or later)
- **pip** (comes with Python)
- **virtualenv** or **venv** (for Python virtual environments)

## Directory Structure

```
├── backend/           # Django project
│   └── README.md      # Backend setup & usage instructions
├── frontend/          # Next.js (or other) frontend
│   └── README.md      # Frontend setup & usage instructions
└── README.md          # ← You are here
```

### Backend

1. `cd backend`
2. Follow the instructions in [backend/README.md](backend/README.md) to:

   - Create & activate a Python virtual environment
   - Install Python dependencies
   - Configure environment variables
   - Run migrations & load fixtures
   - Create an admin user
   - Start the Django development server

### Frontend

1. `cd frontend`
2. Follow the instructions in [frontend/README.md](frontend/README.md) to:

   - Install Node.js dependencies
   - Configure any `.env` variables
   - Start the development server

After both servers are running, you can visit:

- **Backend API** at `http://127.0.0.1:8000/`
- **Frontend App** at `http://localhost:3000/`
