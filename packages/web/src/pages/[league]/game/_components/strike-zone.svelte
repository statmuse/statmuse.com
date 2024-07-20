<script lang="ts">
  import Icon from '@components/icon.svelte'

  const mapXCoordinate = (x: number) => {
    let xPoint
    // clamp the value between -150, 150
    if (x < -150) xPoint = -150
    if (x > 150) xPoint = 150
    if (!xPoint) xPoint = x

    return ((xPoint + 150) / 300) * 29.5
  }

  const mapYCoordinate = (y: number) => {
    let yPoint
    // clamp the value between -120, 120
    if (y < -120) yPoint = -120
    if (y > 120) yPoint = 120
    if (!yPoint) yPoint = y

    return ((-1 * y + 120) / 240) * 29.5
  }

  const points = [
    [60, 0],
    [10, 40],
    [120, 20],
  ]
</script>

<Icon name="baseball-strike-zone" {...$$restProps}>
  {#each points as point}
    <circle r="2" cx={mapXCoordinate(point[0])} cy={mapYCoordinate(point[1])} />
  {/each}
</Icon>
