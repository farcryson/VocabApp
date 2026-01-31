# Adaptive Vocabulary Builder (Full Stack)

## Overview
A smart learning application that uses a weighted probability algorithm to optimize vocabulary retention. Unlike standard flashcards, this app tracks your error history and dynamically serves the words you struggle with most, transitioning from passive recognition (Multiple Choice) to active recall (Short Answer).

## Tech Stack
* **Frontend:** React.js, React Context API, Axios, CSS3, Vite
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Auth:** Google OAuth 2.0 + JWT

## Key Features
* **Weighted Spaced Repetition:** Implemented a custom selection algorithm ($Probability \propto \frac{1}{1 + TotalAttempts} \times (1 + IncorrectCount)$) that prioritizes difficult words during quiz sessions.
* **Hybrid Quiz Modes:**
  * **Recognition Mode:** Multiple choice questions for new or difficult words.
  * **Recall Mode:** Short-answer input with self-verification logic for mastered words.
* **Secure Authentication:** Utilized Google Identity Services for one-tap login, exchanging the credential for a secure, stateless JWT session.
* **Global State Management:** Leveraged useContext to manage user sessions and word lists globally, preventing prop-drilling and ensuring instant UI updates across routes.

## How to Run

### 1. Prerequisites
* **Node.js** and **npm** installed.
* A running instance of the **Backend Server** (locally or deployed).
* A **Google Cloud Console** project (for OAuth Client ID).

### 2. Installation
Clone the repository and install dependencies in the root directory:

```bash
git clone https://github.com/farcryson/VocabApp.git
cd VocabApp
npm install
```

### 3. Environment Setup
Create a .env file in the root directory (same level as package.json) and add the following keys:
```bash
# The URL where your backend server is running (e.g., http://localhost:3000)
VITE_BACKEND_URL=your_backend_url_here

# Your Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```
### 4.Start the Application
Run the development server:
```bash
npm run dev
```
Open your browser to the local URL provided by Vite (usually http://localhost:5173).
