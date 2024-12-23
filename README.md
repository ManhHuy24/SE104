# Student Management System - SE104

This project is a Student Management System with a React frontend and a Node.js/Express backend.

---

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [npm](https://www.npmjs.com/)
- A running instance of your database (e.g., MySQL or MongoDB)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ManhHuy24/SE104.git
cd SE104
```

---

### 2. Setting Up the Backend

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure the `.env` file:
   - Edit the `.env` file to set your database credentials:

     ```env
     DB_HOST=your-database-host
     DB_USER=your-database-user
     DB_PASS=your-database-password
     DB_NAME=your-database-name
     ```

   - Replace `your-database-host`, `your-database-user`, `your-database-password`, and `your-database-name` with your actual database information.

4. Start the backend server:

   ```bash
   node app.js
   ```

   - The backend will run on [http://localhost:5000](http://localhost:5000).

---

### 3. Setting Up the Frontend

1. Navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm start
   ```

   - The frontend will run on [http://localhost:3000](http://localhost:3000).

---

## Running the Application

1. Make sure the backend server is running:
   - Navigate to the `backend` directory and run:

     ```bash
     node app.js
     ```

2. Start the frontend server:
   - Navigate to the `frontend` directory and run:

     ```bash
     npm start
     ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Available Scripts

### Backend

In the `backend` directory, you can run:

- **`node app.js`**: Start the backend server.

### Frontend

In the project's root directory, you can run:

- **`npm start`**: Start the frontend development server.
- **`npm run build`**: Build the frontend for production.
- **`npm test`**: Run tests.

---

## Troubleshooting

### Backend `.env` Example

Here's an example `.env` file for the backend:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=password123
DB_NAME=student_db
```

### Common Issues

1. **Database connection error**: Ensure your database is running and the credentials in the `.env` file are correct.
2. **Port conflicts**: Ensure no other application is running on ports 3000 (frontend) or 5000 (backend).

---

## Learn More

- [React Documentation](https://reactjs.org/)
- [Express Documentation](https://expressjs.com/)
