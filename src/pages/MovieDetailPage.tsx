import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import Counter from '../components/Counter/Counter';
import { IconPlus, IconMinus } from '@tabler/icons-react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

interface MovieDetail {
    id: string;
    title: string;
    averageScore: number;
    numVotes: number;
    percentage: number;
    posterUrl?: string;
    Comment: Array<{
        id: string;
        content: string;
        userId: string;
        user: {
            id: string;
            name: string;
            avatarUrl?: string;
        };
    }>;
    Vote: Array<{
        id: string;
        value: number;
        userId: string;
    }>;
}

const MovieDetailPage: React.FC = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const { user, isAuthenticated } = useAuth();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentText, setCommentText] = useState('');
    const [posterUrl, setPosterUrl] = useState<string | null>(null);
    const [voteValue, setVoteValue] = useState(5);

    const fetchMovieData = async () => {
        if (!movieId) return;
        try {
            const response = await fetch(`https://movie-eckw.onrender.com/movies/${movieId}`);
            if (!response.ok) {
                throw new Error('Falha ao buscar detalhes do filme.');
            }
            const data = await response.json();
            setMovie(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchPoster = async (movieTitle: string) => {
        if (movieTitle && API_KEY) {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieTitle)}&api_key=${API_KEY}`
                );
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const tmdbMovie = data.results[0];
                    if (tmdbMovie.poster_path) {
                        setPosterUrl(`https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch poster from TMDB:", error);
            }
        }
    };

    useEffect(() => {
        fetchMovieData();
    }, [movieId]);

    useEffect(() => {
        if (movie) {
            fetchPoster(movie.title);
        }
    }, [movie]);

    const token = localStorage.getItem('jwtToken');

    const handleVote = async (value: number) => {

        if (!isAuthenticated || !movieId) return;
        try {
            const response = await fetch('https://movie-eckw.onrender.com/movies/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ movieId, value }),
            });
            if (response.ok) {
                fetchMovieData();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erro ao votar.');
            }
        } catch (error) {
            alert('Erro ao se conectar com a API.');
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !movieId || commentText.trim() === '') return;
        try {
            const response = await fetch('https://movie-eckw.onrender.com/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify({ movieId, content: commentText }),
            });
            if (response.ok) {
                const newComment = await response.json();
                setCommentText('');
                setMovie(prevMovie => {
                    if (!prevMovie) return null;
                    return {
                        ...prevMovie,
                        Comment: [...prevMovie.Comment, newComment],
                    };
                });
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erro ao postar comentário.');
            }
        } catch (error) {
            alert('Erro ao se conectar com a API.');
        }
    };

    if (loading) {
        return <div className="p-8 text-white text-center">Carregando detalhes do filme...</div>;
    }

    if (error || !movie) {
        return <div className="p-8 text-red-500 text-center">Erro: {error || 'Filme não encontrado.'}</div>;
    }

    const hasVoted = movie.Vote.some(vote => vote.userId === user?.id);

    return (
        <div className="min-h-screen w-full bg-black text-white p-8 flex flex-col items-center justify-center">
            <style>
                {`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #27272a; /* bg-neutral-800 */
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #a1a1aa; /* text-neutral-400 */
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e4e4e7; /* text-neutral-200 */
                }
                `}
            </style>

            <div className="flex flex-col md:flex-row max-w-4xl w-full h-[80vh] md:h-[600px] bg-neutral-900  shadow-2xl overflow-hidden">
                <div className="flex-none w-full md:w-1/2 relative">

                    {posterUrl && (
                        <img
                            src={posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                <div className="flex-1 flex flex-col p-6">
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex items-center gap-2 mb-4 sticky top-0 bg-neutral-900">
                            <h2 className="text-2xl font-bold">{movie.title}</h2>
                            {movie.averageScore > 0 && (
                                <span className="text-sm font-semibold text-neutral-400">
                                    ({movie.averageScore.toFixed(1)}/10)
                                </span>
                            )}
                        </div>
                        <div className="space-y-4">
                            {movie.Comment.map((comment) => (
                                comment.user && (
                                    <motion.div
                                        key={comment.id}
                                        className="p-4 shadow-sm flex items-start gap-4 transition-transform hover:scale-[1.01]"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {comment.user.avatarUrl && (
                                            <img
                                                src={comment.user.avatarUrl}
                                                alt={comment.user.name}
                                                className="w-10 h-10"
                                            />
                                        )}
                                        <div>
                                            <p className="font-semibold">{comment.user.name}</p>
                                            <p className="text-sm text-neutral-300 break-all">{comment.content}</p>
                                        </div>
                                    </motion.div>
                                )
                            ))}
                        </div>
                    </div>

                    {isAuthenticated && !hasVoted && (
                        <div className="mt-4 flex-none flex items-center">
                            <motion.button
                                onClick={() => setVoteValue(prev => Math.max(0, prev - 1))}
                                className="p-1  bg-neutral-800 hover:bg-neutral-700 transition-colors"
                            >
                                <IconMinus className="w-4 h-4" />
                            </motion.button>
                            <Counter
                                value={voteValue}
                                places={[10, 1]}
                                fontSize={15}
                                padding={10}
                                gap={2}
                                textColor="white"
                                fontWeight={900}
                            />
                            <motion.button
                                onClick={() => setVoteValue(prev => Math.min(10, prev + 1))}
                                className="p-1  bg-neutral-800 hover:bg-neutral-700 transition-colors"
                            >
                                <IconPlus className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                onClick={() => handleVote(voteValue)}
                                className="ml-2 px-4 py-2 cursor-pointer hover:bg-neutral-700  transition-colors"

                            >
                                Votar
                            </motion.button>
                        </div>
                    )}

                    {isAuthenticated && (
                        <form onSubmit={handleCommentSubmit} className="mt-4 flex-none relative">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Adicione um comentario..."
                                className="w-full  p-3 text-white placeholder-neutral-500 focus:outline-none pr-20 resize-none custom-scrollbar"
                                rows={1}
                            />
                            <motion.span
                                onClick={handleCommentSubmit}
                                className="absolute right-4 bottom-5 cursor-pointer text-white  hover:underline underline-offset-4 transition-colors"
                            >
                                Postar
                            </motion.span>
                        </form>
                    )}
                </div>
            </div>
        </div >
    );
};

export default MovieDetailPage;
