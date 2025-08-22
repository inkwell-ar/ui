import { useBlogsContext } from "@/contexts/blogs-context";
import { NavCategory } from "./nav-category";
import { Feather, List } from "lucide-react";

const categoryName = "Posts";

const categoryItems = [
  {
    name: "All Posts",
    route: "#",
    icon: List,
  },
  {
    name: "Create New Post",
    route: "#",
    icon: Feather,
  },
];

export function NavPosts() {
  const { isEditor } = useBlogsContext();

  if (!isEditor) return null;

  return <NavCategory name={categoryName} items={categoryItems} />;
}
