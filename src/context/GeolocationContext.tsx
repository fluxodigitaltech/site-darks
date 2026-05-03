"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Coordinates } from "@/lib/geolocation";

const GEOLOCATION_STORAGE_KEY = "geolocation_enabled";

interface GeolocationContextValue {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
  isEnabled: boolean;
  isSupported: boolean;
  toggle: () => void;
  refetch: () => void;
}

const GeolocationContext = createContext<GeolocationContextValue | undefined>(
  undefined
);

/**
 * Provider único para o estado de geolocalização do site.
 * Garante que apenas UMA chamada a navigator.geolocation.getCurrentPosition
 * seja feita por sessão (e não uma por componente que use o hook).
 *
 * Persiste a preferência do usuário (ligado/desligado) no localStorage.
 */
export const GeolocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isSupported =
    typeof navigator !== "undefined" && "geolocation" in navigator;

  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(GEOLOCATION_STORAGE_KEY);
    // Por padrão, ativada na primeira visita
    return stored === null ? true : stored === "true";
  });

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(isEnabled && isSupported);
  const [error, setError] = useState<string | null>(null);
  const [fetchKey, setFetchKey] = useState(0);

  const refetch = useCallback(() => {
    if (!isEnabled || !isSupported) return;
    setLoading(true);
    setError(null);
    setFetchKey((prev) => prev + 1);
  }, [isEnabled, isSupported]);

  const toggle = useCallback(() => {
    setIsEnabled((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(GEOLOCATION_STORAGE_KEY, String(next));
      } catch {
        /* quota / privacidade — silencia */
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      setCoordinates(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (!isSupported) {
      setCoordinates(null);
      setLoading(false);
      setError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const onSuccess = (position: GeolocationPosition) => {
      if (cancelled) return;
      setCoordinates({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
      setError(null);
    };

    const onError = (err: GeolocationPositionError) => {
      if (cancelled) return;
      let message = "Erro de geolocalização.";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          message = "Permissão de localização negada pelo usuário.";
          break;
        case err.POSITION_UNAVAILABLE:
          message = "Informação de localização indisponível.";
          break;
        case err.TIMEOUT:
          message = "Tempo limite excedido ao obter a localização.";
          break;
      }
      setCoordinates(null);
      setLoading(false);
      setError(message);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    });

    return () => {
      cancelled = true;
    };
  }, [isEnabled, isSupported, fetchKey]);

  const value = useMemo<GeolocationContextValue>(
    () => ({
      coordinates,
      loading,
      error,
      isEnabled,
      isSupported,
      toggle,
      refetch,
    }),
    [coordinates, loading, error, isEnabled, isSupported, toggle, refetch]
  );

  return (
    <GeolocationContext.Provider value={value}>
      {children}
    </GeolocationContext.Provider>
  );
};

/**
 * Hook para consumir o estado de geolocalização do Provider.
 * Caso o Provider não esteja na árvore, retorna um fallback seguro
 * (geolocalização desligada) ao invés de lançar erro — evita quebrar
 * páginas que ainda não foram migradas.
 */
export function useGeolocationContext(): GeolocationContextValue {
  const ctx = useContext(GeolocationContext);
  if (!ctx) {
    return {
      coordinates: null,
      loading: false,
      error: null,
      isEnabled: false,
      isSupported:
        typeof navigator !== "undefined" && "geolocation" in navigator,
      toggle: () => {
        /* no-op */
      },
      refetch: () => {
        /* no-op */
      },
    };
  }
  return ctx;
}
