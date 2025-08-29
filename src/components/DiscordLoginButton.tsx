import { useAuth } from '../context/AuthContext';
import { HoverBorderGradient } from './ui/hover-border-gradient';
import discordSvg from '../assets/discord.svg';

const DiscordLoginButton: React.FC = () => {
  const { login } = useAuth();

  return (
    <HoverBorderGradient
      containerClassName="rounded-full"
      as="button"
      onClick={login}
      className="dark:bg-black bg-gray-900 text-white flex items-center space-x-2 cursor-pointer pointer-events-auto"
    >
      <img src={discordSvg} alt="Discord Icon" className="h-6 w-6" />
      <span>Discord</span>
    </HoverBorderGradient>
  );
};

export default DiscordLoginButton;