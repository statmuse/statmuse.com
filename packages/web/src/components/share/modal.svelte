<script lang="ts">
  import Icon from '@components/icon.svelte'
  import { isShareModalOpen } from '@lib/stores'

  type ShareType = 'profile' | 'ask' | 'musing'
  export let type: ShareType = 'profile'
  export let url: string
  export let query: string
  export let domain: string
</script>

{#if $isShareModalOpen}
  <div class="fixed w-full h-full top-0 left-0 z-[10] bg-black/40">
    <div
      class="bg-white w-[98%] max-w-[500px] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-[#333] px-3 py-6 sm:p-6 text-left"
    >
      <Icon
        name="x"
        class="w-4 h-4 absolute top-6 right-3 sm:right-6"
        alt="close"
      />
      <p class="mb-4">Share a link to this question</p>
      <div class="flex">
        <div style:text-align="center" style:font-size="14px">
          <a
            href=""
            class="flex items-center justify-center w-16 h-16 my-1 mx-2.5 rounded-full"
            style:background="#3C5A99"
            target="_blank"
            rel="noopener noreferrer"
            data-track-click="Click Musing Share Link"
          >
            <img src="" class="w-7 h-7 object-contain" alt="Facebook" />
          </a>
          Facebook
        </div>
        <div style:text-align="center" style:font-size="14px">
          <a
            href=""
            class="flex items-center justify-center w-16 h-16 my-1 mx-2.5 rounded-full"
            style:background="#3C5A99"
            target="_blank"
            rel="noopener noreferrer"
            data-track-click="Click Musing Share Link"
          >
            <img src="" class="w-7 h-7 object-contain" alt="Twitter" />
          </a>
          Twitter
        </div>
      </div>
      <div class="relative my-5 cursor-pointer">
        <input
          class="w-full h-[42px] outline-none cursor-pointer px-4 pr-[70px] text-sm bg-[#fbfbfb] border border-[#e4e4e4] overflow-auto"
          type="text"
          value=""
          readonly
          data-share-input
        />
        <span
          class="absolute top-1/2 right-4 -translate-y-1/2 text-primary font-bold text-sm"
        >
          COPY
        </span>
      </div>
      {#if type !== 'profile'}
        <div
          style="height: 1px; width: 100%; background-color: #e4e4e4; margin-bottom: 20px"
        />
        <div style="display: flex; align-items: center">
          <input
            id="share-checkbox"
            type="checkbox"
            class="appearance-none p-0 bg-white checked:bg-primary border-2 border-primary rounded-sm w-5 h-5 mr-2.5 cursor-pointer flex items-center justify-center after:content-['✓'] after:text-white"
          />
          <label
            for="share-checkbox"
            style="color: #d1d1d1; fontSize: 14px; cursor: pointer"
          >
            Keep Answer Updated
          </label>
        </div>
        <p style="margin-top: 1em; font-size: 14px; color: #d1d1d1">
          {type === 'musing'
            ? 'This answer is static and will not update'
            : 'This answer is live and will keep updating'}
        </p>
      {/if}
    </div>
  </div>
{/if}
