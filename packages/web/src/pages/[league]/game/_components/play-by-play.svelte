<script lang="ts">
  import Icon from '@components/icon.svelte'
  import Image from '@components/image.svelte'
  import Panel from '@components/panel.svelte'
</script>

<div>
  <Panel class="!pb-0" title="Bottom 3rd">
    <div class="divide-y divide-gray-6 dark:divide-gray-4">
      <div class="-mx-3 px-3">
        <p class="mt-2">Jose Altuve doubles to right. Alvarez scores.</p>
        <div class="flex mt-1">
          <div class="flex-1 mt-1 space-y-1">
            <div class="flex items-center gap-1.5">
              <div class="bg-primary rounded-2xl px-2">Double</div>
              <p class="text-lg">2 outs</p>
              <Icon name="baseball-strike-zone" class="w-6" />
              <Icon name="baseball-field" class="w-6" />
              <Icon name="baseball-diamond-sm" class="w-6" fillThirdBase />
            </div>
            <div class="flex gap-2">
              <p>
                92.6 <span class="text-gray-5">mph</span>
              </p>
              <p>
                85 <span class="text-gray-5">ft</span>
              </p>
              <p>
                40 <span class="text-gray-5">deg</span>
              </p>
            </div>
          </div>
          <Image
            src="https://cdn.statmuse.com/img/mlb/players/new-york-yankees-aaron-judge2022-min--6erpzlwb.png"
            alt="aaron judege"
            width={120}
            height={90}
            class="h-[75px] max-w-[100px] object-contain object-right-bottom"
          />
        </div>
      </div>
    </div>
  </Panel>
</div>
