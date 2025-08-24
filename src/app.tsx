import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import DashHeader from './components/dash-header';
import AppRoutes from './components/app-routes';

export function App() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-screen">
                <DashHeader />
                <AppRoutes />
            </SidebarInset>
        </SidebarProvider>
    );
}
