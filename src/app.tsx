import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashPostsManager from "./components/dash-posts-manager";
import DashHeader from "./components/dash-header";

export function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen">
        <DashHeader />
        <DashPostsManager />
      </SidebarInset>
    </SidebarProvider>
  );
}
