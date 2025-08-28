import React from 'react';
import type { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="bg-neutral-800 rounded-lg p-4 shadow-lg text-white flex flex-col items-center">
      {movie.posterUrl && (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full rounded-md mb-2 object-cover"
          style={{ height: '300px' }}
        />
      )}
      <h3 className="text-lg font-bold text-center mt-2">{movie.title}</h3>
      <p className="text-sm mt-1">Pontuação Média: {movie.averageScore.toFixed(1)} ({movie.percentage.toFixed(0)}%)</p>
      <p className="text-sm">Total de Votos: {movie.numVotes}</p>
    </div>
  );
};

export default MovieCard;