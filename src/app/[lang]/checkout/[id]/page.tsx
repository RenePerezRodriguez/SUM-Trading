import { redirect } from 'next/navigation';

export default async function CheckoutRedirect({ params }: { params: Promise<{ id: string; lang: string }> }) {
  const { id, lang } = await params;
  redirect(`/${lang}/payment/copart?vehicleId=${id}`);
}
