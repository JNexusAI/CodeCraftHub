# CodeCraftHub Server

This repository contains the server-side application for CodeCraftHub, a personalized learning platform built with Node.js, Express, and MongoDB. It features a complete user authentication system (registration and login) and course management capabilities. The development process is driven by prompts given to a generative AI to scaffold code for models, routes, tests, and deployment configurations.

## Key Features

- ✅ Secure user registration and JWT-based authentication.
- ✅ Protected API routes using custom authentication middleware.
- ✅ CRUD operations for Courses (Create and Read implemented).
- ✅ Automated API testing suite using Jest and Supertest.
- ✅ Full containerization with a multi-stage `Dockerfile` for a lightweight, production-ready image.
- ✅ Well-documented code using JSDoc-style comments.

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Testing:** Jest, Supertest, mongodb-memory-server
- **Authentication:** JSON Web Tokens (JWT), bcrypt.js
- **Containerization:** Docker
- **Utilities:** `dotenv`

---

## Project Documentation

For a complete overview of the project's strategy, features, user personas, and technical specifications, please see the **[Product Requirements Document (PRD)](./docs/PRD.md)**.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd CodeCraftHub-Server
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create an environment file:**
    Create a file named `.env` in the project root and add your configuration variables.
    ```
    # The port for the server to run on
    PORT=5050

    # Your MongoDB Atlas connection string
    MONGODB_URI="mongodb+srv://..."

    # Your secret key for signing JWTs
    JWT_SECRET="your_generated_secret_key"
    ```

### Running the Application

- **Development Mode (with auto-reload):**
  ```sh
  npm run dev
  ```
  The server will be accessible at `http://localhost:5050`.

- **Run Automated Tests:**
  ```sh
  npm test
  ```

---

## API Endpoints

### User Routes (`/api/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Public | Register a new user. |
| `POST` | `/login` | Public | Authenticate a user and receive a JWT. |

### Course Routes (`/api/courses`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Get a list of all courses. |
| `POST` | `/` | Private | Create a new course. Requires Bearer Token. |

---

## Docker

You can build and run the application as a Docker container.

1.  **Build the image:**
    ```sh
    docker build -t codecrafthub-server .
    ```

2.  **Run the container:**
    This command runs the container in detached mode, maps the port, and injects the environment variables from your local `.env` file.
    ```sh
    docker run -d -p 5050:5050 --env-file .env codecrafthub-server
    ```

---

## Project Nuances & Gotchas

This section documents specific issues encountered and resolved during development.

-   **Port Conflicts (`EADDRINUSE`):** The server may fail to start if the port is in use. This was resolved by finding the conflicting process (`netstat -ano | findstr :<port>`) and stopping it (`taskkill /PID <PID> /F` on Windows) or by changing the `PORT` in the `.env` file.
-   **Nodemon Startup Error:** An initial error `Error: Cannot find module '...index.js'` was resolved by changing the `"main"` entry in `package.json` from the default `"index.js"` to `"server.js"`.
-   **VS Code API Testing:** For manual API testing within VS Code, the **"REST Client"** extension (by Huachao Mao) is required to enable the "Send Request" functionality in `.http` files.