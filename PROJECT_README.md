# 📅 Time Table Dashboard

A comprehensive, full-stack application designed to automate and streamline university/college timetable management. This system extracts structured data from unstructured `.docx` timetable documents and provides an interactive dashboard for both administrators and faculty members.

---

## 🏗️ System Architecture

The project follows a modern client-server architecture:
- **Frontend**: A high-performance Single Page Application (SPA) built with **React**, **Vite**, and **Tailwind CSS**.
- **Backend**: A robust **Node.js** & **Express** REST API.
- **Database & Auth**: **Firebase** (Firestore and Authentication) handles secure user access and role-based permissions.

---

## 🚀 Key Features

### 1. Advanced DOCX Timetable Parsing
- **Automated Extraction**: Processes complex university timetable grids directly from Microsoft Word files.
- **Legend Mapping**: Automatically resolves faculty initials (e.g., `HK`) to their full formal names (e.g., `Mr. HARI KRISHNAN N`) using legend tables within the document.
- **Merged Cell Support**: Intelligently handles `colspan` and `rowspan` to ensure accurate time-slot mapping.

### 2. Intelligent Scheduling Logic
- **Free Slot Detection**: Automatically calculates available time slots for every faculty member across the entire academic week.
- **Dynamic Analysis**: Filters out non-teaching periods like "LUNCH", "BREAK", and "PROCTORING" for accurate availability reporting.

### 3. Interactive Dashboards
- **Admin Portal**: centralized view for uploading files, managing faculty lists, and monitoring overall workload.
- **Faculty Portal**: Personalized dashboard for individual teachers to view their specific schedules and available slots.
- **Data Visualization**: Integrated charts (using Recharts) provide visual insights into faculty workload distribution.

### 4. Secure Role-Based Access Control (RBAC)
- **Firebase Authentication**: Secure login for all users.
- **Protected Routes**: Ensures only authorized administrators can upload data or access sensitive management features.

---

## 🛠️ Technical Stack

### **Frontend**
- **Library**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (with Glassmorphism & Modern UI patterns)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API
- **Networking**: Axios

### **Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Parsing**: 
  - `mammoth`: DOCX to HTML conversion.
  - `cheerio`: HTML parsing and data extraction.
- **Authentication**: Firebase Admin SDK
- **File Handling**: Multer

---

## 📡 API Documentation

**Base API URL**: `http://localhost:5000/api`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/upload-timetable` | `POST` | Upload `.docx` file for parsing. |
| `/faculty` | `GET` | Retrieve list of all registered/parsed faculty. |
| `/faculty/:name/timetable` | `GET` | Get the weekly schedule for a specific faculty. |
| `/faculty/:name/free-slots` | `GET` | Get calculated free slots for a specific faculty. |
| `/health` | `GET` | Server status check. |

---

## 📂 Project Structure

### **Backend (`fs-backend2`)**
```text
├── src/
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request/Response logic
│   ├── services/        # DOCX parsing & analysis algorithms
│   ├── middleware/      # Auth & file upload handlers
│   └── utils/           # Formatting & helper functions
├── app.js               # Express configuration
└── server.js            # Entry point
```

### **Frontend (`fs-frontend`)**
```text
├── src/
│   ├── components/      # Reusable UI (Charts, Tables, etc.)
│   ├── pages/           # High-level route components
│   ├── context/         # Auth & Timetable state management
│   ├── api/             # Backend service integration
│   └── firebase.js      # Client-side Firebase config
```

---

## 🔧 Installation & Setup

### **1. Backend Setup**
1. Navigate to the backend directory:
   ```bash
   cd fs-backend2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### **2. Frontend Setup**
1. Navigate to the frontend directory:
   ```bash
   cd fs-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🧠 Data Extraction Engine (The "Magic")

The core of this project is its ability to handle unstructured university documents. The algorithm follows these steps:
1. **HTML Transformation**: Uses `mammoth` to convert the DOCX structure into a raw HTML representation.
2. **Tabular Analysis**: Uses `cheerio` to iterate through `<table>` elements.
3. **Grid Normalization**: Reconstructs the grid by expanding merged cells to ensure every time slot has a corresponding entry.
4. **Initial Linking**: Scans the legend tables to link abbreviated signatures with full faculty profiles.
5. **Conflict Resolution**: Cross-references every cell against the master "Time Labels" to generate a JSON-ready schedule object.

---

## 📄 License
This project is licensed under the **ISC License**.

---

> [!TIP]
> **Suggested Report Screenshots**: 
> - The Landing Page with vibrant Glassmorph styling.
> - The Admin Dashboard showing the Faculty Pie Chart distribution.
> - The uploading process showing the progress state.
> - The personalized Faculty Timetable view.
