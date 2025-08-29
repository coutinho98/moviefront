import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TiltedCard from './TiltedCard/TiltedCard';
import type { Movie } from '../types/movie';
import type { TmdbMovie } from '../types/tmdb';

interface MovieCardProps {
    movie: Movie;
    API_KEY: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, API_KEY }) => {
    const [posterUrl, setPosterUrl] = useState<string | null>(null);

    useEffect(() => {
        if (movie.posterUrl) {
            setPosterUrl(`https://image.tmdb.org/t/p/w500${movie.posterUrl}`);
            return;
        }
        
        const fetchPoster = async () => {
            if (movie.title && API_KEY) {
                try {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}&api_key=${API_KEY}`
                    );
                    const data = await response.json();
                    if (data.results && data.results.length > 0) {
                        const tmdbMovie: TmdbMovie = data.results[0];
                        if (tmdbMovie.poster_path) {
                            setPosterUrl(`https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch poster from TMDB:", error);
                }
            }
        };

        fetchPoster();
    }, [movie.title, API_KEY, movie.posterUrl]);

    return (
        <Link to={`/movies/${movie.id}`} className="block">
            <div className="flex flex-col items-center">
                {posterUrl ? (
                    <TiltedCard
                        imageSrc={posterUrl}
                        altText={movie.title}
                        captionText={movie.title}
                        containerHeight="300px"
                        containerWidth="200px"
                        imageHeight="300px"
                        imageWidth="200px"
                        rotateAmplitude={12}
                        scaleOnHover={1.2}
                        showMobileWarning={false}
                        showTooltip={false}
                        displayOverlayContent={true}
                    />
                ) : (
                    <div
                        className="w-full rounded-md mb-2 flex items-center justify-center bg-neutral-700 text-neutral-400"
                        style={{ height: '300px', width: '200px' }}
                    >
                        Sem Imagem
                    </div>
                )}
                <h3 className="text-lg font-bold text-center mt-2 text-white">{movie.title}</h3>
            </div>
        </Link>
    );
};

export default MovieCard;