import {
    BarChart2,
    Wallet,
    Home,
    PieChart,
    Target,
    List,
    Calendar,
    TrendingUp,
    LogOut,
    UserCircle,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { GiWallet } from "react-icons/gi";

function NavItem({ href, icon: Icon, children }: { href: string; icon: any; children: React.ReactNode }) {
    return (
        <a
            href={href}
            onClick={(e) => e.preventDefault()}
            className='flex items-center px-3 py-2 text-sm rounded-md transition-colors text-customBlue-900 dark:text-darkText hover:text-customBlue-900 dark:hover:text-white hover:bg-customGray-100 dark:hover:bg-darkElement'>
            <Icon className='h-4 w-4 mr-3 flex-shrink-0' />
            {children}
        </a>
    );
}

// Overview items
const overviewItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Profile",
        url: "#",
        icon: UserCircle,
    },
    {
        title: "Budget",
        url: "#",
        icon: PieChart,
    },
    {
        title: "Goals",
        url: "#",
        icon: Target,
    },
];

// Finances items
const financesItems = [
    {
        title: "Transactions",
        url: "/dashboard",
        icon: List,
    },
    {
        title: "Accounts",
        url: "#",
        icon: Wallet,
    },
    {
        title: "Bills",
        url: "#",
        icon: Calendar,
    },
];

// Analysis items
const analysisItems = [
    {
        title: "Reports",
        url: "/dashboard",
        icon: BarChart2,
    },
    {
        title: "Insights",
        url: "#",
        icon: TrendingUp,
    },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className='py-8 flex flex-row font-secondary font-light text-3xl uppercase text-blue-900 dark:text-gray-100'>
                <a
                    href='/'
                    className='w-full h-16 flex items-center justify-center text-4xl rounded-md transition-colors text-customBlue-900 dark:text-darkText hover:text-customBlue-900 dark:hover:text-white hover:bg-customGray-100 dark:hover:bg-darkElement'>
                    <GiWallet className='size-8 me-4' />
                    Wallet
                </a>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className='mb-4'>Overview</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {overviewItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className='mb-4'>Finances</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {financesItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className='mb-4'>Analysis</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {analysisItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className='mt-auto px-4 py-4 border-t border-gray-200 dark:border-darkElement'>
                    <NavItem
                        href='/login'
                        icon={LogOut}>
                        Logout
                    </NavItem>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
