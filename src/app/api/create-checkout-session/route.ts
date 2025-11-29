import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function POST(request: Request) {
  const { cartDetails, lang, userProfile } = await request.json();

  if (!cartDetails || !Array.isArray(cartDetails) || cartDetails.length === 0 || !userProfile) {
    return NextResponse.json({ error: 'Invalid cart or user details' }, { status: 400 });
  }

  const headersList = await headers();
  const origin = headersList.get('origin') || 'http://localhost:9002';
  
  const successUrl = `${origin}/${lang}/checkout/success`;
  const cancelUrl = `${origin}/${lang}/buy/${cartDetails.map(c => c.id).join(',')}`;

  try {
    // Find or create a Stripe customer
    const existingCustomers = await stripe.customers.list({ email: userProfile.email, limit: 1 });
    let customer;
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: userProfile.email,
        name: `${userProfile.names} ${userProfile.firstLastName}`,
        phone: userProfile.phoneNumber,
        metadata: {
          firebase_uid: userProfile.id
        }
      });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartDetails.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${item.make} ${item.model}`,
          description: `${item.year} - ${item.vin}`,
          images: item.images.length > 0 ? [item.images[0].url] : [],
        },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      locale: lang === 'es' ? 'es' : 'en',
      customer: customer.id,
      invoice_creation: { enabled: true },
    });

    return NextResponse.json({ sessionId: session.id });

  } catch (err: any) {
    console.error('Error creating Stripe session:', err);
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
