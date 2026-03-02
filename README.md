# 🌾 Crop Yield Prediction System
### **Big Data in Agriculture – AI-Powered Yield Forecasting**

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn-F7931E?style=flat-square&logo=scikit-learn)](https://scikit-learn.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 🚀 Live Demo
* **Frontend (Vercel):** [https://crop-yield-ai.vercel.app](https://crop-yield-ai.vercel.app)
* **Backend (Render):** [https://crop-yield-ai-ilwk.onrender.com](https://crop-yield-ai-ilwk.onrender.com)

---

## 📌 Project Overview
The **Crop Yield Prediction System** is a full-stack AI-powered web application designed to predict agricultural productivity based on environmental variables. It provides a data-driven approach for farmers and researchers to make informed decisions.


### **Key Predictors:**
* 🌡 **Temperature:** Impact on crop growth cycles.
* 🌧 **Rainfall:** Critical water availability metrics.
* 💧 **Humidity:** Assessment of transpiration and pest risks.
* 🌱 **Soil Type:** Nutrient and moisture retention capability.
* 🌾 **Crop Variety:** Species-specific yield potential.

---

## 🏗 System Architecture
The application uses a modern decoupled architecture:
1.  **Client Tier:** React with TypeScript for a robust, type-safe User Interface.
2.  **Logic Tier:** Node.js/Express backend handling API requests and JWT authentication.
3.  **Data Tier:** PostgreSQL (hosted on Neon) for persistent storage.
4.  **AI Tier:** A Python-based **Random Forest Regressor** executed via Node's `child_process` for real-time inference.


---

## 🧠 Features

### **👤 User Features**
* **Secure Access:** JWT-protected registration and login.
* **Instant Prediction:** Input environmental data to get immediate yield estimates.
* **Historical Tracking:** View a log of previous predictions.
* **Accuracy Feedback:** Update "Actual Yield" to compare with AI predictions.
* **Personal Analytics:** Interactive charts (via Recharts) for individual trends.

### **👑 Admin Features**
* **System Metrics:** Total users, total predictions, and system-wide health.
* **Global Analytics:** Distribution of crops and soil types across all user data.
* **Environmental Analysis:** Multi-variable charts correlating Temp/Rainfall with yields.
* **Management:** Full CRUD operations for administrative oversight.

---

## 🛠 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite, Tailwind CSS, Recharts, Axios |
| **Backend** | Node.js, Express.js, TypeScript, Drizzle ORM |
| **Database** | PostgreSQL (Neon) |
| **Machine Learning** | Python 3, Scikit-Learn, Pandas, Joblib |
| **Authentication** | JWT (JSON Web Tokens) with Role-Based Access |

---

## 📂 Project Structure

```text
crop-yield-prediction
├── backend
│   ├── src
│   │   ├── controllers     # Request handlers
│   │   ├── services        # Business logic & ML bridge
│   │   ├── db              # Schema & Database connection
│   │   └── middleware      # JWT Auth & Role validation
│   ├── server/ml           # Python scripts & model.pkl
├── crop-yield-frontend
│   ├── src
│   │   ├── components      # UI Building blocks
│   │   ├── pages           # Main application views
│   │   └── api             # Axios instance & endpoints
└── README.md
