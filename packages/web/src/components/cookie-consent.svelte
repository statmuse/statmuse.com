<script lang="ts">
  import { session } from '@lib/stores'

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
    class="bg-gray-7 dark:bg-gray-2 border-t border-gray-6 dark:border-gray-2 flex justify-between items-center px-4 sm:px-8 py-3 fixed bottom-[50px] sm:bottom-0 left-0 w-full z-[5]"
  >
    <!--googleoff: all-->
    <span id="cookieconsent:desc">
      StatMuse uses cookies for the best experience.
      <a
        aria-label="learn more about cookies"
        role="button"
        tabindex="0"
        class="underline"
        href="/privacy"
        rel="noopener noreferrer nofollow"
        target="_blank"
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
        class="bg-teal text-gray-8 block py-1 px-4 cursor-pointer rounded-2xl"
      >
        Allow
      </a>
    </div>
    <!--googleon: all-->
  </div>
{/if}
