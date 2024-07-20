<script lang="ts">
  import Icon from '@components/icon.svelte'

  const mapXCoordinate = (x: number) => {
    let xPoint
    // clamp the value between 45, 205
    if (x < 45) xPoint = 45
    if (x > 205) xPoint = 205
    if (!xPoint) xPoint = x

    return ((xPoint - 45) / 160) * 29.5
  }

  const mapYCoordinate = (y: number) => {
    let yPoint
    // clamp the value between 65, 220
    if (y < 65) yPoint = 65
    if (y > 220) yPoint = 220
    if (!yPoint) yPoint = y

    return ((y - 65) / 155) * 29.5
  }

  const points = [[100, 90]]
</script>

<Icon name="baseball-field" {...$$restProps}>
  {#each points as point}
    <circle r="2" cx={mapXCoordinate(point[0])} cy={mapYCoordinate(point[1])} />
  {/each}
</Icon>
