import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import MovieSearchForm from './MovieSearchForm';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMovieSuccess: () => void;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const AddMovieModal: React.FC<AddMovieModalProps> = ({ isOpen, onClose, onAddMovieSuccess }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  if (!isOpen) return null;

  const handleMovieSelected = async (movie: { title: string }) => {
    setIsAdding(true);
    setAddError(null);
    setAddSuccess(false);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Usuário não autenticado. Por favor, faça login novamente.');
      }

      const response = await fetch('http://localhost:3000/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: movie.title }),
      });

      if (response.ok) {
        setAddSuccess(true);
        onAddMovieSuccess();
        setTimeout(onClose, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido ao adicionar filme.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Falha na requisição:', error.message);
        setAddError(error.message);
      } else {
        console.error('Falha na requisição:', error);
        setAddError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsAdding(false);
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

        {addSuccess && (
          <div className="flex items-center justify-center text-green-500 mb-4">
            <IconCircleCheck className="h-6 w-6 mr-2" />
            <span>Filme adicionado com sucesso!</span>
          </div>
        )}

        {addError && (
          <div className="flex items-center justify-center text-red-500 mb-4">
            <IconCircleX className="h-6 w-6 mr-2" />
            <span>Erro: {addError}</span>
          </div>
        )}

        {isAdding ? (
          <div className="flex justify-center items-center">
            <p className="text-neutral-400">Adicionando filme...</p>
          </div>
        ) : (
          <MovieSearchForm
            onMovieSelected={handleMovieSelected}
            onClose={onClose}
            API_KEY={API_KEY}
          />
        )}

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