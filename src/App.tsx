import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginScreen from './components/LoginScreen';
import './index.css';
import { MainAppScreen } from './pages/MainAppScreen';
import MovieDetailPage from './pages/MovieDetailPage'; // Importe o novo componente

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="h-screen w-full relative flex justify-center items-center bg-black text-white">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LoginScreen />}
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <MainAppScreen />
          </PrivateRoute>
        }
      />
      <Route
        path="/movies/:movieId"
        element={
          <PrivateRoute>
            <MovieDetailPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;