import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieDetailPage from "../pages/MovieDetailPage";
import { cn } from "../utils/cn";

interface MovieDetailModalProps {
    movieId: string | null;
    onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
    movieId,
    onClose,
}) => {
    return (
        <AnimatePresence>
            {movieId && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                        "fixed inset-0 z-50 flex items-center justify-center p-4",
                        "bg-black/50 backdrop-blur-md"
                    )}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-4xl h-[90vh] rounded-xl bg-neutral-900 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-white hover:text-neutral-400 z-10"
                        >
                            &times;
                        </button>
                        <MovieDetailPage movieId={movieId} inModal={true} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MovieDetailModal;