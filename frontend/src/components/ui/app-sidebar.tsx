import { useSidebar } from "@/components/ui/sidebar";
import { BarChart2, Wallet, Home, PieChart, Target, List, Calendar, TrendingUp, UserCircle } from "lucide-react";
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
import { Link } from "react-router-dom";
import { LogoutButton } from "@/components/ui/logout-button";
import { useMediaQuery } from "@/hooks/use-media-query";

interface MenuItem {
    title: string;
    url: string;
    icon: React.ComponentType;
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
        url: "/profile",
        icon: UserCircle,
    },
    {
        title: "Budget",
        url: "/budget",
        icon: PieChart,
    },
    {
        title: "Goals",
        url: "/goals",
        icon: Target,
    },
];

// Finances items
const financesItems = [
    {
        title: "Transactions",
        url: "/transactions",
        icon: List,
    },
    {
        title: "Accounts",
        url: "/accounts",
        icon: Wallet,
    },
    {
        title: "Bills",
        url: "/bills",
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
    const { toggleSidebar } = useSidebar();
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <Sidebar>
            <SidebarHeader className='py-8 flex flex-row font-secondary font-light text-3xl uppercase text-blue-900 dark:text-gray-100'>
                <Link
                    to='/Dashboard'
                    onClick={toggleSidebar}
                    className='w-full h-16 flex items-center justify-center text-4xl rounded-md transition-colors text-customBlue-900 dark:text-darkText hover:text-customBlue-900 dark:hover:text-white hover:bg-customGray-100 dark:hover:bg-darkElement'>
                    <GiWallet className='size-8 me-4' />
                    Wallet
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className='mb-4'>Overview</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {overviewItems.map((item) => (
                                <SidebarLinkItem
                                    key={item.title}
                                    item={item}
                                    onClick={isMobile ? toggleSidebar : () => {}}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className='mb-4'>Finances</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {financesItems.map((item) => (
                                <SidebarLinkItem
                                    key={item.title}
                                    item={item}
                                    onClick={isMobile ? toggleSidebar : () => {}}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className='mb-4'>Analysis</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {analysisItems.map((item) => (
                                <SidebarLinkItem
                                    key={item.title}
                                    item={item}
                                    onClick={isMobile ? toggleSidebar : () => {}}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className='mt-auto px-4 py-4 border-t border-gray-200 dark:border-darkElement'>
                    <LogoutButton />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

function SidebarLinkItem({ item, onClick }: { item: MenuItem; onClick: () => void }) {
    // Grab the icon component from the item
    const Icon = item.icon;
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <Link
                    to={item.url}
                    onClick={onClick}>
                    <Icon />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
