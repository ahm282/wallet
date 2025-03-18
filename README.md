# Wallet Project

This project is part of my Bachelor's thesis at HAMK UAS Finland and is currently a work in progress. It aims to provide a comprehensive solution for personal finance management, helping users track expenses, plan budgets, generate financial reports, and gain valuable financial insights. The project is part of a larger project on chaos engineering and microservices, focusing on the development of resilient and scalable applications.

---

## 📌 Table of Contents

-   [Introduction](#introduction)
-   [Project Structure](#project-structure)
-   [Technologies Used](#technologies-used)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Using Docker Compose](#using-docker-compose)
    -   [Running Services Individually](#running-services-individually)
-   [Features](#features)
-   [Future Work](#future-work)
-   [Contributing](#contributing)
-   [License](#license)
-   [Acknowledgements](#acknowledgements)
-   [Contact](#contact)
-   [Demo](#demo)

---

## 📖 Introduction

The Wallet Project is a personal finance management tool mainly developed using TypeScript and Java. It enables users to efficiently manage their finances by offering key features such as:

-   Expense Tracking
-   Budget Planning
-   Financial Reporting
-   Advanced Financial Insights

---

## 📁 Project Structure

This project consists of multiple services along with a frontend application. The repository is structured as follows:

```
wallet/
├── finance-service/
│   ├── src/
│   ├── test/
│   └── README.md
├── frontend/
│   ├── src/
│   ├── public/
│   └── README.md
├── insights-service/
│   ├── src/
│   └── README.md
├── user-service/
│   ├── src/
│   └── README.md
├── api-gateway/
│   ├── src/
│   └── README.md
├── .gitignore
└── README.md
```

---

## 🛠 Technologies Used

The project leverages various technologies for both frontend and backend development:

-   Frontend:

    -   TypeScript
    -   React
    -   Vite + SWC

-   Backend:

    -   Node.js
    -   NestJS (Fastify & Mongoose)
    -   Java & Spring Boot (for user-service security & data management)
    -   Python & FastAPI (for insights-service)

-   Infrastructure & Deployment:
    -   Docker & Docker Compose
    -   GitHub Actions
    -   Kubernetes _(planned)_

---

## ⚙️ Installation

Follow these steps to set up the project:

1. Clone the repository:
    ```bash
    git clone https://github.com/ahm282/wallet.git
    cd wallet
    ```

---

## 🚀 Usage

The project can be run using Docker Compose or by running each service individually.

### 🔹 Using Docker Compose

For an easy setup, use Docker Compose:

1. Ensure Docker and Docker Compose are installed.
2. Copy the provided `.env.example` to a `.env` file and configure environment variables:

    ```bash
    cp .env.example .env
    ```

3. Run the following command to start all services:

    ```bash
    docker-compose up -d --build
    ```

4. Access the frontend application at `http://localhost/`.

---

## ✅ Features

-   [x] Expense Tracking: Log daily expenses and categorize them.
-   [x] Financial Reporting: Generate detailed reports for financial analysis.
-   [ ] Insights & Analytics: Gain actionable financial insights.

---

## 🔮 Future Work

Planned enhancements include:

-   [ ] Additional Financial Tools: Expanding features to include investments and savings tracking.
-   [ ] Illustrations & Diagrams: Adding visual representations for financial data.
-   [ ] Use Prophet or ARIMA for forecasting: Implementing time series forecasting for financial insights instead of simple averages.

---

## 🤝 Contributing

Contributions are welcome! To contribute to the project, follow these steps:

-   Fork the repository
-   Create a new branch
-   Make your changes
-   Commit your changes
-   Push to the branch
-   Submit a pull request

---

## 📬 Contact

For inquiries, reach out to:

-   Ahmed Mahgoub - [GitHub](https://github.com/ahm282)

For commit history and updates, visit the [commits page](https://github.com/ahm282/wallet/commits).
