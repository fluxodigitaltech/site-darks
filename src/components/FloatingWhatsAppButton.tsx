import React from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingWhatsAppButton = () => {
  // Substitua este número pelo número de WhatsApp desejado (incluindo código do país)
  // Usando o número padrão do NocoDB para consistência
  const whatsappNumber = "5511999999999"; 
  const message = "Olá, gostaria de mais informações sobre a DARK'SGYM!";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
      }}
      className={cn(
        "fixed right-[4.75rem] sm:right-24 z-50",
        "h-14 w-14 rounded-full",
        "bg-primary text-primary-foreground",
        "flex items-center justify-center",
        "shadow-lg hover:shadow-primary/50 transition-all duration-300",
        "transform hover:scale-110",
        "hover:animate-button-glow"
      )}
    >
      <MessageSquare className="h-7 w-7" />
    </a>
  );
};

export default FloatingWhatsAppButton;