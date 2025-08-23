import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import logo from "@/assets/logo-dark-mode.svg";
import { Link } from "react-router-dom";

export function NavHeaderLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-1.5 h-12 bg-[#e05d38] text-background hover:bg-[#e05d38] hover:text-background dark:text-foreground dark:hover:text-foreground"
        >
          <Link to="/">
            <img src={logo} alt="🪶" className="!size-8" />
            <span className="text-lg">Inkwell</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
