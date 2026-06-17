import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskDashboard from './pages/TaskDashboard';
const API = 'http://localhost:5000/api';
function App() {
  const { user, logout } = useAuth();
  const [view, setView] = useState('login');
  useEffect(() => {
    if (user) setView('dashboard');
  }, [user]);
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              T
            </div>
            <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          
          {user && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-medium text-gray-900">Hello, {user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
            </div>
          )}
        </div>
      </nav>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {!user ? (
          view === 'login' ? 
            <Login switchToRegister={() => setView('register')} /> : 
            <Register switchToLogin={() => setView('login')} />
        ) : (
          <TaskDashboard />
        )}
      </div>
    </div>
  );
}
export default App;