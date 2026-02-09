import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LowDataModeProvider } from './context/LowDataModeContext';

// Pages
import HomePage from './pages/HomePage';
import FormationsPage from './pages/FormationsPage';
import FormationDetailPage from './pages/FormationDetailPage';
import ChapitrePage from './pages/ChapitrePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminFormationsPage from './pages/AdminFormationsPage';
import AdminFormationFormPage from './pages/AdminFormationFormPage';
import AdminChapitresPage from './pages/AdminChapitresPage';
import AdminChapitreFormPage from './pages/AdminChapitreFormPage';
import AdminFeedbacksPage from './pages/AdminFeedbacksPage';

// Composants
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <AuthProvider>
      <LowDataModeProvider>
        <Router>
          <Navbar />
          
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/formations" element={<FormationsPage />} />
            <Route path="/formations/:formationId" element={<FormationDetailPage />} />
            <Route path="/learn/:id" element={<ChapitrePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Routes d'administration protégées */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="formations" element={<AdminFormationsPage />} />
              <Route path="formations/new" element={<AdminFormationFormPage />} />
              <Route path="formations/:formationId/edit" element={<AdminFormationFormPage />} />
              <Route path="formations/:formationId/chapitres" element={<AdminChapitresPage />} />
              <Route path="formations/:formationId/chapitres/new" element={<AdminChapitreFormPage />} />
              <Route path="formations/:formationId/chapitres/:chapitreId/edit" element={<AdminChapitreFormPage />} />
              <Route path="feedbacks" element={<AdminFeedbacksPage />} />
            </Route>

          </Routes>
          <ChatWidget />
        </Router>
      </LowDataModeProvider>
    </AuthProvider>
  );
}

export default App;
