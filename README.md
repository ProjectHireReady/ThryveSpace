# ThryveSpace

This project has a React frontend (using Vite) and a Django backend.

---

## 🔥 Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

## 🧠 Backend Setup (Django + Django REST Framework)

Backend code is located in the `backend/` folder.

### ✅ Prerequisites

- Python 3.10+
- pip
- Virtualenv (recommended)

### 🔧 Setup Steps

```bash
cd backend

python3 -m venv env                # Create virtual environment
source env/bin/activate            # Activate it (Linux/WSL)
pip install -r requirements.txt    # Install dependencies
```

### 📁 .env Configuration

Cregit status

ate a `.env` file inside the `backend/` directory (same level as `manage.py`):

```
SECRET_KEY=your-secret-key
DEBUG=True
```

> Use `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'` to generate a secret key.

### 🛠 Database & Server

```bash
python manage.py migrate           # Apply migrations
python manage.py runserver         # Run the development server
```

Visit: http://127.0.0.1:8000/

---

## 👥 Developers

| Role        | Developer Responsibility                        |
| ----------- | ----------------------------------------------- |
| Developer 1 | Backend setup, DRF config, CORS, env management |
| Developer 2 | Moods API endpoint (`/api/moods`)               |
| Developer 3 | Journal entries API mock (`/api/notes`)         |

---

Creating a Superuser
1. Open your terminal and navigate to your Django project directory.
2. Run the following command: `python manage.py createsuperuser`
3. Follow the prompts to enter:
    - Username
    - Email address
    - Password

Example:

```
$ python manage.py createsuperuser
Username (leave blank to use 'your_username'): admin
Email address: admin@example.com (or leave blank)
Password: 
Password (again): 
Superuser created successfully.
```


Logging in to the Admin Endpoint
1. Start the Django development server: `python manage.py runserver`
2. Open a web browser and navigate to http://localhost:8000/admin/
3. Enter the superuser credentials:
    - Username: admin
    - Password: your_password


## 🛡 .gitignore Best Practices

Make sure the following are ignored:

```
.env
env/
__pycache__/
*.pyc
```

---
