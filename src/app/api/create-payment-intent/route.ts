import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

const findOrCreateCustomer = async (userId: string, email?: string | null, name?: string | null, phone?: string | null, countryCode?: string | null): Promise<Stripe.Customer> => {
  const existingCustomers = await stripe.customers.search({
    query: `metadata['firebase_uid']:'${userId}'`,
    limit: 1,
  });

  let customer: Stripe.Customer;

  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0];
    const updatePayload: Stripe.CustomerUpdateParams = {};
    if (name && customer.name !== name) updatePayload.name = name;
    if (phone && customer.phone !== phone) updatePayload.phone = phone;
    if (countryCode && customer.address?.country !== countryCode) {
      updatePayload.address = { country: countryCode };
    }
    if (Object.keys(updatePayload).length > 0) {
      customer = await stripe.customers.update(customer.id, updatePayload);
    }
  } else {
    const createPayload: Stripe.CustomerCreateParams = {
      email: email || undefined,
      metadata: { firebase_uid: userId },
    };
    if (name) createPayload.name = name;
    if (phone) createPayload.phone = phone;
    if (countryCode) createPayload.address = { country: countryCode };

    customer = await stripe.customers.create(createPayload);
  }

  // Final check: if customer exists but needs address for a non-USD currency, update it.
  if (!customer.address && countryCode) {
    customer = await stripe.customers.update(customer.id, { address: { country: countryCode } });
  }

  return customer;
};


export async function POST(request: Request) {
  try {
    const { amount, currency, user, metadata, description } = await request.json();

    if (!amount || !currency || !user || !user.id) {
      return NextResponse.json({ error: { message: 'Missing required parameters' } }, { status: 400 });
    }

    const customer = await findOrCreateCustomer(user.id, user.email, user.name, user.phone, user.country);

    if (!customer.address?.country && currency !== 'usd') {
      return NextResponse.json({ error: { message: 'Customer country is required for payment processing.' } }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      customer: customer.id,
      description: description,
      metadata: metadata,
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });

  } catch (err: any) {
    console.error('Error creating Stripe PaymentIntent:', err);
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
