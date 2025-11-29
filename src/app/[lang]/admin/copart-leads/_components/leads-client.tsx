'use client';

import { useEffect, useState } from 'react';
import type { UserProfile } from '@/lib/user-profile';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DataTable } from '@/app/admin/components/data-table';
import { copartColumns } from './leads-table/copart-columns';
import { sumColumns } from './leads-table/sum-columns';
import { getLeads, updateLeadStatus } from '../actions';
import { useUser } from '@/firebase';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { SumLead } from '@/lib/schemas';

export default function LeadsClient({ dict, lang }: { dict: any; lang: string }) {
  const { toast } = useToast();
  const { user: currentUser } = useUser();
  const [copartLeads, setCopartLeads] = useState<UserProfile[]>([]);
  const [sumLeads, setSumLeads] = useState<SumLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = dict.admin_leads_page;

  useEffect(() => {
    const fetchLeads = async () => {
        if (!currentUser) return;

        setIsLoading(true);
        setError(null);
        try {
            const idToken = await currentUser.getIdToken(true);
            const result = await getLeads(idToken);
            if (result.success) {
                setCopartLeads(result.data?.copartLeads || []);
                setSumLeads(result.data?.sumLeads || []);
            } else {
                throw new Error(result.error || 'Error al obtener los leads.');
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    if(currentUser) {
        fetchLeads();
    }
  }, [currentUser]);

  const handleStatusChange = async (leadId: string, newStatus: 'active' | 'in-progress' | 'finished', type: 'copart' | 'sum') => {
    if (!currentUser) return;

    try {
        const idToken = await currentUser.getIdToken(true);
        const result = await updateLeadStatus(idToken, leadId, newStatus, type);

        if (result.success) {
            if (type === 'copart') {
                setCopartLeads(currentLeads => currentLeads.map(l => l.id === leadId ? { ...l, copartConsultation: { ...l.copartConsultation!, status: newStatus } } : l));
            } else {
                setSumLeads(currentLeads => currentLeads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
            }
            toast({
                title: 'Estado Actualizado',
                description: `El estado del lead se ha actualizado a ${newStatus}.`,
            });
        } else {
            throw new Error(result.error || 'No se pudo actualizar el estado.');
        }
    } catch(e: any) {
         toast({
            variant: "destructive",
            title: 'Error al cambiar estado',
            description: e.message,
        });
    }
  };

  const copartTableColumns = copartColumns({ 
    onStatusChange: (user, status) => handleStatusChange(user.id, status, 'copart'),
    dict: dict,
    lang: lang
  });
  
  const sumTableColumns = sumColumns({ 
    onStatusChange: (lead, status) => handleStatusChange(lead.id, status, 'sum'),
    dict: dict,
    lang: lang
  });

  const activeCopartLeads = copartLeads.filter(l => l.copartConsultation?.status !== 'finished');
  const finishedCopartLeads = copartLeads.filter(l => l.copartConsultation?.status === 'finished');

  const activeSumLeads = sumLeads.filter(l => l.status !== 'finished');
  const finishedSumLeads = sumLeads.filter(l => l.status === 'finished');

  if (isLoading) {
    return (
        <div className="container py-12">
            <PageHeader title={t.title} description={t.description} />
            <div className="space-y-4 max-w-6xl mx-auto">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="container py-12 max-w-6xl mx-auto">
             <PageHeader title="Error" description="No se pudieron cargar los leads." />
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error del Servidor</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    )
  }
  
  return (
    <>
      <div className="container py-12">
        <PageHeader title={t.title} description={t.description} />
        <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <Button asChild variant="outline">
                <Link href={`/${lang}/admin`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {dict.admin_vehicles_page.back_to_panel}
                </Link>
              </Button>
            </div>
            
            <Tabs defaultValue="copart" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="copart">{t.copart_leads_tab}</TabsTrigger>
                    <TabsTrigger value="sum">{t.sum_leads_tab}</TabsTrigger>
                </TabsList>
                <TabsContent value="copart" className="mt-4">
                    <Tabs defaultValue="active" className="w-full">
                        <TabsList>
                            <TabsTrigger value="active">{t.active_leads_tab}</TabsTrigger>
                            <TabsTrigger value="finished">{t.finished_leads_tab}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="active" className="mt-4">
                            <DataTable 
                                columns={copartTableColumns} 
                                data={activeCopartLeads}
                                filterColumnId='names'
                                filterPlaceholder={t.filter_placeholder}
                                dict={dict}
                            />
                        </TabsContent>
                        <TabsContent value="finished" className="mt-4">
                            <DataTable 
                                columns={copartTableColumns} 
                                data={finishedCopartLeads}
                                filterColumnId='names'
                                filterPlaceholder={t.filter_placeholder}
                                dict={dict}
                            />
                        </TabsContent>
                    </Tabs>
                </TabsContent>
                <TabsContent value="sum" className="mt-4">
                     <Tabs defaultValue="active" className="w-full">
                        <TabsList>
                            <TabsTrigger value="active">{t.active_leads_tab}</TabsTrigger>
                            <TabsTrigger value="finished">{t.finished_leads_tab}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="active" className="mt-4">
                            <DataTable 
                                columns={sumTableColumns} 
                                data={activeSumLeads}
                                filterColumnId='user'
                                filterPlaceholder={t.filter_placeholder}
                                dict={dict}
                            />
                        </TabsContent>
                        <TabsContent value="finished" className="mt-4">
                            <DataTable 
                                columns={sumTableColumns} 
                                data={finishedSumLeads}
                                filterColumnId='user'
                                filterPlaceholder={t.filter_placeholder}
                                dict={dict}
                            />
                        </TabsContent>
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </>
  );
}
