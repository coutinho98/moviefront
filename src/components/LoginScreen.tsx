import DiscordLoginButton from './DiscordLoginButton';
import Galaxy from "./Galaxy/Galaxy";
import TextPressure from "./TextPressure/TextPressure";

const LoginScreen: React.FC = () => {
  return (
    <div className="h-screen w-full relative flex flex-col justify-between items-center antialiased bg-black">
      <div className="absolute inset-0 z-0">
        <Galaxy />
      </div>
      <div className="flex flex-col items-center justify-center h-full w-full relative z-10 pointer-events-none">
        <div style={{ height: '180px', fontSize: '120px', }}>
          <TextPressure
            text="CDI Movies!"
            flex={false}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            minFontSize={180}
            className="pointer-events-auto"
          />
        </div>
        <div className="flex justify-center mt-8">
          <DiscordLoginButton/>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;