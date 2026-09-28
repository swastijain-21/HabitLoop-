# Habitloop 🔄

HabitLoop is a student-focused wellness app that helps users track daily habits such as sleep, movement, screen time, study/focus hours, mood, energy, mindfulness, and outdoor activity. It evaluates weekly patterns and provides personalized, practical recommendations to help users build healthier routines—one week at a time.

Built as an MVP for a college hackathon by a team of 3–4 developers.

---

## 📁 Project Structure

```text
Habitloop/
├── frontend/     # Client-side user interface (React + Vite)
├── backend/      # Server-side API and business logic (Java + Spring Boot)
├── database/     # Database schemas, migrations, and seed data (MySQL)
├── .gitignore    # Version control exclusions for React, Spring Boot, and MySQL
└── README.md     # Project documentation and setup guide
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, modern Single-Page Application (SPA) with JavaScript/TypeScript |
| **Backend** | Java + Spring Boot | RESTful API backend handling business logic and security |
| **Database** | MySQL | Relational database to persist users, habits, logs, and streaks |

---

## 📂 Folder Overview

### 1. `frontend/`
- **What it's for:** Contains the entire user interface and client-side code.
- **Contents (when scaffolded):** React components (habit cards, streak trackers, calendar views), CSS/styling, Vite configuration (`vite.config.js`), and `package.json`.
- **Role:** Handles user interaction in the browser and sends HTTP requests (fetch/axios) to the backend API.

### 2. `backend/`
- **What it's for:** Contains the server-side application logic and REST APIs.
- **Contents (when scaffolded):** Spring Boot project structure (Controllers, Services, Repositories, Entities/Models), Maven (`pom.xml`) or Gradle configuration, and `application.properties` (database connection details).
- **Role:** Processes business logic, validates habit tracking rules, calculates streaks, and securely interacts with the MySQL database.

### 3. `database/`
- **What it's for:** Holds all SQL scripts, table schemas, and dummy/seed data for team reference.
- **Contents:** SQL files (e.g., `schema.sql` for table definitions, `seed.sql` for sample hackathon test data).
- **Role:** Keeps the database design documented and in sync across all team members' local MySQL setups.

---



#HabitLoop Fitness Tracker
Habitloop is a personalized wellness and lifestyle companion that turns everyday data into actionable insights. It tracks habits such as sleep, screen time, activity, exercise, mood, and productivity, identifies meaningful patterns, and recommends simple, fun activities to help users improve. 
