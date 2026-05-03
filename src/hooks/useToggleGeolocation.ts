import { Coordinates } from "@/lib/geolocation";
import { useGeolocationContext } from "@/context/GeolocationContext";

interface ToggleGeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
  isEnabled: boolean;
  toggle: () => void;
  refetch: () => void;
}

/**
 * Mantido para compatibilidade com componentes que já usam essa API.
 * Internamente apenas consome o GeolocationContext, garantindo que
 * exista uma única fonte de verdade para a localização do usuário.
 */
export function useToggleGeolocation(): ToggleGeolocationState {
  const { coordinates, loading, error, isEnabled, toggle, refetch } =
    useGeolocationContext();

  return {
    coordinates,
    loading,
    error,
    isEnabled,
    toggle,
    refetch,
  };
}
