import { motion } from 'framer-motion';
import DiscordIcon from '../assets/discord.svg';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const DiscordLoginButton = () => {
    const discordLoginUrl = 'http://localhost:3000/auth/discord';
    const { login } = useAuth();

    useEffect(() => {
    }, [login]);

    return (
        <div className="relative flex items-center justify-center">
            <div className="bg-gray-700 p-8 rounded-lg shadow-xl">
                <motion.a
                    href={discordLoginUrl}
                    className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 justify-center"
                    whileTap={{ scale: 0.95 }}
                >
                    <img
                        src={DiscordIcon}
                        alt="Discord Icon"
                        width="30"
                        height="30"
                        className="text-white"
                    />
                    <span>Discord</span>
                </motion.a>
            </div>
        </div>
    );
};

export default DiscordLoginButton;