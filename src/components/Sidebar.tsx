import { useState } from "react";
import {
    IconArrowLeft,
    IconSettings,
    IconPlus,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/cdi.png"
import PillNav from './PillNav/PillNav';

interface MySidebarProps {
    onAddMovieSuccess: () => void;
}

export function MySidebar({ onAddMovieSuccess }: MySidebarProps) {
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <PillNav
                logo={logo}
                logoAlt="Company Logo"
                items={[
                    { label: 'About', href: '/about' },
                    { label: 'Services', href: '/services' },
                    { label: 'Contact', href: '/contact' }
                ]}
                activeHref="/"
                className="custom-nav"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
            />
        </div>
    );
}