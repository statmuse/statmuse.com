<script lang="ts">
  const hideBanner = localStorage.getItem('hide-upgrade-banner')

  const closeBanner = () => {
    localStorage.setItem('hide-upgrade-banner', 'true')
  }

  const path = window.location.pathname
</script>

{#if !hideBanner && path !== '/auth/signin' && path !== '/auth/signup'}
  <a
    href="/signup"
    class="hover:no-underline flex items-center bg-secondary text-white px-4 py-2.5 sm:px-3.5 sm:before:flex-1"
    on:click={closeBanner}
  >
    <p class="leading-6 flex-1 sm:flex-initial">
      <span class="text-white text-center">
        <strong class="font-semibold">StatMuse+</strong>
        &nbsp;&nbsp;Get our new premium offering&nbsp;
      </span>
    </p>

    <div class="flex sm:flex-1 justify-end">
      <button
        type="button"
        class="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        on:click={closeBanner}
      >
        <span class="sr-only">Dismiss</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width={1.5}
          stroke="currentColor"
          class="h-5 w-5 text-white"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </a>
{/if}
