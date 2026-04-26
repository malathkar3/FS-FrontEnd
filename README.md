# 📱 Timetable Dashboard Frontend

A premium React + Vite application for viewing and managing faculty timetables with a focus on high-fidelity UI and seamless user experience.

---

## ✨ Features
- **Modern UI/UX**: Built with Tailwind CSS, Lucide icons, and sleek animations.
- **Role-Based Views**:
  - **Admin Dashboard**: Upload and manage master timetables.
  - **Faculty Dashboard**: View personalized weekly schedules and free slots.
- **Intelligent Identity Sync**: Automatically matches signed-in users with their timetable records.
- **Secure Sessions**: Integrated with Firebase Authentication.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Backend server running (default: `http://localhost:5000`)

### 2. Installation
```bash
git clone <repository-url>
cd fs-frontend
npm install
```

### 3. Firebase Configuration
Update `src/firebase/config.js` with your Firebase project credentials.

### 4. Development
```bash
npm run dev
```

---

## 🛠️ Tech Stack
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## 📂 Project Structure
```text
fs-frontend/
├── src/
│   ├── components/      # UI Components (ScheduleTable, etc.)
│   ├── context/         # Auth and Timetable Global State
│   ├── pages/           # Admin & Faculty Dashboards
│   ├── services/         # API (Axios) configuration
│   └── firebase/        # SDK initialization
```

---

## 🔧 Troubleshooting
- **Identity Mismatch**: Ensure that the `displayName` in your Firestore `faculty` document matches the name assigned to you in the master timetable DOCX file.
- **403 Forbidden**: Ensure your Firebase UID exists in either the `admin` or `faculty` collections in Firestore.
