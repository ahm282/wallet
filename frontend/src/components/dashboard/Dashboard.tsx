import { FinancialSummaryCard } from "./FinancialSummaryCard";
import MonthlyIncomeTrendGraph from "./MonthlyIncomeTrendGraph";
import MonthlySpendingTrendGraph from "./MonthlySpendingTrendGraph";
import RecentActivityCard from "./RecentActivityCard";
import UpcomingBillsCard from "./UpcomingBillsCard";

export const Dashboard = ({ data }: { data: any }) => {
    return (
        <div className='w-11/12 md:w-10/12 lg:max-w-4xl 2xl:max-w-5xl my-8 mx-auto flex flex-col space-y-5'>
            {data.summary ? <FinancialSummaryCard data={data.summary} /> : null}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {data.income?.recent_activity ? <RecentActivityCard data={data.income.recent_activity} /> : null}
                {data.spending?.recent_activity ? <RecentActivityCard data={data.spending.recent_activity} /> : null}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                {data.income?.monthly_trend ? <MonthlyIncomeTrendGraph data={data.income.monthly_trend} /> : null}
                {data.spending?.monthly_trend ? <MonthlySpendingTrendGraph data={data.spending.monthly_trend} /> : null}
            </div>
            {data.bills?.upcoming ? <UpcomingBillsCard data={data.bills.upcoming} /> : null}
        </div>
    );
};

export default Dashboard;
