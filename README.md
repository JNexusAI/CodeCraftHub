# CodeCraftHub
# CodeCraftHub Server

This repository contains the server-side application for CodeCraftHub, a personalized learning platform built with Node.js, Express, and MongoDB. The development process is driven by prompts given to a generative AI to scaffold code for models, routes, tests, and deployment configurations.

## Key Features

- ✅ Secure user registration with password hashing (`bcrypt.js`).
- ✅ Automated API testing suite using Jest and Supertest against an in-memory MongoDB server.
- ✅ Full containerization with a multi-stage `Dockerfile` for a lightweight, production-ready image.
- ✅ Structured and scalable project layout (`src/models`, `src/controllers`, `src/routes`).

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Testing:** Jest, Supertest, mongodb-memory-server
- **Containerization:** Docker
- **Utilities:** `bcrypt.js`, `dotenv`

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

### User Routes

- **`POST /api/users`**: Register a new user.
  - **Request Body:**
    ```json
    {
      "username": "someuser",
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Success Response (`201 Created`):**
    ```json
    {
      "_id": "some_object_id",
      "username": "someuser",
      "email": "user@example.com",
      "enrolledCourses": []
    }
    ```

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

-   **Port Conflicts:** The application port was changed from `8000` to `5050` due to a local conflict with the `Splunkd` service. If you encounter connection errors, ensure the configured port is not in use by another application.

-   **Nodemon Startup Error:** An initial error `Error: Cannot find module '...index.js'` was resolved by changing the `"main"` entry in `package.json` from the default `"index.js"` to `"server.js"`. This prevents `nodemon` from trying to run two entry point files.

-   **VS Code API Testing:** For manual API testing within VS Code, the **"REST Client"** extension (by Huachao Mao) is required to enable the "Send Request" functionality in `.http` files.