
type FooterCopyrightProps = {
  rightsText: string;
  creditsPrefix: string;
};

export default function FooterCopyright({ rightsText, creditsPrefix }: FooterCopyrightProps) {
  const currentYear = new Date().getFullYear();
  return (
    <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-muted-foreground gap-3 sm:gap-2 text-center sm:text-left">
      <p className="order-2 sm:order-1">&copy; {currentYear} Portal de SUM Trading. {rightsText}</p>
      <p className="order-1 sm:order-2">
        {creditsPrefix}{' '}
        <a 
          href="https://safesoft.tech" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
        >
          safesoft.tech
        </a>
      </p>
    </div>
  );
}
