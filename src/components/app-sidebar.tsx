import { NavLoginButton } from '@/components/nav-login-button';
import { BlogSwitcher } from '@/components/blog-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { useBlogsContext } from '@/contexts/blogs-context';
import { useEffect } from 'react';
import { NavBlog } from './nav-blog';
import { NavPosts } from './nav-posts';
import { NavUsers } from './nav-users';
import { NavHeaderLogo } from './nav-header-logo';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { selectedBlog } = useBlogsContext();

    useEffect(() => console.log(selectedBlog), [selectedBlog]);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavHeaderLogo />
                <BlogSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavBlog />
                <NavPosts />
                <NavUsers />
            </SidebarContent>
            <SidebarFooter>
                <NavLoginButton />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
