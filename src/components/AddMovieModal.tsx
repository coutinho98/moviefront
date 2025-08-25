import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import MovieSearchForm from './MovieSearchForm';

interface AddMovieModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMovieSuccess: () => void;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const AddMovieModal: React.FC<AddMovieModalProps> = ({ isOpen, onClose, onAddMovieSuccess }) => {
    if (!isOpen) return null;

    const handleMovieSelected = async (movie: { title: string }) => {
        try {
            const response = await fetch('http://localhost:3000/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
                },
                body: JSON.stringify({ title: movie.title }),
            });

            if (response.ok) {
                onAddMovieSuccess();
            } else {
                console.error('Erro ao adicionar filme:', response.statusText);
            }
        } catch (error) {
            console.error('Falha na requisição:', error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className={cn(
                    "bg-neutral-900 rounded-lg shadow-lg p-6 w-[90%] max-w-md max-h-[80vh] overflow-y-auto relative",
                    "border border-neutral-700"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-white mb-4 text-center">Adicionar Filme</h2>
                <MovieSearchForm
                    onMovieSelected={handleMovieSelected}
                    onClose={onClose}
                    API_KEY={API_KEY}
                />
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-neutral-400 hover:text-white"
                >
                    &times;
                </button>
            </motion.div>
        </motion.div>
    );
};