import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import DiscordLoginButton from "./components/discord";
import MovieList from "./components/movielist";
import AddMovie from "./components/addMovie";
import type { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-800">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/movies" /> : <DiscordLoginButton />} />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <MovieList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/new"
            element={
              <ProtectedRoute>
                <AddMovie />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper; 