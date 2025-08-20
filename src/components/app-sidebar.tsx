import * as React from "react";
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
      logo: AudioWaveform,
      description: "Wander",
    },
    {
      name: "Popups",
      logo: Command,
      description: "Wander",
    },
  ],
  blog: [
    {
      name: "Blog Details",
      url: "#",
      icon: Settings2,
    },
  ],
  posts: [
    {
      name: "All Posts",
      url: "#",
      icon: List,
    },
    {
      name: "Create New Post",
      url: "#",
      icon: Plus,
    },
  ],
  users: [
    {
      name: "All Users",
      url: "#",
      icon: Users2,
    },
    {
      name: "Add User",
      url: "#",
      icon: UserPlus2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BlogSwitcher blogs={data.blogs} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
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
