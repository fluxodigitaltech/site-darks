import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { calculateDistance, Coordinates } from "@/lib/geolocation";

// Define a estrutura baseada nos campos da sua tabela NocoDB
export interface NocoDBUnit {
  Id: number; // NocoDB usa 'Id' para o ID do registro
  Unidade: string;
  Endereco?: string; // Endereço público (pode estar vazio se a coluna não existir)
  Horario: string;
  Modalidade?: string;
  Foto?: string; // URL ou attachment da foto
  WhatsApp?: string;
  Descricao?: string;
  Latitude: number;
  Longitude: number;
  Status?: string;
  DataCadastro?: string;
  Categoria?: string; // 'Funcionando' | 'Em Breve' (substitui o antigo campo "Em Breve")
  Promocao?: boolean | string; // boolean ou SingleSelect ("Sim"/"Não")
  Instagram?: string;
  'Link de compra'?: string;
  'Em Breve'?: boolean; // mantido para retro-compatibilidade
  idBranch?: number; // ID da filial da API EVO
}

export interface UnitWithDistance extends NocoDBUnit {
  distanceKm?: number;
}

// Configurações da API NocoDB (lidas de variáveis de ambiente).
// Defina em .env.local (e no painel da Vercel) as três variáveis abaixo.
const NOCODB_BASE_URL =
  import.meta.env.VITE_NOCODB_BASE_URL ?? "https://desk-nocodb.5y4hfw.easypanel.host";
const NOCODB_TABLE_ID =
  import.meta.env.VITE_NOCODB_UNITS_TABLE_ID ?? "mm3pfo9m30lo9zm";
const NOCODB_VIEW_ID = import.meta.env.VITE_NOCODB_UNITS_VIEW_ID; // opcional
const NOCODB_API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN;

const fetchUnits = async (): Promise<NocoDBUnit[]> => {
  const params = new URLSearchParams({ limit: "100", sort: "-Id" });
  if (NOCODB_VIEW_ID) params.set("viewId", NOCODB_VIEW_ID);

  const url = `${NOCODB_BASE_URL}/api/v2/tables/${NOCODB_TABLE_ID}/records?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "xc-token": NOCODB_API_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch units data: ${response.statusText}`);
  }

  const data = await response.json();
  
  // NocoDB retorna um objeto com um array 'list'.
  if (data && Array.isArray(data.list)) {
      return data.list as NocoDBUnit[];
  }
  
  console.error("Unexpected NocoDB API response structure:", data);
  throw new Error("Received unexpected data structure from NocoDB API.");
};

export function useUnitsData(userCoords: Coordinates | null) {
  const queryResult = useQuery<NocoDBUnit[], Error>({
    queryKey: ["unitsData"],
    queryFn: fetchUnits,
  });

  // Calcula a distância de cada unidade ao usuário e ordena por proximidade.
  // useMemo mantém a referência estável quando os dados/coordenadas não mudam.
  const processedData = useMemo<UnitWithDistance[]>(() => {
    if (!queryResult.data) return [];

    const mapped = queryResult.data.map((unit) => {
      const unitLat = parseFloat(String(unit.Latitude));
      const unitLon = parseFloat(String(unit.Longitude));

      let distanceKm: number | undefined;
      if (
        userCoords &&
        Number.isFinite(unitLat) &&
        Number.isFinite(unitLon)
      ) {
        const raw = calculateDistance(
          userCoords.latitude,
          userCoords.longitude,
          unitLat,
          unitLon
        );
        distanceKm = parseFloat(raw.toFixed(1));
      }

      return {
        ...unit,
        distanceKm,
      } as UnitWithDistance;
    });

    if (userCoords && mapped.length > 0) {
      // Cria uma cópia para não mutar o array original retornado pelo .map()
      return [...mapped].sort((a, b) => {
        if (a.distanceKm === undefined && b.distanceKm === undefined) return 0;
        if (a.distanceKm === undefined) return 1;
        if (b.distanceKm === undefined) return -1;
        return a.distanceKm - b.distanceKm;
      });
    }

    return mapped;
  }, [queryResult.data, userCoords]);

  return {
    ...queryResult,
    data: processedData,
  };
}