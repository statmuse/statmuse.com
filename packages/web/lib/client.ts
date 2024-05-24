/**
 * Given window and document, add or remove "selected" class to league nav
 * links if current window location matches nav href. Note that the argument
 * tests are more comprehensive to protect functions downstream of this.
 *
 * @param {Window} win - DOM window
 * @param {Element} ctag - Node Element with data for canonical link
 *
 */
const shouldRewriteUrl = (win: Window, ctag: HTMLLinkElement) => {
  return (
    win instanceof Window &&
    win.history instanceof History &&
    win.location instanceof Location &&
    ctag.href !== win.location.href &&
    ctag.dataset.shouldRewrite === 'true'
  )
}

/**
 * Rewrite URL.
 *
 * @param {Window} win - DOM window
 * @param {HTMLDocument} doc - DOM document
 * @param {String} newUrl - Destination URL
 *
 */
const rewriteUrl = (win: Window, doc: Document, newUrl: string) =>
  win.history.replaceState(null, doc.title, newUrl)

/**
 * Given window and document, get canonical link tag and check if URL should be
 * rewritten, in which case call rewriteUrl and updateLeagueNav.
 *
 * @param {Window} win - DOM window
 * @param {HTMLDocument} doc - DOM document
 *
 */
export const maybeRewriteUrl = (win: Window, doc: Document) => {
  const canonicalTag = doc.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null
  if (!canonicalTag) return

  if (shouldRewriteUrl(win, canonicalTag)) {
    rewriteUrl(win, doc, canonicalTag.href)
  }
}
