import React from 'react';
import { Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingInstagramButton = () => {
  return (
    <a
      href="https://www.instagram.com/darks.gym/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Siga-nos no Instagram"
      style={{
        bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
      }}
      className={cn(
        "fixed right-4 sm:right-6 z-50",
        "h-14 w-14 rounded-full",
        "bg-primary text-primary-foreground",
        "flex items-center justify-center",
        "shadow-lg hover:shadow-primary/50 transition-all duration-300",
        "transform hover:scale-110",
        "hover:animate-button-glow"
      )}
    >
      <Instagram className="h-7 w-7" />
    </a>
  );
};

export default FloatingInstagramButton;