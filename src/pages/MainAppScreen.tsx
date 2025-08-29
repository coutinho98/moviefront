import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { MySidebar } from "../components/Sidebar";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";
import { AddMovieModal } from "../components/AddMovieModal";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const MainAppScreen = () => {
    const { isAuthenticated } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

    const fetchMovies = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/movies');
            if (!response.ok) {
                throw new Error('Falha ao buscar filmes.');
            }
            const data = await response.json();
            setMovies(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro inesperado.');
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

    return (
        <div className="relative min-h-screen w-full bg-black">
            <MySidebar onAddMovieClick={handleOpenModal} />
            <div className="overflow-auto p-4 pt-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} API_KEY={API_KEY} />
                    ))}
                </div>
            </div>
            <AddMovieModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAddMovieSuccess={fetchMovies}
            />
        </div>
    );
};