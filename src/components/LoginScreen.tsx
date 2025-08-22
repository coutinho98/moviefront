import { BackgroundLines } from "../components/ui/background-lines";
import DiscordLoginButton from './DiscordLoginButton';

const LoginScreen: React.FC = () => {
  return (
    <div className="h-screen w-full relative flex flex-col justify-between items-center antialiased bg-black">
      <BackgroundLines className="absolute inset-0 z-0">
        <div className="flex flex-col items-center justify-center h-full relative z-10">
          <h1 className="text-4xl font-embed md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            CDI Movies
          </h1>
          <div className="flex justify-center mt-8">
            <DiscordLoginButton />
          </div>
        </div>
      </BackgroundLines>
    </div>
  );
};

export default LoginScreen;