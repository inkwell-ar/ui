import {
    SquarePen,
    ChevronDown,
    ChevronsUpDown,
    Feather,
    LoaderCircle,
} from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    //   DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { useBlogsContext, type BlogData } from '@/contexts/blogs-context';
import { useWCContext } from '@/contexts/wc-context';
import { emptyBlogData } from '@/lib/constants';
import { getImageSource } from '@/lib/utils';

export function BlogSwitcher() {
    const { isMobile } = useSidebar();
    const { isConnected, isAuthenticated } = useWCContext();
    const {
        blogsData,
        isLoading: isLoadingBlogs,
        isLoadingBlogDetails,
        selectedBlog,
        setSelectedBlog,
    } = useBlogsContext();
    const [activeBlogData, setActiveBlogData] = useState(emptyBlogData);

    useEffect(() => {
        console.log('blogs data changed: ', blogsData);
        if (!blogsData || selectedBlog === emptyBlogData.id) {
            setActiveBlogData(emptyBlogData);
            return;
        }

        let newActiveBlogData = blogsData[0];
        for (let i = 0; i < blogsData.length; i++) {
            const blogData = blogsData[i];
            if (blogData.id === selectedBlog) newActiveBlogData = blogData;
        }
        setActiveBlogData(newActiveBlogData);
    }, [blogsData, selectedBlog]);

    const selectActiveBlog = (blog: BlogData) => {
        setActiveBlogData(blog);
        setSelectedBlog(blog.id);
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            disabled={!isConnected || !isAuthenticated}
                        >
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                                {activeBlogData &&
                                activeBlogData.id !== emptyBlogData.id ? (
                                    activeBlogData.logo &&
                                    getImageSource(activeBlogData.logo) ? (
                                        <img
                                            src={getImageSource(
                                                activeBlogData.logo
                                            )}
                                            alt={activeBlogData.title}
                                            className="size-8 rounded-lg object-cover p-1"
                                        />
                                    ) : (
                                        <SquarePen className="size-4" />
                                    )
                                ) : (
                                    <ChevronDown className="size-4" />
                                )}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <div className="flex items-center justify-between">
                                    <span className="truncate font-medium">
                                        {activeBlogData?.title ||
                                            emptyBlogData.title}
                                    </span>
                                    {(isLoadingBlogs ||
                                        isLoadingBlogDetails) && (
                                        <LoaderCircle className="animate-spin" />
                                    )}
                                </div>
                                <span className="truncate text-xs">
                                    {activeBlogData?.description ||
                                        emptyBlogData.description}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? 'bottom' : 'right'}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Blogs
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                            key={emptyBlogData.id}
                            onClick={() => selectActiveBlog(emptyBlogData)}
                            className="gap-2 p-2"
                        >
                            <div className="flex size-6 shrink-0 items-center justify-center rounded-md border">
                                <ChevronDown />
                            </div>
                            <span className="truncate">
                                {emptyBlogData.title}
                            </span>
                        </DropdownMenuItem>

                        {blogsData.map((blog) => (
                            <DropdownMenuItem
                                key={blog.id}
                                onClick={() => selectActiveBlog(blog)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md border">
                                    {blog.logo && getImageSource(blog.logo) ? (
                                        <img
                                            src={getImageSource(blog.logo)}
                                            alt={blog.title}
                                            className="size-6 rounded-md object-cover p-1"
                                        />
                                    ) : (
                                        <SquarePen className="size-4" />
                                    )}
                                </div>
                                <span className="truncate">{blog.title}</span>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Feather className="size-4" />
                            </div>
                            <div className="text-muted-foreground font-medium">
                                Add blog
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
