import { memo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, LogOut, Menu, User, Sun, Moon } from 'lucide-react';
import { cn } from "../utils/cn";
import { useTheme } from "../context/ThemeContext";

interface MySidebarProps {
    onAddMovieClick: () => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

type ButtonVariants = "default" | "outline" | "ghost";
type ButtonSizes = "default" | "sm" | "lg" | "icon";

const Button = ({
    children,
    variant = "default",
    size = "default",
    className = "",
    ...props
}: {
    children: React.ReactNode;
    variant?: ButtonVariants;
    size?: ButtonSizes;
    className?: string;
    onClick?: () => void;
}) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants: Record<ButtonVariants, string> = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };
    const sizes: Record<ButtonSizes, string> = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
    };

    return (
        <button
            className={cn(baseClasses, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export const MySidebar = memo(({ isCollapsed, onToggle, onAddMovieClick }: MySidebarProps) => {
    const { logout, user } = useAuth();
    const [activeItem, setActiveItem] = useState('home');
    const { theme, setTheme } = useTheme();

    const menuItems = [
        { id: 'home', label: ':)', href: '/home' },
    ];

    const toggleTheme = () => {
        console.log('Tema atual:', theme);
        if (theme === "dark") {
            setTheme("light");
        } else if (theme === "light") {
            setTheme("spiderman");
        } else {
            setTheme("dark");
        }
    };

    const getThemeIcon = () => {
        if (theme === "dark") return <Moon className="h-4 w-4" />;
        if (theme === "light") return <Sun className="h-4 w-4" />;
        if (theme === "spiderman") return <User className="h-4 w-4" />;
    };

    return (
        <div className={cn(
            "flex h-screen flex-col shadow-xl/20 bg-[#F6F6F6] text-foreground transition-all duration-300",
            isCollapsed ? 'w-[60px]' : 'w-64'
        )}>
            <div className="flex h-14 items-center px-4">
                <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
                    <Menu className="h-4 w-4" />
                </Button>
                {!isCollapsed && (
                    <h1 className="ml-2 text-lg font-semibold">CDI Movies</h1>
                )}
            </div>

            <nav className="flex-1 space-y-2 p-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveItem(item.id)}
                        className={cn(
                            "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                            activeItem === item.id
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                    >
                        {/*  <item.icon className="h-4 w-4" /> */}
                        {!isCollapsed && (
                            <span className="ml-3">{item.label}</span>
                        )}
                    </button>
                ))}

                <div className="pt-4">
                    <Button
                        onClick={onAddMovieClick}
                        className={cn("w-full cursor-pointer bg-white shadow-lg rounded-xl", isCollapsed ? 'px-0' : '')}
                        size={isCollapsed ? 'icon' : 'default'}
                        variant="default"
                    >
                        <Plus className="h-4 w-4" />
                        {!isCollapsed && <span className="ml-2 font-embed">Adicionar</span>}
                    </Button>
                </div>
            </nav>

            <div className="border-t border-black/10 p-4">
                <Button
                    size="icon"
                    onClick={toggleTheme}
                    className={cn(
                        "w-full mb-2 cursor-pointer",
                        isCollapsed ? 'px-0' : '',
                        isCollapsed ? 'justify-center' : 'justify-start'
                    )}
                >
                    {getThemeIcon()}
                    {!isCollapsed && <span className="ml-3">Tema</span>}
                </Button>

                <button className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted-foreground",
                    isCollapsed ? 'justify-center' : ''
                )}>
                    {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full" />
                    ) : (
                        <User className="h-0 w-0" />
                    )}
                    {!isCollapsed && user && (
                        <div className="ml-3 flex-1 text-left">
                            <p className="text-sm font-medium">{user.name}</p>
                        </div>
                    )}
                </button>

                <button
                    onClick={logout}
                    className={cn(
                        "mt-2 flex w-full items-center rounded-lg cursor-pointer px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        isCollapsed ? 'justify-center' : ''
                    )}
                >
                    <LogOut className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-3 ">Sair</span>}
                </button>
            </div>
        </div>
    );
});