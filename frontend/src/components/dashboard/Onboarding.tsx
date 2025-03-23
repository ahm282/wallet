import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowRight, Wallet, PieChart, Target, CreditCard, UserCircle, Smile } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useHasEntities } from "@/hooks/dashboard/use-has-entities";

type EntityStatusProps = {
    entityStatus: {
        hasAccounts: boolean;
        hasBudgets: boolean;
        hasGoals: boolean;
        hasTransactions: boolean;
    };
};

export const Onboarding: React.FC = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const entityStatus = useHasEntities();

    return (
        <>{isDesktop ? <DesktopLayout entityStatus={entityStatus} /> : <MobileLayout entityStatus={entityStatus} />}</>
    );
};

export const DesktopLayout: React.FC<EntityStatusProps> = ({ entityStatus }) => {
    const { hasAccounts, hasBudgets, hasGoals, hasTransactions } = entityStatus;

    return (
        <div className='md:w-10/12 lg:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-7'>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center text-2xl font-primary'>
                        <Smile className='size-7 me-3' /> Welcome to Wallet!
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground mb-6'>
                        Let's get started with setting up your account. Here are some steps to help you begin:
                    </p>
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                        <Card className='flex flex-col justify-between'>
                            <CardHeader className='flex flex-col justify-between space-y-0 pb-2'>
                                <div className='flex justify-between'>
                                    <CardTitle className='text-sm font-medium'>Add Account</CardTitle>
                                    <Wallet className='h-4 w-4 text-muted-foreground' />
                                </div>
                                <p className='text-xs text-muted-foreground pt-2'>
                                    Add your bank accounts to track your finances
                                </p>
                            </CardHeader>
                            <CardContent>
                                {hasAccounts ? (
                                    <Button
                                        className='mt-4 w-full'
                                        size='sm'
                                        disabled={true}>
                                        Accounts Added
                                    </Button>
                                ) : (
                                    <Link to='/accounts'>
                                        <Button
                                            className='mt-4 w-full'
                                            size='sm'>
                                            <PlusCircle className='mr-2 h-4 w-4' />
                                            Add Account
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                        <Card className='flex flex-col justify-between'>
                            <CardHeader className='flex flex-col justify-between space-y-0 pb-2'>
                                <div className='flex justify-between'>
                                    <CardTitle className='text-sm font-medium'>Set Budget</CardTitle>
                                    <PieChart className='h-4 w-4 text-muted-foreground' />
                                </div>
                                <p className='text-xs text-muted-foreground pt-2'>
                                    Create a budget to manage your spending
                                </p>
                            </CardHeader>
                            <CardContent>
                                {hasBudgets ? (
                                    <Button
                                        className='mt-4 w-full'
                                        size='sm'
                                        disabled={true}>
                                        Budget Set
                                    </Button>
                                ) : (
                                    <Link to='/budgets'>
                                        <Button
                                            className='mt-4 w-full'
                                            size='sm'>
                                            <PlusCircle className='mr-2 h-4 w-4' />
                                            Create Budget
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                        <Card className='flex flex-col justify-between'>
                            <CardHeader className='flex flex-col justify-between space-y-0 pb-2'>
                                <div className='flex justify-between'>
                                    <CardTitle className='text-sm font-medium'>Add Goals</CardTitle>
                                    <Target className='h-4 w-4 text-muted-foreground' />
                                </div>
                                <p className='text-xs text-muted-foreground pt-2'>
                                    Set financial goals to work towards
                                </p>
                            </CardHeader>
                            <CardContent>
                                {hasGoals ? (
                                    <Button
                                        className='mt-4 w-full'
                                        size='sm'
                                        disabled={true}>
                                        Goals Added
                                    </Button>
                                ) : (
                                    <Link to='/goals'>
                                        <Button
                                            className='mt-4 w-full'
                                            size='sm'>
                                            <PlusCircle className='mr-2 h-4 w-4' />
                                            Add Goal
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                        <Card className='flex flex-col justify-between'>
                            <CardHeader className='flex flex-col justify-between space-y-0 pb-2'>
                                <div className='flex justify-between'>
                                    <CardTitle className='text-sm font-medium'>Track Expenses</CardTitle>
                                    <CreditCard className='h-4 w-4 text-muted-foreground' />
                                </div>
                                <p className='text-xs text-muted-foreground pt-2'>
                                    Start logging your expenses to gain insights
                                </p>
                            </CardHeader>
                            <CardContent>
                                {hasTransactions ? (
                                    <Button
                                        className='mt-4 w-full'
                                        size='sm'
                                        disabled={true}>
                                        Expenses Logged
                                    </Button>
                                ) : (
                                    <Link to='/transactions'>
                                        <Button
                                            className='mt-4 w-full'
                                            size='sm'>
                                            <PlusCircle className='mr-2 h-4 w-4' />
                                            Log Expense
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center text-xl font-primary'>
                        <UserCircle className='size-7 inline me-3' />
                        Check Your Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-muted-foreground mb-6'>
                        Check out your profile to see your account details and recent activities.
                    </p>
                    <Link to='/profile'>
                        <Button>
                            Go to Profile
                            <ArrowRight className='ml-2 h-4 w-4' />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
};

export const MobileLayout: React.FC<EntityStatusProps> = ({ entityStatus }) => {
    const { hasAccounts, hasBudgets, hasGoals, hasTransactions } = entityStatus;
    return (
        <div className='w-10/12 mx-auto my-8'>
            <div
                id='introduction'
                className='py-4 space-y-3'>
                <h1 className='text-2xl font-primary font-semibold flex items-center'>
                    <Smile className='size-4 me-3' /> Welcome to Wallet!
                </h1>
                <div>
                    <p className='text-muted-foreground'>Let's get started with setting up your account.</p>
                    <p className='text-muted-foreground'>Here are some steps to help you begin:</p>
                </div>
            </div>
            <div className='w-full flex flex-col gap-y-4 justify-center items-stretch mx-auto my-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Connect Bank</CardTitle>
                        <Wallet className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <p className='text-xs text-muted-foreground'>Link your bank accounts to track your finances</p>
                        <Button
                            className='mt-4 w-full'
                            size='sm'
                            disabled={hasAccounts}>
                            {hasAccounts ? (
                                "Accounts Added"
                            ) : (
                                <Link to='/accounts'>
                                    <Button
                                        className='w-full'
                                        size='sm'>
                                        <PlusCircle className='mr-2 h-4 w-4' />
                                        Add Account
                                    </Button>
                                </Link>
                            )}
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Set Budget</CardTitle>
                        <PieChart className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <p className='text-xs text-muted-foreground'>Create a budget to manage your spending</p>
                        <Button
                            className='mt-4 w-full'
                            size='sm'
                            disabled={hasBudgets}>
                            {hasBudgets ? (
                                "Budget Set"
                            ) : (
                                <Link to='/budget'>
                                    <Button
                                        className='w-full'
                                        size='sm'>
                                        <PlusCircle className='mr-2 h-4 w-4' />
                                        Create Budget
                                    </Button>
                                </Link>
                            )}
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Add Goals</CardTitle>
                        <Target className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <p className='text-xs text-muted-foreground'>Set financial goals to work towards</p>
                        <Button
                            className='mt-4 w-full'
                            size='sm'
                            disabled={hasGoals}>
                            {hasGoals ? (
                                "Goals Added"
                            ) : (
                                <Link to='/accounts'>
                                    <Button
                                        className='w-full'
                                        size='sm'>
                                        <PlusCircle className='mr-2 h-4 w-4' />
                                        Add Goals
                                    </Button>
                                </Link>
                            )}
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium'>Track Expenses</CardTitle>
                        <CreditCard className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <p className='text-xs text-muted-foreground'>Start logging your expenses to gain insights</p>
                        <Button
                            className='mt-4 w-full'
                            size='sm'
                            disabled={hasTransactions}>
                            {hasTransactions ? (
                                "Expenses Logged"
                            ) : (
                                <Link to='/transactions'>
                                    <Button
                                        className='w-full'
                                        size='sm'>
                                        <PlusCircle className='mr-2 h-4 w-4' />
                                        Log Expense
                                    </Button>
                                </Link>
                            )}
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle>Complete Your Profile</CardTitle>
                        <UserCircle className='h-4 w-4 text-muted-foreground' />
                    </CardHeader>
                    <CardContent>
                        <Link to='/profile'>
                            <p>Check out your profile</p>
                            <Button className='mt-4 w-full'>
                                <ArrowRight className='ml-2 h-4 w-4' />
                                Go to Profile
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;
