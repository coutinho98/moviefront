import { memo } from "react";
import logo from "../assets/cdi.png"
import PillNav from './PillNav/PillNav';

interface MySidebarProps {
    onAddMovieClick: () => void;
}

export const MySidebar = memo(({ onAddMovieClick }: MySidebarProps) => {

    return (
        <div className="flex items-center justify-center min-h-min w-full">
            <PillNav
                logo={logo}
                logoAlt="Company Logo"
                items={[
                    { label: 'home', href: '/' },
                    /* { label: 'meus filmes', href: '/services' }, */
                    { label: 'sair', href: '/login' }
                ]}
                activeHref="/home"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
                onAddMovieClick={onAddMovieClick}
            />
        </div>
    );
});