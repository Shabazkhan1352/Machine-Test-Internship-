# MERN Stack Agent Management Application

## Project Overview

This MERN stack application enables:

- Admin user login with JWT authentication
- Agent creation and management
- Uploading CSV/XLSX contact lists with validation
- Automatic even distribution of list items among agents
- Viewing assigned lists per agent on the frontend

---

## Tech Stack

- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, XLSX
- Frontend: React.js, Axios, React Router

---

## Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud instance)
- npm (comes with Node.js)
- Git (optional, for cloning)

---

## Step-by-Step Setup & Run Instructions

### 1. Clone the repository (or unzip the project)

```bash
git clone https://github.com/Shabazkhan1352/Machine-Test-Internship-

```

---

### 2. Backend Setup

#### a. Navigate to backend folder

```bash
cd mern-backend
```

#### b. Install dependencies

```bash
npm install
```

#### c. Create `.env` file in `mern-backend` folder with contents:

```
PORT=5000
MONGO_URI=mongodb+srv://Shabaz:Khan2004@internship.q5raad3.mongodb.net/
JWT_SECRET=<your_your_jwt_secret12345
```



#### d. Start backend server (with nodemon)

```bash
npm run dev
```

- Backend runs on http://localhost:5000 by default

---

### 3. Frontend Setup

#### a. Open a new terminal and navigate to frontend folder

```bash
cd mern-frontend
```

#### b. Install frontend dependencies

```bash
npm install
```

#### c. Start React development server

```bash
npm start
```

- Frontend runs on http://localhost:5173 by default

---

## Step-by-Step Usage Guide

### 1. Admin Login

- Open http://localhost:5173
- Login using admin credentials
   admin credentials :
   email : admin@example.com 
   password : admin123

### 2. Add Agents

- Navigate to **Add Agent** page (e.g., http://localhost:5173/add-agent)
- Fill in agent details (Name, Email, Mobile with country code, Password)
- Submit to create new agent accounts

### 3. Upload Contact List

- Navigate to **Upload List** page (http://localhost:5173/upload)
- Select a CSV or Excel file with columns: `FirstName`, `Phone`, `Notes` (Notes optional)
- Supported file extensions: `.csv`, `.xlsx`, `.xls`
- Upload file to backend
- The app validates and uploads the contacts

### 4. Distribute List Items

- Upon successful upload, the backend automatically distributes contacts evenly among all agents
- Distribution follows these rules:
  - Each agent gets an equal number of items
  - Extra items (if not divisible) distributed sequentially

### 5. View Assigned Lists

- Go to **View Assigned Lists** page (http://localhost:5173/view)
- Select an agent from dropdown
- View all contacts assigned to that agent

---

## Testing APIs with Postman (Optional)

| Endpoint                | Method | Description                       |
|-------------------------|--------|---------------------------------|
| `/api/auth/login`            | POST   | Admin login with email & password |
| `/api/agents`           | POST   | Add a new agent                 |
| `/api/lists/upload`     | POST   | Upload CSV/XLSX file             |
| `/api/lists/distribute` | POST   | Distribute uploaded items        |
| `/api/lists/agent/:id`  | GET    | Get items assigned to agent by ID|

---

## Important Notes

- CSV files must have headers: `FirstName, Phone, Notes`
- Ensure MongoDB is running and connection string is correct
- JWT secret key should be kept safe and private
- Use `.env` for all sensitive data, never commit `.env` with real secrets
- For testing, create admin users directly in MongoDB collection if needed

---

## Demo Video

You can watch a working demo video of this application here:  
[Google Drive Demo Video Link](<your_google_drive_link_here>)

---

## Contact

For any questions or issues, contact:  
Shabaz Khan
Email: shabaz1352khan@gmail.com

---

## Thank You!

Good luck and thank you for reviewing this MERN stack agent management application.
