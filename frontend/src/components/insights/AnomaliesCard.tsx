import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { currencyNotation } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { AnomalyData } from "@/types/insights.types";

interface Props {
    anomalies: AnomalyData[];
}

export const AnomaliesCard = ({ anomalies }: Props) => {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-lg font-medium'>Unusual Spending</CardTitle>
                <AlertCircle className='size-5 text-muted-foreground' />
            </CardHeader>
            <CardContent className='pt-2'>
                {anomalies.length > 0 ? (
                    <div className='space-y-4'>
                        {anomalies.map((anomaly, index) => (
                            <div
                                key={index}
                                className='p-3 border rounded-lg'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <p className='font-medium'>{anomaly.description}</p>
                                        <p className='text-sm text-muted-foreground'>
                                            {anomaly.category} • {new Date(anomaly.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className='font-semibold text-red-500'>
                                        {currencyNotation(anomaly.amount)}
                                    </span>
                                </div>
                                <div className='text-xs text-muted-foreground mt-1'>
                                    {anomaly.deviation.toFixed(1)}x higher than usual
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState message='No anomalies detected' />
                )}
            </CardContent>
        </Card>
    );
};

export default AnomaliesCard;
