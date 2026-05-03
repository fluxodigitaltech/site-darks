/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOCODB_API_TOKEN: string;
  readonly VITE_NOCODB_BASE_URL: string;
  readonly VITE_NOCODB_UNITS_TABLE_ID: string;
  readonly VITE_NOCODB_UNITS_VIEW_ID?: string;
  readonly VITE_EVO_API_KEY_SANTO_ANDRE: string;
  readonly VITE_EVO_API_KEY_MAUA: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}