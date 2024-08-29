<script lang="ts">
  import Icon from '@components/icon.svelte'
  import type { Coordinates } from '@statmuse/core/gamera/index'

  const mapXCoordinate = (x: number) => {
    let xPoint = (x / 250) * 29.5

    if (xPoint < 2) xPoint = 2
    if (xPoint > 27.5) xPoint = 27.5

    return xPoint
  }

  const mapYCoordinate = (y: number) => {
    let yPoint = (y / 250) * 29.5

    if (yPoint < 2) yPoint = 2
    if (yPoint > 27.5) yPoint = 27.5

    return yPoint
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
