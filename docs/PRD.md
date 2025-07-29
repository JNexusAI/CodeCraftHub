# Product Requirements Document: CodeCraftHub v1.0

* **Status:** Final
* **Author:** JNexusAI
* **Version:** 1.1
* **Last Updated:** July 29, 2025

## 1. Introduction & Problem Statement

Software developers at all levels struggle to find efficient, structured learning paths. Generic, one-size-fits-all online courses often waste time covering known topics or fail to address specific knowledge gaps. This leads to frustration, slow skill acquisition, and a disjointed learning experience.

**CodeCraftHub** will solve this by being a deeply personalized learning platform. By leveraging Generative AI, we will eventually provide tailored recommendations and adaptive learning paths that respect a developer's existing knowledge and target their specific goals.

This document outlines the requirements for **v1.0**, the Minimum Viable Product (MVP) designed to establish the foundational services for user management and course content management.

## 2. Goals & Success Metrics

The primary goal of v1.0 is to validate our core hypothesis: that we can build a robust platform that attracts both content creators (instructors) and learners.

### **Product Goals**
* Create a secure and stable foundation for user accounts and content.
* Provide a seamless experience for instructors to create and list courses.
* Establish a core user base of early adopters.

### **Success Metrics (KPIs)**
* **Activation:** Achieve **1,000 activated users** (defined as users who complete registration and either create their first course or view at least three courses) within 3 months of launch.
* **Engagement:** At least **50 new, unique courses created** by the community within the first 3 months.
* **Technical Performance:** **P95 API response time under 200ms** for all endpoints under a simulated load of 50 concurrent users.

## 3. Target Audience & User Personas
* **Persona 1: The Learner ("Jessica, the Junior Developer")**
    * **Description:** A recent computer science graduate or career-changer with 0-2 years of experience.
    * **Goals:** Learn specific technologies required for a new project; build a strong foundational knowledge to accelerate her career.
    * **Frustrations:** Information overload; tutorials that are too basic or too advanced; uncertainty about what to learn next.

* **Persona 2: The Instructor ("David, the Senior Engineer")**
    * **Description:** A seasoned developer with 10+ years of experience who wants to share his knowledge.
    * **Goals:** Mentor others; build a personal brand; create high-quality, focused educational content.
    * **Frustrations:** Existing platforms have clunky course creation tools; it's difficult to create content that adapts to different learner levels.

---
## 4. Technical Architecture & System Design

### **4.1. Architecture Overview**
For v1.0, the system will be a **modular monolithic API** built with Node.js/Express, designed to be easily broken out into microservices in future iterations. All data will be stored in a single MongoDB Atlas database.

### **4.2. Database Schema Design**
**User Model (`user.model.js`)**
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
}
```

**Course Model (`course.model.js`)**
```javascript
{
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
```

### **4.3. API Specifications**
All API responses will use a standard JSON format. A standard error response format will be `{ "message": "Descriptive error message" }`.

| Endpoint | Method | Access | Success Response | Error Responses |
| :--- | :--- | :--- | :--- | :--- |
| `/api/users` | `POST` | Public | `201 Created` - User object + JWT | `400 Bad Request` |
| `/api/users/login` | `POST` | Public | `200 OK` - User object + JWT | `401 Unauthorized` |
| `/api/courses` | `GET` | Public | `200 OK` - Array of course objects | `500 Server Error` |
| `/api/courses` | `POST` | Private | `201 Created` - New course object | `401 Unauthorized`, `400 Bad Request`|

### **4.4. Security & Performance Constraints**
* **Authentication:** All private endpoints must be protected via JWT Bearer Token authentication. JWTs will have an expiration of **30 days**.
* **Input Validation:** All incoming request bodies must be validated. String inputs will have length limits to prevent abuse.
* **CORS:** The API will implement a CORS policy to only allow requests from whitelisted frontend domains.
* **Rate Limiting:** A global rate limit of 100 requests per minute per IP address will be enforced.

---
## 5. Product Features & User Stories (v1.0)

### **Feature 1: User Authentication Service**
* **User Story 1.1:** As a new user, I want to register for an account using a unique username, email, and a secure password, so I can join the platform.
* **User Story 1.2:** As a returning user, I want to log in with my email and password to receive an authentication token for accessing private features.
* **Edge Cases:**
    * Attempting to register with an email or username that already exists will result in a `400 Bad Request` error.
    * Submitting incomplete data (e.g., no password) will result in a `400 Bad Request` error.

### **Feature 2: Course Management Service**
* **User Story 2.1:** As an instructor (logged-in user), I want to create a new course by providing a title, description, and category.
* **User Story 2.2:** As any user, I want to view a list of all available courses to see what the platform offers.
* **Edge Cases:**
    * Attempting to create a course with a title that already exists will result in a `400 Bad Request` error.
    * Attempting to create a course without being authenticated will result in a `401 Unauthorized` error.

---

## 6. User Experience & Design

For v1.0, this is an API-first project. However, the API design should assume it will be consumed by a modern Single-Page Application (SPA).
* **Error Handling:** API errors will be presented to the frontend in a consistent JSON format (`{ "message": "..." }`) for easy display.
* **Accessibility:** The future frontend consuming this API should target **WCAG 2.1 Level AA** compliance.

## 7. Data & Privacy

* **Data Retention:** User and course data will be retained indefinitely until a user requests account deletion.
* **Privacy Compliance (GDPR/CCPA):** For v1.0, we will ensure the user's right to be forgotten. A documented internal process will be created for manually handling account deletion requests upon user contact.
* **Data Validation Rules:**
    * Password must be a minimum of 8 characters.
    * Course titles are limited to 100 characters.
    * Course descriptions are limited to 5,000 characters.

## 8. Testing Strategy

* **Unit Tests:** Key business logic within controllers and services should have a minimum of **80% unit test coverage**.
* **Integration Tests:** The full API request/response cycle for every endpoint will be tested, covering both success and failure cases (as implemented in `user.test.js`).
* **User Acceptance Testing (UAT):** A manual testing phase will be conducted against the staging environment using the `requests.http` file to validate all user stories.

## 9. Operational Requirements

* **Deployment:** The application will be deployed via Docker containers. A `staging` environment will be used for testing, and a `production` environment will host the live application. (Cloud Provider TBD, e.g., Heroku, AWS).
* **Monitoring & Logging:** Log all API requests (method, path, status code, response time) and any application errors. Set up basic alerting for >1% server error rates.
* **Backup & Disaster Recovery:** Data backups will be managed by the cloud database provider (MongoDB Atlas), with point-in-time recovery enabled.

## 10. Risk Assessment & Mitigation

* **Technical Risk:** Security vulnerabilities in dependencies.
    * **Mitigation:** Implement automated dependency scanning (e.g., `npm audit`, GitHub Dependabot).
* **Business Risk:** Low instructor adoption leads to a lack of content.
    * **Mitigation:** Manually onboard and support the first 10 instructors. Create high-quality documentation for the course creation process.

## 11. Dependencies & Integration Points

* **Third-Party Services (Future):** An email service (e.g., SendGrid) will be required for password resets (v1.1). An analytics service (e.g., Mixpanel) will be needed to track KPIs.

## 12. Rollout & Launch Plan

1.  **Phase 1 (Internal):** Deploy to staging environment. Conduct internal UAT.
2.  **Phase 2 (Alpha):** Invite a closed group of 10-20 "founding instructors" to create initial content.
3.  **Phase 3 (Public Launch):** Open user registration to the public.

---
## 13. Out of Scope (v1.0)

* Course updates and deletion via the API.
* User account deactivation or profile updates via the API.
* The AI-powered recommendation engine.
* Course enrollment and progress tracking.
* Interactive coding exercises.
* Payments, subscriptions, search, and content moderation.
* File/video uploads for course materials (content is text-only for v1.0).
* Multi-language support (English only).

## 14. Open Questions
* Which cloud provider will we use for hosting the application and database?
* What is the marketing and communication plan for attracting our alpha instructors?

## 15. User Journey Maps

### **Journey 1: New Instructor Course Creation**
1.  **Discovery:** David hears about CodeCraftHub from a blog post.
2.  **Registration:** He visits the (future) website, signs up with his email and password, and receives a JWT.
3.  **Creation:** Using the API (via the future frontend), he makes a `POST` request to `/api/courses`, including his JWT, and successfully creates his first course.
4.  **Verification:** He makes a `GET` request to `/api/courses` and sees his new course listed.

### **Journey 2: New Learner Course Discovery**
1.  **Discovery:** Jessica is looking for a Docker tutorial and lands on the CodeCraftHub website.
2.  **Exploration:** She makes a `GET` request to `/api/courses` and sees David's "Introduction to Docker" course.
3.  **Activation:** Intrigued by the platform, she decides to sign up by making a `POST` request to `/api/users`.

## 16. v1.1 Preview

The immediate next version will focus on user engagement by introducing:
* **Course Enrollment:** Allowing users to enroll in courses.
* **User Profiles:** Basic profile pages showing created and enrolled courses.
* **API-based Course Updates:** Allowing instructors to edit their course content.