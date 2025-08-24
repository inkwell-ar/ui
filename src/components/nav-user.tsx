'use client';

import {
    BadgeCheck,
    ChevronsUpDown,
    LogOut,
    Sun,
    Moon,
    Settings,
    LogIn,
    LoaderCircle,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useThemeContext } from '@/contexts/theme-context';
import { useWCContext } from '@/contexts/wc-context';

type UserData = {
    name: string;
    email: string;
    avatar: string;
};

const emptyUser: UserData = {
    name: '',
    email: '',
    avatar: '',
};

export function NavUser() {
    const { isMobile } = useSidebar();
    const { theme, toggleTheme } = useThemeContext();
    const {
        isLoadingWander,
        isAuthenticated,
        isConnected,
        connect,
        disconnect,
        userDetails,
        wander,
    } = useWCContext();
    // useWanderConnectContext();
    const [userData, setUserData] = useState(emptyUser);

    useEffect(() => {
        if (!userDetails) {
            setUserData(emptyUser);
            return;
        }

        setUserData({
            name: userDetails.name,
            email: userDetails.email,
            avatar: userDetails.picture,
        });
        console.log(userDetails.picture);
    }, [userDetails]);

    if (!isConnected || !isAuthenticated)
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={connect}
                        tooltip="Log In"
                        className="h-12"
                    >
                        <LogIn />
                        <span>Log In</span>
                        {isLoadingWander && (
                            <LoaderCircle className="ml-auto animate-spin" />
                        )}
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            tooltip={userData.name}
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={userData.avatar}
                                    alt={userData.name}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {userData.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {userData.name}
                                </span>
                                <span className="truncate text-xs">
                                    {userData.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={userData.avatar}
                                        alt={userData.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        CN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {userData.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {userData.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => wander?.open()}>
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => toast('Not implemented')}
                            >
                                <Settings />
                                Settings
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={toggleTheme}>
                                {theme === 'dark' ? <Sun /> : <Moon />}
                                {theme === 'dark' ? 'Light' : 'Dark'} Theme
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={disconnect}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
