export interface DeleteWarningProps {
    icon: React.ComponentType<{ className?: string }>;
    message: string;
    children: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
}
