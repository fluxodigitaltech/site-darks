import React from "react";
import { MapPin, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGeolocationContext } from "@/context/GeolocationContext";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const GeolocationStatusIndicator: React.FC = () => {
  const { coordinates, loading, error, isEnabled, isSupported, toggle, refetch } =
    useGeolocationContext();

  // Define ícone e classe com fallback seguro caso nenhuma condição combine.
  let icon: React.ReactNode = <MapPin className="h-5 w-5" />;
  let className = "text-muted-foreground/50";
  let statusLabel = "Geolocalização desativada";

  if (!isSupported) {
    icon = <XCircle className="h-5 w-5" />;
    className = "text-destructive";
    statusLabel = "Geolocalização não suportada";
  } else if (!isEnabled) {
    icon = <MapPin className="h-5 w-5" />;
    className = "text-muted-foreground/50";
    statusLabel = "Geolocalização desativada";
  } else if (loading) {
    icon = <Loader2 className="h-5 w-5 animate-spin" />;
    className = "text-muted-foreground";
    statusLabel = "Obtendo localização";
  } else if (error) {
    icon = <XCircle className="h-5 w-5" />;
    className = "text-destructive";
    statusLabel = `Erro: ${error}`;
  } else if (coordinates) {
    icon = <MapPin className="h-5 w-5" />;
    className = "text-primary";
    statusLabel = "Localização obtida";
  }

  // Se houver erro e a geolocalização estiver ativada, mostramos um botão de tentar novamente.
  const showRefetchButton = isEnabled && !!error && isSupported;

  return (
    <div className="flex items-center space-x-3">
      {/* Switch para Ativar/Desativar */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Localização
        </span>
        <Switch
          checked={isEnabled}
          onCheckedChange={toggle}
          disabled={!isSupported}
          aria-label={
            isEnabled ? "Desativar geolocalização" : "Ativar geolocalização"
          }
        />
      </div>

      {/* Ícone de Status */}
      <div
        className={cn(
          "p-2 rounded-full transition-colors duration-300",
          className
        )}
        role="status"
        aria-live="polite"
        aria-label={statusLabel}
        title={statusLabel}
      >
        {icon}
      </div>

      {/* Botão de Tentar Novamente (se houver erro) */}
      {showRefetchButton && (
        <Button onClick={refetch} size="sm" variant="outline" className="h-8">
          Tentar Novamente
        </Button>
      )}
    </div>
  );
};

export default GeolocationStatusIndicator;
