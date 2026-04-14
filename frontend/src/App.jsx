import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastProvider } from './components/ToastContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Members from './pages/Members.jsx';
import MemberForm from './pages/MemberForm.jsx';
import Payments from './pages/Payments.jsx';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 p-6 bg-gray-100 min-h-[calc(100vh-56px)]">
                        <Routes>
                          <Route path="dashboard" element={<Dashboard />} />
                          <Route path="members" element={<Members />} />
                          <Route path="members/new" element={<MemberForm />} />
                          <Route path="members/:id/edit" element={<MemberForm />} />
                          <Route path="payments" element={<Payments />} />
                          <Route path="" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
