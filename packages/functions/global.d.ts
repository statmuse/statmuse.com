declare global {
  const fetch: typeof import('undici').fetch // Node.js 18 uses `undici` for fetch
}
export {}
