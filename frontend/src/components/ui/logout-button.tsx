import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/use-logout";

export const LogoutButton = () => {
    const { handleLogout } = useLogout();

    return (
        <Button
            onClick={() => handleLogout()}
            className='w-full flex items-center py-2 text-sm rounded-md transition-colors dark:text-sidebar-foreground dark:bg-muted dark:hover:text-white dark:hover:bg-darkElement'>
            <LogOut className='h-4 w-4 mr-3 flex-shrink-0' />
            Logout
        </Button>
    );
};

export default LogoutButton;
