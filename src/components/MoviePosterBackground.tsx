import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface MoviePosterBackgroundProps {
    movieIds: number[];
}

const MoviePosterBackground: React.FC<MoviePosterBackgroundProps> = ({ movieIds }) => {
    const [posters, setPosters] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPosters = async () => {
            const fetchedUrls: string[] = [];
            const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
            const TMDB_BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/w300';

            for (const id of movieIds) {
                try {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`
                    );
                    const data = await response.json();
                    if (data.poster_path) {
                        fetchedUrls.push(`${TMDB_BASE_IMAGE_URL}${data.poster_path}`);
                    }
                } catch (error) {
                    console.error(`Error fetching movie ${id} poster:`, error);
                }
            }
            setPosters([...fetchedUrls, ...fetchedUrls]);
        };

        fetchPosters();
    }, [movieIds]);

    if (posters.length === 0) {
        return null;
    }

    const carouselVariants = {
        animate: {
            x: ['0%', '-100%'],
            transition: {
                repeat: Infinity,
                repeatType: 'loop' as const,
                duration: 2000,
                ease: 'linear' as const,
            },
        },
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden z-0 flex items-center justify-center bg-black"
        >
            <motion.div
                className="flex h-full"
                variants={carouselVariants}
                animate="animate"
                style={{ width: `${posters.length * 150}px` }}
            >
                {posters.map((url, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 h-full w-[150px] relative overflow-hidden"
                    >
                        <img
                            src={url}
                            alt={`Movie Poster ${index}`}
                            className="absolute inset-0 w-full h-full object-cover opacity-20 hover:opacity-100 transition-opacity duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default MoviePosterBackground;