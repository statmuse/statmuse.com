/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string
  readonly GAMERA_API_URL: string
  readonly KANEDAMA_API_URL: string
  readonly SHORT_LINK_URL: string
  readonly PUBLIC_AUTH_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  interface Locals {
    session: import('@lib/session').Session
    visitor: import('@statmuse/core/visitor').Visitor
    user?: import('@statmuse/core/user').User
  }
}
