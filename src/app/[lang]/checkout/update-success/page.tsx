
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/lib/i18n-config';
import SuccessContent from './_components/success-content';

export default async function UpdateSuccessPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    
    return <SuccessContent dict={dict} lang={lang} />;
}
