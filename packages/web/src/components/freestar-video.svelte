<script lang="ts">
  import { session } from "@lib/session-store";
  export let domain: string

  console.log($$props)
</script>

{#if $session?.type === 'visitor' || ($session?.type === 'user' && $session?.properties.subscriptionStatus !== 'active' )}
  {#if import.meta.env.DEV}
    <div class={`${$$props.class} bg-gray-100 text-gray-600 h-52 rounded-md flex items-center justify-center`}>
      Video Ad
    </div>
  {:else}
    <div data-track-view-video class={`${$$props.class} border border-black rounded-md overflow-hidden z-0`}>
      {#if domain === 'nba'}
        <div class="s2nPlayer k-GvH7HE8X-iw36bHUX" data-type="float" />
        <script
          type="text/javascript"
          src="https://embed.sendtonews.com/player3/embedcode.js?fk=GvH7HE8X-iw36bHUX&cid=15048"
          data-type="s2nScript"
        />
      {:else if domain === 'nfl'}
        <div class="s2nPlayer k-LT4Y9uw1" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=LT4Y9uw1&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
        />
      {:else if domain === 'nhl'}
        <div class="s2nPlayer k-GvH7HE8X-Qe4apDTX" data-type="float" />
        <script
          type="text/javascript"
          src="https://embed.sendtonews.com/player3/embedcode.js?fk=GvH7HE8X-Qe4apDTX&cid=15048"
          data-type="s2nScript"
        />
      {:else if domain === 'mlb'}
        <div class="s2nPlayer k-hYWeRTR4" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=hYWeRTR4&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
        />
      {:else if domain === 'pga'}
        <div class="s2nPlayer k-G4ZAb39z" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=G4ZAb39z&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
        />
      {:else if domain === 'fantasy'}
        <div class="s2nPlayer k-ipKWbzce" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=ipKWbzce&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
        />
      {:else if domain === 'money'}
        <div class="s2nPlayer k-sDqs3wE9" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=sDqs3wE9&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
        />
      {:else}
        <div class="s2nPlayer k-ZRRhGcJz" data-type="float" />
        <script
          type="text/javascript"
          src="//embed.sendtonews.com/player3/embedcode.js?fk=ZRRhGcJz&cid=15048&offsetx=0&offsety=0&floatwidth=400&floatposition=bottom-right"
          data-type="s2nScript"
        />
      {/if}
    </div>
  {/if}
{/if}