import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { MySidebar } from "../components/Sidebar";
import MovieCard from "../components/MovieCard";
import type { Movie } from "../types/movie";

export const MainAppScreen = () => {
    const { isAuthenticated } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        <div className="h-screen w-full flex bg-black">
            <MySidebar onAddMovieSuccess={fetchMovies} />
            <div className="flex-1 overflow-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
    );
};