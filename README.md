# Gati Rehab App - AI-Powered Virtual Rehabilitation Assistant

A premium Progressive Web Application (PWA) for remote physical therapy using state-of-the-art AI-powered pose detection and real-time clinical monitoring.

## 🎯 Project Overview

Gati is a sophisticated rehabilitation platform that transforms smartphone cameras into clinical-grade assessment tools. Using MediaPipe AI, it provides real-time biomechanical feedback, range-of-motion (ROM) tracking, and form quality scoring.

**Live Project**: `https://gati.web.app/` (Production environment)

## 🚀 Tech Stack

- **Frontend**: React.js + Vite (High-performance rendering)
- **Routing**: Centralized Route Configuration (React Router v7)
- **Styling**: Vanilla CSS + Tailwind (Modern Glassmorphism & Neural themes)
- **AI Engine**: MediaPipe Pose Landmarker (33 keypoints, 30+ FPS client-side)
- **Real-time DB**: Firebase Firestore (Real-time sync enabled)
- **Auth**: Firebase Authentication (Multi-role support)
- **Analytics**: Recharts (Clinical trend visualization)
- **Offline**: Service Workers + LocalStorage sync architecture
- **Icons**: Lucide React (Premium stroke set)

## 📁 Optimized Project Structure

The project follows a scalable **Feature-Based Architecture**:

```
src/
├── app/               # Main entry, global styles, and routing
├── features/          # Domain-driven feature modules
│   ├── ai/            # Core MediaPipe engine and feedback logic
│   ├── auth/          # Login, Registration, and Auth Context
│   ├── doctor/        # Command Center, Patient Monitoring, Charts
│   └── patient/       # Nexus Dashboard, Workout Session, Scoring
├── shared/            # Reusable components (NavHeader, Modals)
├── lib/               # Third-party configurations (Firebase)
└── utils/             # Global utility functions
```

> **[View Detailed File Structure Documentation](./FILE_STRUCTURE.md)** - complete breakdown of all files and directories.
>
> ## 📋 Prerequisites

Before running Gati Rehab locally, make sure you have:

- Node.js installed
- npm installed
- Git installed
- A modern browser with camera access
- Required Firebase configuration/environment variables

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The app will open at `http://localhost:5173`

### 3. Build & Deploy
```bash
npm run build
firebase deploy
```

## 🌟 Key Features

### For Patients (The Nexus)
- **Real-time AI Coach**: 33-point pose tracking with instant voice and visual feedback.
- **Precision Scoring**: Advanced Form Quality Score (0-100) based on symmetry and accuracy.
- **ROM Tracking**: Automatic Range of Motion measurement for clinical progress.
- **Recovery Roadmap**: Visual daily routine tracking with streak mechanics.
- **Neural Settings**: Personalized motion feedback and audio cues.

### For Doctors (Command Center)
- **Patient Directory**: Real-time status monitoring for all patients.
- **Clinical Analytics**: Interactive charts for Adherence, ROM Trends, and Form Quality.
- **Neural Chat**: AI-powered assistant for analyzing patient data and suggesting adjustments.
- **Direct Assignment**: Remote session configuration and routine management.

## 🔒 Security & Privacy
- **Clinical-Grade Encryption**: All recovery data is sequestered and only accessible by authorized clinicians.
- **Real-time Sync**: State-of-the-art synchronization ensures trainers see progress the moment it happens.
- **HIPAA-Ready Architecture**: Data structures designed for medical confidentiality.

## 🔐 Persona Credentials

| Role | Email | Password |
|------|-------|----------|
| **Doctor** | `doctor@demo.com` | `Demo123!` |
| **Patient** | `rajesh@demo.com` | `Demo123!` |


## ✅ Implementation Status
- [x] **MediaPipe Core**: 30FPS real-time pose landmarker.
- [x] **Neural Dashboard**: Fluid, premium glassmorphism UI.
- [x] **Real-time Sync**: Firestore snapshot listeners integrated.
- [x] **Form Scoring**: Multi-vector quality assessment algorithm.
- [x] **PWA Ready**: Full offline capability and installability.

---

**Built with ❤️ by Heal-gorithms for the future of digital rehabilitation**
