import { useBlogsContext } from "@/contexts/blogs-context";
import { NavCategory } from "./nav-category";
import { UserPlus2, Users2 } from "lucide-react";

const categoryName = "Users";

const categoryItems = [
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
];

export function NavUsers() {
  const { isAdmin } = useBlogsContext();

  if (!isAdmin) return null;

  return <NavCategory name={categoryName} items={categoryItems} />;
}
