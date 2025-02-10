// Layout.tsx
import React from "react";
// import { Outlet, Link } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { BreadcrumbResponsive } from "@/components/AppBreadcrumbs";
import { CustomTrigger } from "@/components/ui/custom-sidebar-trigger";
import { Separator } from "@/components/ui/separator";

function Layout({ children }: { children?: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <div className='md:w-6/12 flex items-center gap-x-4 px-4 py-3'>
                    <CustomTrigger />
                    <Separator
                        orientation='vertical'
                        className='me-2 h-4'
                    />
                    <BreadcrumbResponsive />
                </div>
                <Separator orientation='horizontal' />
                {children}
            </main>
        </SidebarProvider>
    );
}

export default Layout;
