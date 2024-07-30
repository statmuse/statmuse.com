<script lang="ts">
  import Icon from '@components/icon.svelte'
  import type { Coordinates } from '@statmuse/core/gamera'

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

  export let coordinate: Coordinates
</script>

<Icon name="baseball-field" {...$$restProps}>
  <circle
    r="2"
    cx={mapXCoordinate(coordinate.x)}
    cy={mapYCoordinate(coordinate.y)}
  />
</Icon>
