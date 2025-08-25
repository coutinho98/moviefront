import React, { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';
import { cn } from '../utils/cn';

interface MovieSearchFormProps {
    onMovieSelected: (movie: Movie) => void;
    onClose: () => void;
    API_KEY: string;
}

const MovieSearchForm: React.FC<MovieSearchFormProps> = ({ onMovieSelected, onClose, API_KEY }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<any | null>(null);

    const searchMovies = async () => {
        if (query.trim() === '') return;

        setLoading(true);
        setResults([]);
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            setResults(data.results || []);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectMovie = (movie: any) => {
        setSelectedMovie(movie);
    };

    const handleAddMovie = () => {
        if (selectedMovie) {
            const movieToAdd: Movie = {
                id: selectedMovie.id,
                title: selectedMovie.title,
                totalPoints: 0,
                numVotes: 0,
                averageScore: 0,
                percentage: 0,
            }
            onMovieSelected(movieToAdd);
            onClose();
        }
    };

    return (
        <div className="p-4">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchMovies()}
                placeholder="Pesquisar por filme..."
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
            <button
                onClick={searchMovies}
                className="mt-2 w-full rounded-md bg-blue-600 p-2 text-white hover:bg-blue-700 focus:outline-none"
            >
                Buscar
            </button>

            {loading && <p className="mt-4 text-center text-neutral-400">Carregando...</p>}

            <div className="mt-4 max-h-64 overflow-y-auto">
                {results.map((movie) => (
                    <div
                        key={movie.id}
                        className={cn(
                            "flex items-center space-x-4 p-2 cursor-pointer hover:bg-neutral-800 rounded-lg",
                            selectedMovie?.id === movie.id && "bg-blue-600"
                        )}
                        onClick={() => handleSelectMovie(movie)}
                    >
                        {movie.poster_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/w92/${movie.poster_path}`}
                                alt={movie.title}
                                className="h-16 w-12 object-cover rounded-md"
                            />
                        )}
                        <div>
                            <p className="text-white font-semibold">{movie.title}</p>
                            <p className="text-neutral-400 text-sm">{movie.release_date}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedMovie && (
                <button
                    onClick={handleAddMovie}
                    className="mt-4 w-full rounded-md bg-green-600 p-2 text-white hover:bg-green-700 focus:outline-none"
                >
                    Adicionar {selectedMovie.title}
                </button>
            )}
        </div>
    );
};

export default MovieSearchForm;