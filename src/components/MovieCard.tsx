import React from 'react';
import { Link } from 'react-router-dom';
import TiltedCard from './TiltedCard/TiltedCard';
import type { Movie } from '../types/movie';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const posterUrl = movie.posterUrl
        ? `https://image.tmdb.org/t/p/w500${movie.posterUrl}`
        : null;

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