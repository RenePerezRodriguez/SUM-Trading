
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ServerCrash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ClarityMetric {
    metricName: string;
    information: {
        totalSessionCount: string;
        totalBotSessionCount: string;
        distantUserCount: string;
        PagesPerSessionPercentage?: number; // Make it optional
        [key: string]: any; // For dynamic dimensions
    }[];
}

function MetricCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-20 w-full" />
            </CardContent>
        </Card>
    )
}

function AnalyticsTable({ metric, dimension, dict }: { metric: ClarityMetric; dimension: string, dict: any }) {
    const t = dict.admin_analytics_page;
    const metricTitle = t.metrics[metric.metricName] || metric.metricName;
    const dimensionHeader = t.dimensions[dimension.toLowerCase() as keyof typeof t.dimensions] || dimension;
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>{metricTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{dimensionHeader}</TableHead>
                            <TableHead className="text-right">{t.headers.sessions}</TableHead>
                            <TableHead className="text-right">{t.headers.users}</TableHead>
                            <TableHead className="text-right">{t.headers.pages_per_session}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {metric.information.map((info, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{info[dimension]}</TableCell>
                                <TableCell className="text-right">{parseInt(info.totalSessionCount, 10).toLocaleString()}</TableCell>
                                <TableCell className="text-right">{parseInt(info.distantUserCount, 10).toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    {typeof info.PagesPerSessionPercentage === 'number' 
                                        ? info.PagesPerSessionPercentage.toFixed(2) 
                                        : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}


export default function AnalyticsClient({ dict }: { dict: any }) {
    const [data, setData] = useState<ClarityMetric[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [days, setDays] = useState('1');
    const [dimension, setDimension] = useState('OS');
    const t = dict.admin_analytics_page;

    const dimensions = [
        { value: 'OS', label: t.dimensions.os },
        { value: 'Browser', label: t.dimensions.browser },
        { value: 'Device', label: t.dimensions.device },
        { value: 'Country', label: t.dimensions.country },
        { value: 'URL', label: t.dimensions.url },
        { value: 'Source', label: t.dimensions.source },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/clarity-analytics?numOfDays=${days}&dimension1=${dimension}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch analytics data');
                }
                const result = await response.json();
                setData(result);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [days, dimension]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Select value={days} onValueChange={setDays}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">{t.time_ranges.last_24_hours}</SelectItem>
                            <SelectItem value="2">{t.time_ranges.last_48_hours}</SelectItem>
                            <SelectItem value="3">{t.time_ranges.last_72_hours}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1">
                    <Select value={dimension} onValueChange={setDimension}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select dimension" />
                        </SelectTrigger>
                        <SelectContent>
                            {dimensions.map(d => (
                                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading && (
                <div className="space-y-6">
                    <MetricCardSkeleton />
                </div>
            )}

            {error && (
                <Alert variant="destructive">
                    <ServerCrash className="h-4 w-4" />
                    <AlertTitle>{t.error_title}</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {data && !isLoading && !error && (
                <div className="space-y-6">
                    {data.map(metric => (
                        <AnalyticsTable key={metric.metricName} metric={metric} dimension={dimension} dict={dict} />
                    ))}
                </div>
            )}
        </div>
    )
}
