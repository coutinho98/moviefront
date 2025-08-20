import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';

const MovieList = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('http://localhost:3000/movies');
                if (!response.ok) {
                    throw new Error('Falha na resposta da rede.');
                }
                const data = await response.json();
                setMovies(data);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Ocorreu um erro desconhecido.');
                }
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    if (loading) {
        return <div className="text-white text-center p-8">Carregando filmes...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-8">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 bg-gray-800 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Lista de Filmes</h1>
                <button
                    onClick={() => navigate('/movies/new')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Adicionar Novo Filme
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie: Movie) => (
                    <div key={movie.id} className="bg-gray-700 p-4 rounded-lg shadow-lg text-white">
                        <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                        <p className="text-sm text-gray-400">
                            Pontuação Média: {movie.averageScore.toFixed(1)}/10
                        </p>
                        <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                            <div
                                className="bg-indigo-500 h-2.5 rounded-full"
                                style={{ width: `${movie.percentage.toFixed(0)}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MovieList;