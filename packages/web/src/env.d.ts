/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string
  readonly GAMERA_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
