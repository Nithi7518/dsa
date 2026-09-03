# DSA Study Buddy 🚀

An interactive Data Structures and Algorithms (DSA) learning platform featuring an AI-powered Socratic Tutor. Built to simulate a real coding interview environment, this application provides dynamic hints, code evaluation, and complexity analysis without just giving away the answers.

## ✨ Features

- **Professional Code Editor:** Integrated with Monaco Editor (the engine behind VS Code) for syntax highlighting, auto-indentation, and bracket matching.
- **Multi-Language Support:** Solve problems in Java, Python, C++, C, or JavaScript with auto-generated boilerplate code.
- **Socratic AI Tutor:** Integrated with Google's Gemini API. The AI acts as a tutor—analyzing your code, pointing out flaws, and providing strategic hints rather than just giving you the solution.
- **Complexity Analysis:** Automatically evaluates the Time and Space complexity (Big-O) of your submitted solutions.
- **Resilient AI Fallbacks:** Includes a "Mock Mode" that guarantees the UI and learning flow never break, even if the AI API is rate-limited or unavailable.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Monaco Editor
- **Backend:** Java 17, Spring Boot 3.2, Spring Data JPA, Spring WebFlux
- **Database:** PostgreSQL (Neon Serverless DB)
- **AI Engine:** Google Gemini API

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java JDK (17+)
- Maven
- A Gemini API Key (from Google AI Studio)

### 1. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```
Update the `application.yml` file with your Gemini API key (or set it as an environment variable):
```yaml
gemini:
  api:
    key: YOUR_API_KEY_HERE
```
Run the Spring Boot server:
```bash
mvn spring-boot:run
```
*The backend will run on `http://localhost:8080`.*

### 2. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
```
Install dependencies and start the development server:
```bash
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

## 🔒 Architecture & Security Note
The frontend **never** communicates directly with the Gemini API. All AI requests are securely proxied through the Spring Boot backend to ensure that the API keys remain hidden from the client-side browser.
