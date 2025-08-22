import { ChevronsUpDown, Command, LoaderCircle, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useBlogsContext } from "@/contexts/blogs-context";
import { InkwellBlogSDK, type BlogInfo } from "@inkwell.ar/sdk";
import { useWCContext } from "@/contexts/wc-context";

export type BlogData = {
  id: string;
  name: string;
  logo: React.ElementType;
  description: string;
};

const emptyBlogData: BlogData = {
  id: "No-Blog-Selected",
  name: "Select a Blog",
  logo: Command,
  description: "",
};
// export type BlogSwitcherProps = {};

export function BlogSwitcher() {
  const { isMobile } = useSidebar();
  const { isConnected, isAuthenticated } = useWCContext();
  const {
    blogs,
    isLoading: isLoadingBlogs,
    selectedBlog,
    setSelectedBlog,
  } = useBlogsContext();
  const [blogsData, setBlogsData] = useState<BlogData[]>([emptyBlogData]);
  const [activeBlogData, setActiveBlogData] = useState(
    blogsData ? blogsData[0] : emptyBlogData
  );
  const [isLoadingBlogDetails, setIsLoadingBlogDetails] = useState(false);

  useEffect(() => {
    if (!isConnected) return;

    const updateBlogsData = async () => {
      setIsLoadingBlogDetails(true);
      const newBlogsData: BlogData[] = blogs.map((blogPermission) => {
        return {
          id: blogPermission.blog_id,
          name: blogPermission.blog_id,
          logo: Command,
          description: JSON.stringify(blogPermission.roles),
        };
      });
      for (let i = 0; i < blogs.length; i++) {
        const blogPermission = blogs[i];
        const blog = new InkwellBlogSDK({ processId: blogPermission.blog_id });
        const blogInfo = await blog.getInfo();
        console.log("Blog info fetched: ", blogInfo);

        if (!blogInfo.success) {
          console.log(
            "Failed to load details for blog ",
            blogPermission.blog_id
          );
          continue;
        }
        const blogDetails = blogInfo.data as BlogInfo;
        newBlogsData[i].name =
          blogDetails.blogTitle || blogDetails.details.title;
        newBlogsData[i].description =
          blogDetails.blogDescription || blogDetails.details.description;
        // newBlogsData[i].logo = !blogDetails.blogLogo ? (
        //   Command
        // ) : (
        //   <img src={blogDetails.blogLogo} alt="Logo" className="h-8 w-8" />
        // );
      }
      setBlogsData([emptyBlogData, ...newBlogsData]);
      setIsLoadingBlogDetails(false);
    };

    updateBlogsData();
  }, [blogs, isConnected]);

  useEffect(() => {
    console.log("blogs data changed: ", blogsData);
    if (!blogsData) {
      setBlogsData([emptyBlogData]);
    } else {
      let newActiveBlogData = blogsData[0];
      for (let i = 0; i < blogsData.length; i++) {
        const blogData = blogsData[i];
        if (blogData.id === selectedBlog) newActiveBlogData = blogData;
      }
      setActiveBlogData(newActiveBlogData);
    }
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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex shrink-0 aspect-square size-8 items-center justify-center rounded-lg">
                {activeBlogData && <activeBlogData.logo className="size-4" />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center justify-between">
                  <span className="truncate font-medium">
                    {activeBlogData?.name}
                  </span>
                  {(isLoadingBlogs || isLoadingBlogDetails) && (
                    <LoaderCircle className="animate-spin" />
                  )}
                </div>
                <span className="truncate text-xs">
                  {activeBlogData?.description}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Blogs
            </DropdownMenuLabel>

            {blogsData.map((blog, index) => (
              <DropdownMenuItem
                key={blog.name}
                onClick={() => selectActiveBlog(blog)}
                className="gap-2 p-2"
              >
                <div className="flex shrink-0 size-6 items-center justify-center rounded-md border">
                  <blog.logo className="size-3.5 shrink-0" />
                </div>
                <span className="truncate">{blog.name}</span>
                <DropdownMenuShortcut>⌘{index}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add blog</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
