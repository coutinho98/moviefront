import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
    IconArrowLeft,
    IconSettings,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import discordSvg from '../assets/discord.svg';

export function MySidebar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    const links = [
        {
            label: "Início",
            href: "/",
            icon: (
                <img src={discordSvg} alt="Discord Icon" className="h-6 w-6" />
            ),
        },
        {
            label: "Configurações",
            href: "/settings",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            label: "Sair",
            href: "#",
            onClick: logout,
            icon: (
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];

    return (
        <div
            className="h-screen w-[60px] md:w-[220px] transition-all duration-300 overflow-hidden"
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        <a
                            href="/"
                            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
                        >
                            <img src={discordSvg} alt="Discord Icon" className="h-6 w-6" />
                            <span className="font-medium whitespace-pre text-black dark:text-white">CDI Movies</span>
                        </a>
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: user?.name || "Usuário",
                                href: "/profile",
                                icon: (
                                    <img
                                        src={user?.avatarUrl}
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
        </div>
    );
}

export default MySidebar;