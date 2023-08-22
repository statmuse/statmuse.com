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

type VisitorSession = {
  type: 'visitor'
  visitor: import('@statmuse/core/visitor').Visitor
}

type UserSession = {
  type: 'user'
  user: import('@statmuse/core/user').User
  visitor: import('@statmuse/core/visitor').Visitor
}

type Session = VisitorSession | UserSession

declare namespace App {
  interface Locals {
    session: Session
  }
}
