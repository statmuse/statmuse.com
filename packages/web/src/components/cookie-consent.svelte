<script lang="ts">
  import { session } from '@lib/session-store'

  const consent = () => {
    fetch(`/auth/cookie-consent`, {
      method: 'POST',
      body: JSON.stringify({ cookie_status: 'allow' }),
    })
    display = false
  }

  let display = true
</script>

{#if display && $session && $session.type !== 'public' && $session.properties.cookieStatus !== 'allow'}
  <div
    role="dialog"
    aria-live="polite"
    aria-label="cookieconsent"
    aria-describedby="cookieconsent:desc"
    class="bg-[#eaf7f7] text-[#5c7291] flex justify-between items-center px-8 py-4 fixed bottom-0 left-0 w-full z-[5]"
  >
    <!--googleoff: all-->
    <span id="cookieconsent:desc" style="line-height: 1.1em; margin-bottom: 0;">
      StatMuse uses cookies for the best experience.
      <a
        aria-label="learn more about cookies"
        role="button"
        tabindex="0"
        class="underline"
        href="/privacy"
        rel="noopener noreferrer nofollow"
        target="_blank"
        style="padding: .2em 0 .2em"
      >
        Learn more
      </a>
      .
    </span>
    <div style="margin-left: 15px;">
      <a
        href="#allow"
        on:click|preventDefault={consent}
        aria-label="allow cookies"
        tabindex="0"
        class="bg-[#00c1d8] text-white block py-2 px-4 cursor-pointer"
      >
        Allow
      </a>
    </div>
    <!--googleon: all-->
  </div>
{/if}
