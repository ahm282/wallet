import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { TopBar } from "@/components/ui/top-bar";

function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <TopBar />
                <Outlet />
            </main>
        </SidebarProvider>
    );
}

export default Layout;
