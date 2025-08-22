import { NavUser } from "@/components/nav-user";
import { BlogSwitcher } from "@/components/blog-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useBlogsContext } from "@/contexts/blogs-context";
import { useEffect } from "react";
import { NavBlog } from "./nav-blog";
import { NavPosts } from "./nav-posts";
import { NavUsers } from "./nav-users";

// This is sample data.
// const data = {
//   user: {
//     name: "shadcn",
//     email: "m@example.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   blogs: [
//     {
//       name: "Announcements",
//       logo: GalleryVerticalEnd,
//       description: "Wander",
//     },
//     {
//       name: "Pills",
//       logo: Command,
//       description: "Wander",
//     },
//     {
//       name: "Popups",
//       logo: AudioWaveform,
//       description: "Wander",
//     },
//   ],
//   blog: [
//     {
//       name: "Blog Details",
//       route: "#",
//       icon: Settings2,
//     },
//   ],
//   posts: [
//     {
//       name: "All Posts",
//       route: "#",
//       icon: List,
//     },
//     {
//       name: "Create New Post",
//       route: "#",
//       icon: Plus,
//     },
//   ],
//   users: [
//     {
//       name: "All Users",
//       route: "#",
//       icon: Users2,
//     },
//     {
//       name: "Add User",
//       route: "#",
//       icon: UserPlus2,
//     },
//   ],
// };

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { selectedBlog } = useBlogsContext();

  useEffect(() => console.log(selectedBlog), [selectedBlog]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BlogSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavBlog />
        <NavPosts />
        <NavUsers />
        {/* {selectedBlog && selectedBlog !== emptyBlogData.id && (
          <NavCategory name="Blog" items={data.blog} />
        )}
        {isEditor && <NavCategory name="Posts" items={data.posts} />}
        {isAdmin && <NavCategory name="Users" items={data.users} />} */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
