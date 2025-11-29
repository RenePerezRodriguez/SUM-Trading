'use client';

import { Share2, Copy, MessageCircle, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ShareModalProps {
  title: string;
  lotNumber: string;
  imageUrl: string | null;
  currentBid: number;
  lang: string;
  onClose: () => void;
}

export function ShareModal({ title, lotNumber, imageUrl, currentBid, lang, onClose, dict }: ShareModalProps & { dict?: any }) {
  const [copied, setCopied] = useState(false);

  const vehicleUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${lang}/copart/${lotNumber}`;
  const shareMessage = dict?.share?.share_vehicle || 'Check out this auction vehicle';
  const currentBidLabel = dict?.common?.vehicle_comparator?.current_bid || 'Current bid';
  const message = `${shareMessage}: ${title} - ${currentBidLabel}: $${currentBid?.toLocaleString()} - ${vehicleUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(vehicleUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Vehículo en Subasta: ${title}`;
    const body = `${message}\n\nMira más detalles en: ${vehicleUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
        <div>
          <h2 className="text-xl font-bold">Compartir Vehículo</h2>
          <p className="text-sm text-muted-foreground mt-1">{title}</p>
        </div>

        <div className="space-y-3">
          {/* Copy Link */}
          <Button
            onClick={handleCopyLink}
            className="w-full justify-start gap-3 h-auto py-3"
            variant="outline"
          >
            <Copy className="h-5 w-5" />
            <div className="text-left flex-grow">
              <p className="font-semibold text-sm">{copied ? 'Link Copiado!' : 'Copiar Link'}</p>
              <p className="text-xs text-muted-foreground truncate">{vehicleUrl}</p>
            </div>
            {copied && <Check className="h-5 w-5 text-green-500" />}
          </Button>

          {/* WhatsApp */}
          <Button
            onClick={handleShareWhatsApp}
            className="w-full justify-start gap-3 h-auto py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <MessageCircle className="h-5 w-5" />
            <div className="text-left flex-grow">
              <p className="font-semibold text-sm">Compartir en WhatsApp</p>
              <p className="text-xs opacity-90">Enviar a tus contactos</p>
            </div>
          </Button>

          {/* Email */}
          <Button
            onClick={handleShareEmail}
            className="w-full justify-start gap-3 h-auto py-3 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Mail className="h-5 w-5" />
            <div className="text-left flex-grow">
              <p className="font-semibold text-sm">Compartir por Email</p>
              <p className="text-xs opacity-90">Abrir tu cliente de email</p>
            </div>
          </Button>
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full"
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
}
