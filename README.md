# ZAKSOFT Learn Monorepo — Development README

This document provides instructions for setting up and running the ZAKSOFT Learn application locally. This project is structured as a monorepo, separating the backend and frontend into distinct directories.

## Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local instance or via Docker)

## Local Setup

### 1. Start MongoDB
It's recommended to use Docker for a quick setup:
```powershell
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```
Alternatively, install MongoDB Community on your local machine and ensure the service is running.

### 2. Environment Variables
Create a `.env` file in the `backend` directory and add the following variables. A strong, randomly generated string should be used for `CSRF_SECRET` and `JWT_SECRET`.
```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/zaksoft-learn
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=1h
CSRF_SECRET=your_32_character_secret_key_here
COOKIE_SECRET=your_cookie_signing_secret_here
```
**Important**: The `CSRF_SECRET` must be exactly 32 characters long. The `COOKIE_SECRET` can be any strong string and is used for signing cookies.

### 3. Install Dependencies
From the project root, install dependencies for both backend and frontend:
```powershell
npm run install-backend
npm run install-frontend
```
Alternatively, you can navigate into each directory (`backend` and `frontend`) and run `npm install` manually.

### 4. Seed the Database (Optional)
The project includes sample data for formations, certifications, and projects. To import this data, run from the project root:
```powershell
npm run import
```
To destroy the data, run:
```powershell
npm run destroy
```

### 5. Start the Application
From the project root, start the backend server:
```powershell
npm start
```
The backend server will serve the frontend static files and the API will be available at `http://localhost:3000`.

## Implemented Features

The following pages have been developed and connected to the backend API:

-   **Certifications (`/certifications.html`)**: Shows the available certifications. If a certification is linked to a quiz, a "Take the Quiz" button is displayed.
-   **Dashboard (`/dashboard.html`)**: A personalized user dashboard that requires login. The associated authentication pages (Login, Register, Forgot Password, Reset Password) are now fully integrated and functional, ensuring a complete user authentication flow. It displays:
    -   User profile information (email, role, XP, level).
    -   Progress in the courses.
    -   Certifications obtained, with an option to download a PDF certificate.
-   **Formations (`/formations.html`)**: Displays a list of available training courses from the database. Each course has a "Start Learning" button that redirects to the corresponding learning page.
-   **Learn (`/learn.html`)**: The main learning interface. It displays the lessons for a specific formation, tracks completion progress (frontend only for now), and provides a link to the certification quiz if available.
-   **Projets (`/projets.html`)**: Lists practical projects that users can explore to build their portfolio.
-   **Quiz (`/quiz.html`)**: A fully functional quiz page that loads questions, handles submissions, and displays detailed results. It also checks for previous attempts.
-   **XP Points & Leaderboard System**:
    -   Users now earn XP for completing lessons (10 XP per lesson) and passing certification quizzes (100 XP per quiz).
    -   User level is calculated based on total XP.
    -   The Dashboard prominently displays the user's current XP, level, and progress towards the next level.
    -   A new "Classement" (`leaderboard.html`) page displays a paginated list of users sorted by XP and level, promoting healthy competition.

## Security
-   **Content Security Policy (CSP)**: A basic CSP is implemented using Helmet to mitigate cross-site scripting (XSS) attacks. For development, it allows scripts from `tailwindcss.com` and `unpkg.com`. For production, these should be replaced with a local build process.
-   **CSRF Protection**: The application uses `tiny-csrf` to protect against Cross-Site Request Forgery attacks on API endpoints that modify data.
-   **Authentication**: User authentication is handled using JSON Web Tokens (JWT) stored in secure, HttpOnly cookies.

## Next Steps
-   **Admin Panel (`/admin.html`)**: Develop the admin interface for managing courses, users, and other resources.
-   **User Progress**: Fully implement backend persistence for user lesson and course progress.

-   **Frontend Build Process**: Implement a frontend build process (e.g., using Webpack or Vite) to bundle assets, compile Tailwind CSS, and remove direct CDN links.
"# ZAKSOFT-Learn"  
Nous n'allons donc pas faire une migration, mais nous allons utiliser l'analyse précédente comme un cahier des charges fonctionnel pour construire une nouvelle application web moderne.

  Le plan est donc le suivant :
   * Backend : Nous construirons une API serverless en utilisant l'écosystème Firebase (Firestore, Firebase Authentication, Cloud Functions).
   * Frontend : Nous construirons une interface utilisateur réactive et dynamique avec React.

  Considérez la description précédente comme la maquette fonctionnelle de notre objectif. Voici comment nous allons l'implémenter avec cette nouvelle architecture technique.

  ---

  Plan de Développement Détaillé

  Partie 1 : Le Backend sur Firebase (Notre "Cerveau" Serverless)

  La logique reste la même que dans l'analyse, mais nous la construirons directement sur Firebase.

   1. Authentification des Utilisateurs (`Firebase Authentication`) :
       * Nous activerons l'authentification par email/mot de passe.
       * Firebase gérera pour nous l'inscription, la connexion, la réinitialisation de mot de passe, et la sécurité des sessions. Il n'y aura pas de models/User.js avec un mot de passe à gérer.

   2. Base de Données (`Cloud Firestore`) :
       * Nous créerons des "collections" dans Firestore pour remplacer nos anciens modèles.
           * users : Pour stocker les informations de profil (nom, rôle), liées par l'ID unique de Firebase Auth.
           * formations, lessons, projets, certifications : Pour le contenu pédagogique.
           * quizzes, questions : Pour les évaluations.
           * userProgress : Pour suivre la progression des utilisateurs dans les cours.
       * La structure sera flexible comme MongoDB, mais avec les avantages du temps réel et de la scalabilité de Firebase.

   3. Logique Métier (`Cloud Functions`) :
       * Nous écrirons des fonctions JavaScript/TypeScript qui s'exécuteront sur les serveurs de Google.
       * Exemples de fonctions :
           * api-getFormations : Une fonction HTTP qui lit et renvoie la liste des formations depuis Firestore.
           * api-updateUserProgress : Une fonction HTTP sécurisée qui met à jour la progression d'un utilisateur après la complétion d'une leçon.
           * api-checkQuiz : Une fonction qui évalue les réponses d'un quiz et retourne le score.

  Partie 2 : Le Frontend avec React (Notre Interface Utilisateur Moderne)

  C'est ici que le changement est le plus significatif. Au lieu de multiples fichiers HTML, nous allons construire une Single Page Application (SPA).

   1. Initialisation du Projet (`Vite + React`) :
       * Nous utiliserons un outil moderne comme Vite pour créer un nouveau projet React. C'est rapide et efficace.
       * La commande sera : npm create vite@latest zaksoft-learn-frontend -- --template react (ou react-ts si nous voulons utiliser TypeScript pour plus de robustesse).

   2. Architecture en Composants :
       * Le cœur de React est de tout penser en "composants" réutilisables.
       * src/components/ : Dossier pour les petits éléments réutilisables : Button.jsx, Card.jsx, Header.jsx, Footer.jsx. (Remplace le dossier includes/).
       * src/pages/ : Dossier pour les composants qui représentent une page entière : HomePage.jsx, LoginPage.jsx, DashboardPage.jsx, FormationDetailPage.jsx. (Remplace les fichiers .html).

   3. Gestion des Routes (`React Router DOM`) :
       * Il n'y aura qu'un seul fichier index.html. La navigation sera gérée par JavaScript.
       * Nous installerons la bibliothèque react-router-dom.
       * Nous définirons un routeur qui associe une URL (/login, /dashboard) à un composant de page (<LoginPage />, <DashboardPage />).
       * Nous créerons des Routes Protégées : un composant spécial qui vérifiera si l'utilisateur est connecté avant d'afficher des pages comme le Dashboard. (Remplace auth-guard.js).

   4. Gestion de l'État Global (`React Context` ou `Zustand/Redux`) :
       * Nous aurons besoin de partager des informations à travers toute l'application, notamment : "l'utilisateur est-il connecté ?" et "qui est l'utilisateur# ZAK-Learn
