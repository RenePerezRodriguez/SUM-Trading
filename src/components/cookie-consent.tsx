'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/dictionaries';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });
  const [dict, setDict] = useState<any>(null);
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'es';

  useEffect(() => {
    // Load dictionary
    getDictionary(lang as 'en' | 'es').then(setDict);
    
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('cookie_consent');
    if (!consentChoice) {
      setShowConsent(true);
    }
  }, [lang]);

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setShowConsent(false);
    // Load analytics scripts if needed
    loadAnalytics();
  };

  const handleRejectAll = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setShowConsent(false);
  };

  const handleCustom = () => {
    const consent = {
      necessary: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    setShowConsent(false);
    
    if (preferences.analytics) {
      loadAnalytics();
    }
  };

  const loadAnalytics = () => {
    // Load Google Analytics or similar
    if (typeof window !== 'undefined' && preferences.analytics) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        ((window as any).dataLayer as any[]).push(args);
      }
      (window as any).gtag = gtag;
      gtag('js', new Date());
      gtag('config', process.env.NEXT_PUBLIC_GA_ID);
    }
  };

  if (!showConsent || !dict || !dict.common?.cookie_consent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Message */}
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">🍪 {dict.common.cookie_consent.title}</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {dict.common.cookie_consent.message}{' '}
              <a href={`/${lang}/privacy-policy`} className="text-accent hover:text-accent/80 underline">
                {dict.common.cookie_consent.privacy_link}
              </a>{' '}
              {dict.common.cookie_consent.privacy_link_suffix}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
            <button
              onClick={handleRejectAll}
              className="px-4 sm:px-6 py-2 text-sm bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium rounded-lg transition"
            >
              {dict.common.cookie_consent.reject_all}
            </button>
            <button
              onClick={() => setShowConsent(false)}
              className="px-4 sm:px-6 py-2 text-sm bg-accent/20 hover:bg-accent/30 text-accent-foreground font-medium rounded-lg transition"
            >
              ⚙️ {dict.common.cookie_consent.customize}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 sm:px-6 py-2 text-sm bg-accent hover:bg-accent/90 text-accent-foreground font-medium rounded-lg transition"
            >
              {dict.common.cookie_consent.accept_all}
            </button>
          </div>
        </div>

        {/* Custom Preferences Panel */}
        <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-secondary">
          <h4 className="text-white font-semibold mb-4">{dict.common.cookie_consent.customize_title}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Necessary */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="necessary"
                checked={true}
                disabled
                className="w-4 h-4 rounded bg-secondary cursor-not-allowed"
              />
              <label htmlFor="necessary" className="ml-3 text-muted-foreground">
                <span className="font-medium text-white">{dict.common.cookie_consent.necessary}</span>
                <span className="text-xs block text-muted-foreground/80">{dict.common.cookie_consent.necessary_desc}</span>
              </label>
            </div>

            {/* Analytics */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="analytics"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="w-4 h-4 rounded bg-secondary cursor-pointer"
              />
              <label htmlFor="analytics" className="ml-3 text-muted-foreground cursor-pointer">
                <span className="font-medium text-white">{dict.common.cookie_consent.analytics}</span>
                <span className="text-xs block text-muted-foreground/80">{dict.common.cookie_consent.analytics_desc}</span>
              </label>
            </div>

            {/* Marketing */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="marketing"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                className="w-4 h-4 rounded bg-secondary cursor-pointer"
              />
              <label htmlFor="marketing" className="ml-3 text-muted-foreground cursor-pointer">
                <span className="font-medium text-white">{dict.common.cookie_consent.marketing}</span>
                <span className="text-xs block text-muted-foreground/80">{dict.common.cookie_consent.marketing_desc}</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowConsent(false)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition"
            >
              {dict.common.cookie_consent.close}
            </button>
            <button
              onClick={handleCustom}
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg transition"
            >
              {dict.common.cookie_consent.save_preferences}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
