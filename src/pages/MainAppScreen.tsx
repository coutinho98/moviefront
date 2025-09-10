import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { MySidebar } from "../components/Sidebar";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";
import { AddMovieModal } from "../components/AddMovieModal";
import MovieDetailModal from "../components/MovieDetailModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const MainAppScreen = () => {
    const { isAuthenticated } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleToggleSidebar = useCallback(() => setIsSidebarCollapsed(!isSidebarCollapsed), [isSidebarCollapsed]);
    const handleOpenAddModal = useCallback(() => setIsAddModalOpen(true), []);
    const handleCloseAddModal = useCallback(() => setIsAddModalOpen(false), []);
    const handleOpenMovieDetail = useCallback((id: string) => setSelectedMovieId(id), []);
    const handleCloseMovieDetail = useCallback(() => setSelectedMovieId(null), []);

    const fetchMovies = useCallback(async () => {
        try {
            const response = await fetch("https://movie-eckw.onrender.com/movies");
            if (!response.ok) {
                throw new Error("Falha ao buscar filmes.");
            }
            const data = await response.json();
            setMovies(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ocorreu um erro inesperado.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMovies();
        }
    }, [isAuthenticated, fetchMovies]);

    if (!isAuthenticated) {
        return <p>Por favor, faça o login.</p>;
    }

    if (loading) {
        return <p>Carregando filmes...</p>;
    }

    if (error) {
        return <p>Erro: {error}</p>;
    }

    const sidebarWidth = isSidebarCollapsed ? 'w-[60px]' : 'w-64';

    return (
        <div className="relative min-h-screen w-full bg-white flex">
            <div className={`fixed h-screen ${sidebarWidth} transition-all duration-300`}>
                <MySidebar 
                    isCollapsed={isSidebarCollapsed}
                    onToggle={handleToggleSidebar}
                    onAddMovieClick={handleOpenAddModal}
                />
            </div>
            <div className={`flex-1 overflow-auto p-4 md:pt-4 transition-all duration-300 ${isSidebarCollapsed ? 'ml-[60px]' : 'ml-64'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            API_KEY={API_KEY}
                            onClick={() => handleOpenMovieDetail(movie.id)}
                        />
                    ))}
                </div>
            </div>
            <AddMovieModal
                isOpen={isAddModalOpen}
                onClose={handleCloseAddModal}
                onAddMovieSuccess={fetchMovies}
            />
            <MovieDetailModal
                movieId={selectedMovieId}
                onClose={handleCloseMovieDetail}
            />
        </div>
    );
};