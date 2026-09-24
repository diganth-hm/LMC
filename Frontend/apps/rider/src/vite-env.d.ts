/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly EXPO_PUBLIC_USE_MOCKS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
