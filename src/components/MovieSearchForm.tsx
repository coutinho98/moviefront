import React, { useState, useEffect } from 'react';
import type { TmdbMovie } from '../types/tmdb';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface MovieSearchFormProps {
    onMovieSelected: (movie: { title: string }) => void;
    onClose: () => void;
    API_KEY: string;
}

const MovieSearchForm: React.FC<MovieSearchFormProps> = ({ onMovieSelected, onClose, API_KEY }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<TmdbMovie[]>([]);

    useEffect(() => {
        if (searchTerm.length > 2) {
            const fetchMovies = async () => {
                const response = await fetch(
                    `https://api.themoviedb.org/3/search/movie?query=${searchTerm}&api_key=${API_KEY}&language=pt-BR`
                );
                const data = await response.json();
                setSearchResults(data.results || []);
            };
            const handler = setTimeout(fetchMovies, 500);
            return () => clearTimeout(handler);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm, API_KEY]);

    const handleSelectMovie = (movie: TmdbMovie) => {
        onMovieSelected({ title: movie.title });
        onClose();
    };

    return (
        <div className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Buscar filme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-neutral-700 bg-neutral-800 p-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
                <ul className="max-h-60 overflow-y-auto rounded-md border border-neutral-700 bg-neutral-800">
                    {searchResults.map((movie) => (
                        <li
                            key={movie.id}
                            className="flex cursor-pointer items-center gap-4 p-2 text-white hover:bg-neutral-700"
                            onClick={() => handleSelectMovie(movie)}
                        >
                            {movie.poster_path && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                    alt={movie.title}
                                    className="h-12 w-8 object-cover rounded-sm"
                                />
                            )}
                            <span>{movie.title}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MovieSearchForm;
