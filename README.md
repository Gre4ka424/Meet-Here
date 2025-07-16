 MeetHere – Platform for Meetings and Communication

## Project Structure

```
/
├── backend/               # Backend on FastAPI
│   └── main.py            # Main application file
├── frontend/              # Frontend with HTML/CSS/JS
│   ├── index.html         # Main page
│   ├── styles.css         # CSS styles
│   └── script.js          # JavaScript for frontend
├── Dockerfile             # For deployment on Railway
├── requirements.txt       # Python dependencies
└── README.md              # Project documentation
```

## Technologies

- **Backend**: Python, FastAPI, SQLAlchemy, SQLite (with the possibility to switch to PostgreSQL)
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: Docker, Railway

## Local Launch

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Steps to Launch

1. Clone the repository:
   ```
   git clone [repository link]
   cd [project directory name]
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Start the backend:
   ```
   cd backend
   uvicorn main:app --reload
   ```

4. Open the frontend:
   - Open the `frontend/index.html` file in your browser
   - Or use an HTTP server, for example:
     ```
     cd frontend
     python -m http.server
     ```
     and go to http://localhost:8000

## Deployment on Railway

Railway is a modern platform for deploying applications that greatly simplifies the deployment process.

### Deployment Steps

1. Register on [Railway](https://railway.app/) and install the CLI:
   ```
   npm i -g @railway/cli
   ```

2. Log in to your account:
   ```
   railway login
   ```

3. Initialize the project:
   ```
   railway init
   ```

4. Add PostgreSQL to the project:
   ```
   railway add
   ```
   Select PostgreSQL from the list.

5. Deploy the project:
   ```
   railway up
   ```

6. Set environment variables in the Railway console:
   - DATABASE_URL – connection string to PostgreSQL (Railway will fill this in automatically)
   - Other necessary variables

7. Open the URL of your application provided by Railway.

## Automatic Database Migration

The project is configured so that automatic database migration occurs on startup thanks to SQLAlchemy:

```python
Base.metadata.create_all(bind=engine)
```

All necessary tables will be created in the database on the first run.

## Contacts

If you have any questions or suggestions for improving the project, please contact me at [100728294@unimail.derby.ac.uk]. 
