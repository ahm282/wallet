export const EmptyState = ({ message }: { message: string }) => (
    <div className='h-64 flex items-center justify-center border border-dashed rounded-md'>
        <span className='text-muted-foreground'>{message}</span>
    </div>
);

export default EmptyState;
