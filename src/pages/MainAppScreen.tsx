import { useAuth } from "../context/AuthContext";
import { MySidebar } from "../components/Sidebar";
import {
    TextRevealCard,
    TextRevealCardDescription,
    TextRevealCardTitle,
} from "../components/ui/text-reveal-card";


const MainAppScreen: React.FC = () => {
    const { user } = useAuth();
    return (
        <div className="flex w-full min-h-screen bg-black text-white font-embed">
            <MySidebar />
            <div className="flex-grow flex flex-col p-4">
                <main className="flex-grow flex justify-center items-center">
                    <TextRevealCard
                        text="oi seu filho da puta"
                        revealText={`oi ${user?.name}, belezinha?`}
                    >
                    </TextRevealCard>
                </main>
            </div>
        </div>
    );
};

export default MainAppScreen