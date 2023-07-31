/// <reference types="astro/client-image" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string
  readonly GAMERA_API_URL: string
  readonly KANEDAMA_API_URL: string
  readonly SHORT_LINK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
