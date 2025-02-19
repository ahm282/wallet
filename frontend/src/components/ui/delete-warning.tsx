import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { DeleteWarningProps } from "@/types/budget.types";

export const DeleteWarning: React.FC<DeleteWarningProps> = ({ icon, onConfirm, onCancel, message, children }) => {
    const IconComponent = icon;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className='w-10/12 rounded-md'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='flex items-center'>
                        <IconComponent className='inline me-2 size-5' />
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onCancel?.()}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className='bg-red-700 text-destructive-foreground hover:bg-red-600'
                        onClick={() => onConfirm?.()}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteWarning;
