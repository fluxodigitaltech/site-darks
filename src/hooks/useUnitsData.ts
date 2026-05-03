import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { calculateDistance, Coordinates } from "@/lib/geolocation";

// Define a estrutura baseada nos campos da sua tabela NocoDB
export interface NocoDBUnit {
  Id: number; // NocoDB usa 'Id' para o ID do registro
  Unidade: string;
  Endereco: string; // Mantendo Endereco para a exibição pública
  Horario: string;
  Modalidade?: string;
  Foto?: string; // URL da foto
  WhatsApp?: string;
  Descricao?: string;
  Latitude: number;
  Longitude: number;
  Status?: string;
  DataCadastro?: string;
  Promocao?: boolean; // Assumindo boolean para 'Promocao'
  Instagram?: string; // URL do Instagram
  'Link de compra'?: string; // Link de compra
  'Em Breve'?: boolean; // Assumindo boolean para 'Em Breve'
  idBranch?: number; // NOVO: ID da filial da API EVO
}

export interface UnitWithDistance extends NocoDBUnit {
  distanceKm?: number;
}

// Configurações da API NocoDB (sugiro mover para variáveis de ambiente)
const NOCODB_API_BASE_URL = "https://auto-nocodb.fesqdn.easypanel.host/api/v2/tables";
const NOCODB_TABLE_ID = "m02vprrpto5vac3"; // ID da tabela "cadastro-de-unidades"
const NOCODB_VIEW_ID = "vw97xyuevbzk8sj0"; // ID da visualização
const NOCODB_API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN; // Usando variável de ambiente

const fetchUnits = async (): Promise<NocoDBUnit[]> => {
  const url = `${NOCODB_API_BASE_URL}/${NOCODB_TABLE_ID}/records?viewId=${NOCODB_VIEW_ID}&limit=100&sort=-Id`; // Adicionado sort para consistência
  
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