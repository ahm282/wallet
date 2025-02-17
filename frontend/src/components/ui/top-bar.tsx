import { BreadcrumbResponsive } from "@/components/AppBreadcrumbs";
import { CustomTrigger } from "@/components/ui/custom-sidebar-trigger";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthStore from "@/store/authStore";
import { ModeToggle } from "@/components/ModeToggle";
import { ScaleLoader } from "react-spinners";

export const TopBar = () => {
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <ScaleLoader color={"#1e3a8a"} />
            </div>
        );
    }

    return (
        <>
            <div className='flex justify-between items-center'>
                <div className='md:w-6/12 flex items-center gap-x-4 px-4 py-3'>
                    <CustomTrigger />
                    <Separator
                        orientation='vertical'
                        className='me-2 h-4'
                    />
                    <BreadcrumbResponsive />
                </div>
                <div className='flex items-center gap-x-4'>
                    <ModeToggle />
                    <Avatar className='me-4 size-7'>
                        <AvatarImage
                            src={user.picture}
                            referrerPolicy='no-referrer'
                            alt='User picture'
                        />
                        <AvatarFallback>{getInitials(user.given_name, user.family_name)}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <Separator orientation='horizontal' />
        </>
    );
};

function getInitials(given_name: string, family_name: string): string {
    return `${given_name.charAt(0)}${family_name.charAt(0)}`;
}

export default TopBar;
