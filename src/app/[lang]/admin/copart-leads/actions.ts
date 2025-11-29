'use server';

import { getSdks } from '@/firebase/admin-init';
import type { UserProfile } from '@/lib/user-profile';
import type { SumLead } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { verifyAdminFromToken } from '@/app/[lang]/admin/users/actions';


async function getCopartLeads(firestore: FirebaseFirestore.Firestore): Promise<UserProfile[]> {
    const usersSnapshot = await firestore.collection('users')
        .where('copartConsultation', '!=', null)
        .get();
    
    if (usersSnapshot.empty) return [];

    const leadsWithPurchasesPromises = usersSnapshot.docs.map(async (doc) => {
        const lead = { id: doc.id, ...doc.data() } as UserProfile;
        
        if (lead.copartConsultation?.paymentId) {
            const purchaseQuery = await firestore.collection('users').doc(lead.id).collection('purchases')
                .where('paymentId', '==', lead.copartConsultation.paymentId)
                .limit(1)
                .get();

            if (!purchaseQuery.empty) {
                const purchaseDoc = purchaseQuery.docs[0];
                lead.copartConsultation.purchase = purchaseDoc.data() as any;
            }
        }
        return lead;
    });
    
    return await Promise.all(leadsWithPurchasesPromises);
}

async function getSumLeads(firestore: FirebaseFirestore.Firestore): Promise<SumLead[]> {
    const leadsSnapshot = await firestore.collection('sum_leads').orderBy('submissionDate', 'desc').get();
    if (leadsSnapshot.empty) return [];
    
    const userIds = leadsSnapshot.docs.map(doc => doc.data().userId).filter(Boolean);
    const users: Record<string, UserProfile> = {};

    if (userIds.length > 0) {
        // Firestore 'in' queries are limited to 30 items.
        // We need to chunk the userIds array if it's larger.
        const chunks: string[][] = [];
        for (let i = 0; i < userIds.length; i += 30) {
            chunks.push(userIds.slice(i, i + 30));
        }

        for (const chunk of chunks) {
            const usersSnapshot = await firestore.collection('users').where('id', 'in', chunk).get();
            usersSnapshot.forEach(doc => {
                users[doc.id] = doc.data() as UserProfile;
            });
        }
    }

    const leadsData = leadsSnapshot.docs.map(doc => {
        const lead = { id: doc.id, ...doc.data() } as SumLead;
        if (lead.userId && users[lead.userId]) {
            lead.user = users[lead.userId];
        }
        return lead;
    });

    return leadsData;
}


export async function getLeads(idToken: string): Promise<{ success: boolean; data?: { copartLeads: UserProfile[], sumLeads: SumLead[] }; error?: string; }> {
    const { isAdmin, error: authError } = await verifyAdminFromToken(idToken);
    if (!isAdmin) {
        return { success: false, error: authError };
    }

    try {
        const { firestore } = getSdks();
        
        const [copartLeads, sumLeads] = await Promise.all([
            getCopartLeads(firestore),
            getSumLeads(firestore)
        ]);

        const data = {
            copartLeads: JSON.parse(JSON.stringify(copartLeads)),
            sumLeads: JSON.parse(JSON.stringify(sumLeads)),
        };

        return { success: true, data };
    } catch (error) {
        console.error("Error fetching leads:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown server error occurred.";
        return { success: false, error: errorMessage };
    }
}

export async function updateLeadStatus(idToken: string, leadId: string, status: 'active' | 'in-progress' | 'finished', type: 'copart' | 'sum'): Promise<{ success: boolean; error?: string }> {
    const { isAdmin, error: authError } = await verifyAdminFromToken(idToken);
    if (!isAdmin) {
        return { success: false, error: authError };
    }

    try {
        const { firestore } = getSdks();
        let docRef;

        if (type === 'copart') {
            docRef = firestore.collection('users').doc(leadId);
            if (status === 'finished') {
                await docRef.update({
                  'copartConsultation': FieldValue.delete()
                });
            } else {
                await docRef.update({ 'copartConsultation.status': status });
            }
        } else {
            docRef = firestore.collection('sum_leads').doc(leadId);
            await docRef.update({ status: status });
        }
        
        revalidatePath('/[lang]/admin/copart-leads', 'page');

        return { success: true };
    } catch (error: any) {
        console.error("Error updating lead status:", error);
        return { success: false, error: error.message };
    }
}
