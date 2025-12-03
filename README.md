# 🚀 Career+  
### AI-Powered Resume Skill Extraction & Job Role Matching Platform (MERN Stack)

Career+ is a smart career guidance platform built using the **MERN stack**.  
Users can upload their resume, extract skills automatically, view recommended job roles, and understand what skills they need to learn next.

It acts like your personal career assistant — analyzing your resume and matching it with real job descriptions.

---

## 🎯 Features

### 📄 **Resume Upload & Parsing**
- Upload resume in PDF or DOC format  
- Extracts your technical skills automatically  
- Uses keyword extraction + matching logic  

### 🧠 **Smart Job Role Matching**
- Matches your skills to predefined job roles (Frontend, Backend, Full-Stack, Python Dev, etc.)  
- Shows:
  - Required skills  
  - Missing skills  
  - Salary range  
  - Experience level  

### 📊 **Career Dashboard**
- Profile overview  
- Upload history  
- Skill insights  
- Quick navigation tabs  

### 🔐 **Authentication System**
- JWT-based Login/Register  
- Secure routes  
- User-specific resume uploads  

### 🧭 **Learning Path (Coming Soon)**
- Suggest tutorials, courses, and resources based on missing skills  

---

## 🛠️ Tech Stack

### **Frontend**
- React.js  
- HTML / CSS / JavaScript  
- Axios  
- Responsive UI components  

### **Backend**
- Node.js  
- Express.js  
- JWT Authentication  
- File upload using Multer  
- Custom resume parsing logic  

### **Database**
- MongoDB (Mongoose ORM)

---

## 📥 Resume Parsing Logic

1. User uploads a PDF/DOC resume  
2. Backend extracts text using parsing libraries  
3. Text is cleaned and tokenized  
4. Skills are identified by matching against a predefined global skills list  
5. Extracted skills are compared with job requirements  
6. Returned to the UI as structured data  

---

## 🔍 Job Matching Logic

Each job role contains:

- Required skills  
- Experience  
- Salary range  
- Description  

The system:

1. Takes extracted skills  
2. Compares with job roles  
3. Identifies:
   - Skills you have  
   - Skills you are missing  
4. Shows match result inside UI  

---

## 🖼️ Screenshots

| Page | Screenshot |
|------|-----------|
| Dashboard Overview | ![Dashboard](/screenshots/dashboard.png) |
| Upload Resume | ![Upload](/screenshots/upload.png) |
| Job Matching | ![Job Matching](/screenshots/matching.png) |
| Login | ![Login](/screenshots/login.png) |
| Register | ![Register](/screenshots/register.png) |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/career-plus.git
cd career-plus
```

### 🔧 Backend Setup
📁 Navigate to backend
```bash
cd backend
```
📦 Install dependencies
```bash
npm install
```
🔐 Create .env file
Add this inside:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
▶️ Start backend
```bash
node server.js
```
Backend runs on:
```bash
http://localhost:5000
```
### 💻 Frontend Setup
📁 Navigate to frontend
```bash
cd ../frontend
```
📦 Install dependencies
```bash
npm install
```
▶️ Start frontend
```bash
npm start
```
Frontend runs on:
```bash
http://localhost:3000
```

### 📂 Folder Structure
```bash

Career+/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   ├── seedJobs.js
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│
└── README.md
```
---

### 🔮 Future Improvements

  - Full learning path suggestions
  - Resume scoring system
  - Multi-resume history with analytics
  - AI-powered job recommendations
  - Dark mode
  - Deploy on Render/Vercel

---

## 👨‍💻 Author
###  Divyesh Prajapati
Full Stack Developer  
Building intelligent, modern, user-focused applications.
