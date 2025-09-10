// src/pages/MainAppScreen.tsx
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
    const [searchTerm, _setSearchTerm] = useState('');

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

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <p>Por favor, faça o login.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <p>Carregando filmes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <p className="text-red-500">Erro: {error}</p>
            </div>
        );
    }

    const sidebarWidth = isSidebarCollapsed ? 'w-[60px]' : 'w-64';

    return (
        <div className="flex h-screen dark:bg-[#0A0A0A] dark:text-white bg-white text-black spiderman:bg-red-500 spiderman:text-blue-200 text-foreground font-embed">
            <div className={`fixed h-screen ${sidebarWidth} transition-all duration-300 z-10`}>
                <MySidebar
                    isCollapsed={isSidebarCollapsed}
                    onToggle={handleToggleSidebar}
                    onAddMovieClick={handleOpenAddModal}
                />
            </div>

            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'ml-[60px]' : 'ml-64'
                }`}>


                <main className="flex-1 overflow-auto p-6">
                    {filteredMovies.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <h3 className="text-lg font-medium mb-2">
                                    {searchTerm ? 'Nenhum filme encontrado' : 'Nenhum filme na coleção'}
                                </h3>
                                <p className="text-sm">
                                    {searchTerm
                                        ? 'Tente buscar por outro termo'
                                        : 'Adicione filmes à sua coleção'
                                    }
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <p className="text-lg text-muted-foreground">
                                    {filteredMovies.length} Filme{filteredMovies.length !== 1 ? 's' : ''} {searchTerm && 'encontrado'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
                                {filteredMovies.map((movie) => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                        API_KEY={API_KEY}
                                        onClick={() => handleOpenMovieDetail(movie.id)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </main>
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