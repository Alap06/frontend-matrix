import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layouts
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Pages - Auth
import HomePage from './pages/HomePageNew'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Pages - Student Dashboard
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import StudentDocuments from './pages/student/StudentDocuments'
import StudentGrades from './pages/student/StudentGrades'
import StudentAbsences from './pages/student/StudentAbsences'
import StudentClubs from './pages/student/StudentClubs'
import StudentReclamations from './pages/student/StudentReclamations'
import StudentSchedule from './pages/student/StudentSchedule'

// Pages - Teacher Dashboard
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherClasses from './pages/teacher/TeacherClasses'
import TeacherGrades from './pages/teacher/TeacherGrades'
import TeacherAbsences from './pages/teacher/TeacherAbsences'
import TeacherReclamations from './pages/teacher/TeacherReclamations'
import TeacherDocuments from './pages/teacher/TeacherDocuments'
import TeacherProfile from './pages/teacher/TeacherProfile'

// Pages - Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDocuments from './pages/admin/AdminDocuments'
import AdminClubs from './pages/admin/AdminClubs'
import AdminReclamations from './pages/admin/AdminReclamations'
import AdminSchedule from './pages/admin/AdminSchedule'
import AdminProfile from './pages/admin/AdminProfile'

// Pages - Club Manager Dashboard
import ClubManagerDashboard from './pages/club-manager/ClubManagerDashboard'
import ClubManagerClub from './pages/club-manager/ClubManagerClub'
import ClubManagerEvents from './pages/club-manager/ClubManagerEvents'
import ClubManagerReports from './pages/club-manager/ClubManagerReports'
import ClubManagerAnnouncements from './pages/club-manager/ClubManagerAnnouncements'
import ClubManagerProfile from './pages/club-manager/ClubManagerProfile'
import ClubManagerReclamations from './pages/club-manager/ClubManagerReclamations'

// Pages - Scolar Administrator Dashboard
import ScolarDashboard from './pages/scolar-admin/ScolarDashboard'
import ScolarDocuments from './pages/scolar-admin/ScolarDocuments'
import ScolarReclamations from './pages/scolar-admin/ScolarReclamations'
import ScolarProfile from './pages/scolar-admin/ScolarProfile'

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout userType="student" />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="documents" element={<StudentDocuments />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="absences" element={<StudentAbsences />} />
          <Route path="clubs" element={<StudentClubs />} />
          <Route path="reclamations" element={<StudentReclamations />} />
          <Route path="schedule" element={<StudentSchedule />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <DashboardLayout userType="teacher" />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="grades" element={<TeacherGrades />} />
          <Route path="absences" element={<TeacherAbsences />} />
          <Route path="documents" element={<TeacherDocuments />} />
          <Route path="reclamations" element={<TeacherReclamations />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin', 'administrator']}>
              <DashboardLayout userType="admin" />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="clubs" element={<AdminClubs />} />
          <Route path="reclamations" element={<AdminReclamations />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Club Manager Routes */}
        <Route
          path="/club-manager"
          element={
            <ProtectedRoute allowedRoles={['club_manager']}>
              <DashboardLayout userType="club_manager" />
            </ProtectedRoute>
          }
        >
          <Route index element={<ClubManagerDashboard />} />
          <Route path="club" element={<ClubManagerClub />} />
          <Route path="events" element={<ClubManagerEvents />} />
          <Route path="reports" element={<ClubManagerReports />} />
          <Route path="announcements" element={<ClubManagerAnnouncements />} />
          <Route path="profile" element={<ClubManagerProfile />} />
          <Route path="reclamations" element={<ClubManagerReclamations />} />
        </Route>

        {/* Scolar Administrator Routes */}
        <Route
          path="/scolar"
          element={
            <ProtectedRoute allowedRoles={['scolar_administrator']}>
              <DashboardLayout userType="scolar_administrator" />
            </ProtectedRoute>
          }
        >
          <Route index element={<ScolarDashboard />} />
          <Route path="documents" element={<ScolarDocuments />} />
          <Route path="reclamations" element={<ScolarReclamations />} />
          <Route path="profile" element={<ScolarProfile />} />
        </Route>

        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

