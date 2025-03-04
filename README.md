# Wallet Project

This project is part of my **Bachelor's thesis at HAMK UAS Finland** and is currently a work in progress. It aims to provide a comprehensive solution for **personal finance management**, helping users track expenses, plan budgets, generate financial reports, and gain valuable financial insights. The project is part of a larger project on chaos engineering and microservices, focusing on the development of resilient and scalable applications.

---

## \U0001f4cc Table of Contents

- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
  - [Using Docker Compose](#using-docker-compose)
  - [Running Services Individually](#running-services-individually)
- [Features](#features)
- [Future Work](#future-work)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)
- [Demo](#demo)

---

## \U0001f4d6 Introduction

The **Wallet Project** is a **personal finance management** tool developed using **TypeScript** and **Java**. It enables users to efficiently manage their finances by offering key features such as:

- **Expense Tracking**
- **Budget Planning**
- **Financial Reporting**
- **Advanced Financial Insights**

---

## \U0001f4c2 Project Structure

This project consists of multiple services along with a frontend application. The repository is structured as follows:

```
wallet/
\u251c\u2500\u2500 finance-service/
\u2502   \u251c\u2500\u2500 src/
\u2502   \u251c\u2500\u2500 test/
\u2502   \u2514\u2500\u2500 README.md
\u251c\u2500\u2500 frontend/
\u2502   \u251c\u2500\u2500 src/
\u2502   \u251c\u2500\u2500 public/
\u2502   \u2514\u2500\u2500 README.md
\u251c\u2500\u2500 insights-service/
\u2502   \u251c\u2500\u2500 src/
\u2502   \u251c\u2500\u2500 test/
\u2502   \u2514\u2500\u2500 README.md
\u251c\u2500\u2500 user-service/
\u2502   \u251c\u2500\u2500 src/
\u2502   \u251c\u2500\u2500 test/
\u2502   \u2514\u2500\u2500 README.md
\u251c\u2500\u2500 .gitignore
\u2514\u2500\u2500 README.md
```

---

## \U0001f6e0 Technologies Used

The project leverages various technologies for both frontend and backend development:

- **Frontend:**
  - TypeScript
  - React
  - Vite + SWC

- **Backend:**
  - Node.js
  - NestJS (Fastify & Mongoose)
  - Java & Spring Boot (for user-service security & data management)
  - Python & FastAPI (for insights-service)

- **Infrastructure & Deployment:**
  - Docker & Docker Compose
  - GitHub Actions
  - Kubernetes (planned)

---

## \u2699\ufe0f Installation

Follow these steps to set up the project:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ahm282/wallet.git
   cd wallet
   ```

---

## \U0001f680 Usage

The project can be run using **Docker Compose** or by running each service individually.

### \U0001f539 Using Docker Compose

For an easy setup, use Docker Compose:

1. Ensure **Docker** and **Docker Compose** are installed.
2. Copy the provided `.env.example` file and configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Run the following command to start all services:
   ```bash
   docker-compose up --build
   ```

### \U0001f539 Running Services Individually

If you prefer manual control over each service, use the following steps:

#### **Frontend**
```bash
cd frontend
npm install
npm run start
```

#### **Finance Service**
```bash
cd finance-service
npm install
npm run start:dev
```

#### **Insights Service**
```bash
cd insights-service
python -m venv .venv
source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### **User Service**
```bash
cd user-service
./mvnw spring-boot:run
```

---

## \u2705 Features

- [ ] **Expense Tracking**: Log daily expenses and categorize them.
- [ ] **Budget Planning**: Set monthly and yearly budget goals.
- [ ] **Financial Reporting**: Generate detailed reports for financial analysis.
- [ ] **Insights & Analytics**: Gain actionable financial insights.

---

## \U0001f52e Future Work

Planned enhancements include:

- [ ] **Improved UI/UX**: Refining the frontend design.
- [ ] **Data Visualization**: Implementing charts and graphs for better financial insights.
- [ ] **Additional Financial Tools**: Expanding features to include investments and savings tracking.
- [ ] **Illustrations & Diagrams**: Adding visual representations for financial data.

---

## \U0001f91d Contributing

Contributions are welcome! To contribute to the project, follow these steps:
    - Fork the repository
    - Create a new branch
    - Make your changes
    - Commit your changes
    - Push to the branch
    - Submit a pull request

---

## \U0001f4e9 Contact

For inquiries, reach out to:

- **Ahmed Mahgoub** - [GitHub](https://github.com/ahm282)

For commit history and updates, visit the [commits page](https://github.com/ahm282/wallet/commits).

---

## \U0001f310 Demo

Check out a live demo of the application at:
\U0001f449 [https://walletapp.top/](https://walletapp.top/)

