import { useBlogsContext } from "@/contexts/blogs-context";
import { emptyBlogData } from "@/lib/constants";
import { NavCategory } from "./nav-category";
import { Settings2 } from "lucide-react";

const categoryName = "Blog";

const categoryItems = [
  {
    name: "Blog Details",
    route: "#",
    icon: Settings2,
  },
];

export function NavBlog() {
  const { selectedBlog } = useBlogsContext();

  if (!selectedBlog || selectedBlog === emptyBlogData.id) return null;

  return <NavCategory name={categoryName} items={categoryItems} />;
}
