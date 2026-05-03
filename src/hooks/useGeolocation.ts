import { Coordinates } from "@/lib/geolocation";
import { useGeolocationContext } from "@/context/GeolocationContext";

interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook simples de leitura da geolocalização atual.
 * Mantém o parâmetro `enabled` para compatibilidade, mas a fonte de verdade
 * é sempre o GeolocationContext: assim evitamos múltiplas chamadas paralelas
 * a navigator.geolocation.getCurrentPosition.
 */
export function useGeolocation(enabled: boolean = true): GeolocationState {
  const { coordinates, loading, error, isEnabled, refetch } =
    useGeolocationContext();

  // Quando o caller pediu para ignorar a geolocalização, devolvemos null mesmo
  // que o contexto tenha valor (mantém o contrato anterior do hook).
  if (!enabled || !isEnabled) {
    return {
      coordinates: null,
      loading: false,
      error: null,
      refetch,
    };
  }

  return {
    coordinates,
    loading,
    error,
    refetch,
  };
}
