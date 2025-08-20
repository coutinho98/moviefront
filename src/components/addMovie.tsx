import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddMovie = () => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao adicionar filme.');
            }

            navigate('/movies');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro desconhecido.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 bg-gray-800 min-h-screen text-white">
            <h1 className="text-3xl font-bold text-center mb-6">Adicionar Novo Filme</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-700 p-8 rounded-lg shadow-lg">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-400 text-sm font-bold mb-2">
                        Título do Filme
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Adicionando...' : 'Adicionar Filme'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/movies')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMovie;