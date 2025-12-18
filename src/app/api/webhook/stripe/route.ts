import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { getSdks } from '@/firebase/admin-init';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function createPurchaseRecord(session: Stripe.Checkout.Session) {
    const { firestore } = getSdks();
    const { client_reference_id: userId, payment_intent } = session;

    if (!userId || !payment_intent) {
        console.error('Missing userId or payment_intent in session');
        return;
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent as string);

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        const purchaseData = {
            id: paymentIntent.id,
            userId: userId,
            purchaseDate: new Date(session.created * 1000).toISOString(),
            total: session.amount_total! / 100,
            paymentId: paymentIntent.id,
            purchaseType: 'Car Purchase',
            items: lineItems.data.map(item => ({
                type: 'car',
                name: item.description,
                price: item.amount_total / 100,
                quantity: item.quantity,
            })),
        };

        await firestore.collection('users').doc(userId).collection('purchases').doc(paymentIntent.id).set(purchaseData);
        console.log(`Purchase record created for user ${userId}`);

    } catch (error) {
        console.error('Error creating purchase record:', error);
    }
}


export async function POST(request: Request) {
    const sig = (await headers()).get('stripe-signature')!;
    const body = await request.text();

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;
            console.log('Checkout session completed:', session.id);
            // We are not creating purchase records from the webhook anymore
            // It is handled on the client after successful payment confirmation.
            break;
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            // The logic for 'Copart Consultation' is handled client-side upon successful payment.
            // This webhook listener can be extended in the future for other payment types.
            console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
