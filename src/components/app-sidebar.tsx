import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  List,
  Plus,
  Settings2,
  UserPlus2,
  Users2,
} from "lucide-react";

import { NavCategory } from "@/components/nav-category";
import { NavUser } from "@/components/nav-user";
import { BlogSwitcher } from "@/components/blog-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  blogs: [
    {
      name: "Announcements",
      logo: GalleryVerticalEnd,
      description: "Wander",
    },
    {
      name: "Pills",
      logo: Command,
      description: "Wander",
    },
    {
      name: "Popups",
      logo: AudioWaveform,
      description: "Wander",
    },
  ],
  blog: [
    {
      name: "Blog Details",
      route: "#",
      icon: Settings2,
    },
  ],
  posts: [
    {
      name: "All Posts",
      route: "#",
      icon: List,
    },
    {
      name: "Create New Post",
      route: "#",
      icon: Plus,
    },
  ],
  users: [
    {
      name: "All Users",
      route: "#",
      icon: Users2,
    },
    {
      name: "Add User",
      route: "#",
      icon: UserPlus2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BlogSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavCategory name="Blog" items={data.blog} />
        <NavCategory name="Posts" items={data.posts} />
        <NavCategory name="Users" items={data.users} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
