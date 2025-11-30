'use server';

import { getSdks } from '@/firebase/admin-init';
import { verifyAdminFromToken } from './users/actions';

export async function getDashboardStats(idToken: string) {
    const { isAdmin, error } = await verifyAdminFromToken(idToken);
    if (!isAdmin) {
        return { success: false, error };
    }

    try {
        const { firestore } = getSdks();

        // 1. Count Vehicles (cars)
        const carsSnapshot = await firestore.collection('cars').count().get();
        const totalVehicles = carsSnapshot.data().count;

        // 2. Count Users
        const usersSnapshot = await firestore.collection('users').count().get();
        const totalUsers = usersSnapshot.data().count;

        // 3. Count Active Leads (users with copartConsultation.status IN ['active', 'in-progress'])
        // Note: Firestore count() with filters is efficient.
        const activeLeadsSnapshot = await firestore.collection('users')
            .where('copartConsultation.status', 'in', ['active', 'in-progress'])
            .count()
            .get();
        const activeLeads = activeLeadsSnapshot.data().count;

        return {
            success: true,
            data: {
                totalVehicles,
                totalUsers,
                activeLeads
            }
        };
    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        return { success: false, error: error.message };
    }
}
