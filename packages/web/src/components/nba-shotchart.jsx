import { range } from 'd3-array'
import { values } from 'd3-collection'
import { mean, map } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import { take, reduce, mean as meanCount } from 'lodash'
import { get } from 'lodash/fp'
import cx from 'classnames'
import { select } from 'd3-selection'
import { scaleLinear, scaleQuantize } from 'd3-scale'

export const hexbinPlugin = () => {
  let width = 1
  let height = 1
  let r
  let x = d3_hexbinX
  let y = d3_hexbinY
  let dx
  let dy

  function hexbin(points) {
    const binsById = {}

    points.forEach(function (point, i) {
      const py = y.call(hexbin, point, i) / dy
      let pj = Math.round(py)
      const px = x.call(hexbin, point, i) / dx - (pj & 1 ? 0.5 : 0)
      let pi = Math.round(px)
      const py1 = py - pj

      if (Math.abs(py1) * 3 > 1) {
        const px1 = px - pi
        const pi2 = pi + (px < pi ? -1 : 1) / 2
        const pj2 = pj + (py < pj ? -1 : 1)
        const px2 = px - pi2
        const py2 = py - pj2
        if (px1 * px1 + py1 * py1 > px2 * px2 + py2 * py2)
          (pi = pi2 + (pj & 1 ? 1 : -1) / 2), (pj = pj2)
      }

      const id = `${pi}-${pj}`
      let bin = binsById[id]
      if (bin) bin.push(point)
      else {
        bin = binsById[id] = [point]
        bin.i = pi
        bin.j = pj
        bin.x = (pi + (pj & 1 ? 1 / 2 : 0)) * dx
        bin.y = pj * dy
      }
    })

    return values(binsById)
  }

  function hexagon(radius) {
    let x0 = 0
    let y0 = 0
    return d3_hexbinAngles.map(function (angle) {
      const x1 = Math.sin(angle) * radius
      const y1 = -Math.cos(angle) * radius
      const dx = x1 - x0
      const dy = y1 - y0
      ;(x0 = x1), (y0 = y1)
      return [dx, dy]
    })
  }

  hexbin.x = function (_) {
    if (!arguments.length) return x
    x = _
    return hexbin
  }

  hexbin.y = function (_) {
    if (!arguments.length) return y
    y = _
    return hexbin
  }

  hexbin.hexagon = function (radius) {
    if (arguments.length < 1) radius = r
    return `m${hexagon(radius).join('l')}z`
  }

  hexbin.centers = function () {
    const centers = []
    for (
      let y = 0, odd = false, j = 0;
      y < height + r;
      y += dy, odd = !odd, ++j
    ) {
      for (let x = odd ? dx / 2 : 0, i = 0; x < width + dx / 2; x += dx, ++i) {
        const center = [x, y]
        center.i = i
        center.j = j
        centers.push(center)
      }
    }
    return centers
  }

  hexbin.mesh = function () {
    const fragment = hexagon(r).slice(0, 4).join('l')
    return hexbin
      .centers()
      .map(function (p) {
        return `M${p}m${fragment}`
      })
      .join('')
  }

  hexbin.size = function (_) {
    if (!arguments.length) return [width, height]
    ;(width = +_[0]), (height = +_[1])
    return hexbin
  }

  hexbin.radius = function (_) {
    if (!arguments.length) return r
    r = +_
    dx = r * 2 * Math.sin(Math.PI / 3)
    dy = r * 1.5
    return hexbin
  }

  return hexbin.radius(1)
}

var d3_hexbinAngles = range(0, 2 * Math.PI, Math.PI / 3)
var d3_hexbinX = function (d) {
  return d[0]
}
var d3_hexbinY = function (d) {
  return d[1]
}

export const standardDeviation = (data) => {
  const avg = mean(data)
  const diff = map(data, (d) => d - avg)
  const sqDiff = map(diff, (d) => d * d)
  const meanSqDiff = mean(sqDiff)
  return Math.sqrt(meanSqDiff)
}

export const calcDistance = (event, dom) => {
  const { clientX, clientY } = event
  const { top: domY, left: domX } = dom.getBoundingClientRect()
  return Math.sqrt(Math.pow(clientX - domX, 2) + Math.pow(clientY - domY, 2))
}

export default class Shotchart extends Component {
  static propTypes = {
    onlyThrees: PropTypes.bool,
    colorsString: PropTypes.string,
    plainTips: PropTypes.bool,
  }

  static defaultProps = {
    onlyThrees: false,
    colorsString: '',
    plainTips: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      index: props.series || 0,
    }

    this.state.all = this.crunchAll(props.widthAvailable, props.model)
  }

  /*
   *  COMPONENT LIFE CYCLE
   */

  componentDidMount() {
    const { widthAvailable, model } = this.props
    this.root = select(findDOMNode(this.refs.root))
    this.container = select(findDOMNode(this.refs.container))
    this.reset(widthAvailable, model)
  }

  componentWillReceiveProps(nextProps) {
    this.reset(nextProps.widthAvailable, nextProps.model)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.widthAvailable !== this.props.widthAvailable ||
      nextProps.model !== this.props.model ||
      nextState.all !== this.state.all ||
      nextState.index !== this.state.index
    )
  }

  /*
   *  HELPERS
   */

  filteredModel(model) {
    const { onlyThrees } = this.props
    const threeZones = [14, 13, 12, 11, 10]
    // only need to filter when onlyThrees is set
    if (!onlyThrees) return model
    // return a new object with same data, except for non-three zones and shots filtered-out
    const series = model.series.map((series) => {
      const zones = series.zones.filter((zone) => threeZones.includes(zone.Z))
      const shots = series.shots.filter((shot) => threeZones.includes(shot.Z))
      return { ...series, zones, shots }
    })
    return { ...model, series }
  }

  getZoneColor(zone) {
    return this.getColor(
      this.state.all[this.props.minimal ? 0 : this.state.index].zones.filter(
        (z) => z.Z === zone.Z,
      )[0].FGPCT_Delta,
    )
  }

  getZoneInfoStyle(zone, width, height) {
    const zoneId = zone.Z
    const base = { position: 'absolute', borderColor: this.getZoneColor(zone) }
    const itemWidth = 64 // TODO: Make this dynamic
    const middle = width * 0.5 - itemWidth

    const baseline = height * 0.9

    switch (zoneId) {
      case 1:
        return { ...base, top: baseline, left: middle }
      case 2:
        return { ...base, top: baseline, left: width * 0.7 - itemWidth }
      case 3:
        return { ...base, top: height * 0.65, left: middle }
      case 4:
        return { ...base, top: baseline, left: width * 0.3 - itemWidth }
      case 5:
        return { ...base, top: baseline, left: width * 0.85 - itemWidth }
      case 6:
        return { ...base, top: height * 0.6, left: width * 0.75 - itemWidth }
      case 7:
        return { ...base, top: height * 0.4, left: middle }
      case 8:
        return { ...base, top: height * 0.6, left: width * 0.25 - itemWidth }
      case 9:
        return { ...base, top: baseline, left: width * 0.15 - itemWidth }
      case 10:
        return { ...base, top: baseline, left: width * 0.925 - itemWidth }
      case 11:
        return { ...base, top: height * 0.3, left: width * 0.75 - itemWidth }
      case 12:
        return { ...base, top: height * 0.2, left: middle }
      case 13:
        return { ...base, top: height * 0.3, left: width * 0.25 - itemWidth }
      case 14:
        return { ...base, top: baseline, left: width * 0.075 - itemWidth }
      case 15:
      default:
        return { ...base, display: 'none' }
    }
  }

  getSize(widthOverride) {
    const { widthAvailable, minimal } = this.props

    const width = widthOverride || (widthAvailable > 0 ? widthAvailable : 600)
    const height = width * 0.67931937172

    return {
      width,
      height,
    }
  }

  colors() {
    const { colorsString } = this.props
    const clrs = colorsString.split('|')
    return [
      clrs[0] || '#7FDBFF',
      clrs[1] || '#66A2E8',
      clrs[2] || '#0064D9',
      clrs[3] || '#00326D',
      clrs[4] || '#001F3F',
    ]
  }

  getColor(x) {
    const clrs = this.colors()
    if (x >= 10) return clrs[4]
    if (x >= 5) return clrs[3]
    if (x <= -10) return clrs[0]
    if (x <= -5) return clrs[1]
    return clrs[2]
  }

  crunchAll(width, model) {
    const { minimal } = this.props
    const filteredModel = this.filteredModel(model)
    const { cumulative, series } = filteredModel
    const { index } = this.state

    const i = parseInt(index)
    if (minimal) {
      if (cumulative) {
        const items = take(series, i + 1)
        const target = series[i]
        const upToIndex = reduce(items, (result, n) => {
          return { shots: result.shots.concat(n.shots) }
        })
        return [this.crunch({ ...target, shots: upToIndex.shots }, width)]
      }

      return [this.crunch(series[i], width)]
    }

    if (cumulative) {
      let shots = []
      return series.map((s) => {
        shots = shots.concat(s.shots)
        return this.crunch({ ...s, shots }, width)
      })
    }

    return series.map((s) => {
      return this.crunch(s, width)
    })
  }

  crunch(series, widthOverride) {
    const { widthAvailable, minimal } = this.props
    const { width, height } = this.getSize(widthOverride)
    const { name, shots, zones, colors } = series

    const x = scaleLinear().domain([-250, 250]).range([width, 0])

    const y = scaleLinear().domain([-50, 300]).range([height, 0])

    const hexbin = hexbinPlugin()
      .size([width, height])
      .radius(13)
      .x((d) => x(d.X))
      .y((d) => y(d.Y))

    const bins = hexbin(shots)
    const counts = bins.map((b) => b.length)
    const max = Math.max.apply(Math, counts)
    const min = Math.min.apply(Math, counts)
    const half = max / 2

    let stdDeviation = standardDeviation(counts)
    stdDeviation = stdDeviation === 0 ? 1 : stdDeviation
    const mean = meanCount(counts)
    const { length } = shots

    const radius = scaleQuantize()
      .domain([
        mean / 8,
        mean + stdDeviation / Math.min(4, stdDeviation / mean),
      ])
      .range([2, 6, 10, 14])

    return {
      name,
      hexbin,
      bins,
      radius,
      shots: shots.map((s) => {
        return {
          ...s,
          x: x(s.X),
          y: y(s.Y),
        }
      }),
      zones,
      colors,
      length,
    }
  }

  /*
   *  TASKS
   */

  reset(width, model) {
    this.setState({
      all: this.crunchAll(width, model),
    })
  }

  highlight(hex) {
    this.root.selectAll('[data-shotchart-zone-info]').classed('hidden', true)
    // this.container.selectAll('.hexagon').classed(style.highlighted, false);
    this.container.selectAll('.hexagon').classed('opacity-25', !!hex)

    if (!hex) return

    const className = `.${hex.className.baseVal.match(/shot-zone-\d+/)[0]}`
    const zoneId = parseInt(className.split('-')[2])

    this.container.selectAll(className).classed('opacity-25', false)
    // this.container.selectAll(className).classed(style.highlighted, true);
    const zoneInfo = select(findDOMNode(this.refs[`zoneInfo.${zoneId}`]))
    if (zoneInfo) zoneInfo.classed('hidden', false)
  }

  nearestHexagon(event) {
    const hexagonNodes = this.refs.container.querySelectorAll('.hexagon')

    return reduce(
      hexagonNodes,
      (result, node) => {
        const distance = calcDistance(event, node)
        return distance < result.distance ? { node, distance } : result
      },
      { node: null, distance: Infinity },
    )
  }

  /*
   *  UI EVENTS
   */

  onMouseMove(event) {
    const hexNode = this.nearestHexagon(event).node
    this.highlight(hexNode)
  }

  onMouseOut(event) {
    this.highlight(null)
  }

  onSeriesChange(e) {
    if (this.state.index != e.target.value) {
      this.setState({
        index: e.target.value,
      })
    }
  }

  /*
   *  RENDERING
   */

  renderCourt() {
    return (
      <svg
        ref="court"
        x="0px"
        y="0px"
        width="100%"
        viewBox="15.25 923 764 519"
        enableBackground="new 15.25 923 764 519"
      >
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M278.75 1432.5v-283.75h237.5v283.75"
        />
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M386.25 1353.75c0-6.213 5.036-11.25 11.25-11.25 6.213 0 11.25 5.037 11.25 11.25S403.713 1365 397.5 1365C391.286 1365 386.25 1359.963 386.25 1353.75z"
        />
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M338.75 1353.75c0-32.447 26.303-58.75 58.75-58.75s58.75 26.303 58.75 58.75"
        />
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M67.52 1432.5l0.032-210c52.192-131.094 180.248-223.75 329.949-223.75 149.7 0 277.848 92.656 330.039 223.75l-0.039 210"
        />
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M352.5 1371.25h90"
        />
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M308.77 1147.5c0-49.016 39.715-88.75 88.73-88.75s88.75 39.734 88.75 88.75"
        />
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M773.75 1432.75H21.25"
        />
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M486.152 1148.273c0 3.035-0.152 6.033-0.449 8.99"
        />
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          strokeDasharray="17.3876,17.3876"
          d="M482.28 1174.289c-11.114 36.322-44.896 62.734-84.858 62.734 -43.003 0-78.864-30.586-87.013-71.189"
        />
        <path
          fill="none"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M309.122 1157.264c-0.297-2.957-0.45-5.955-0.45-8.99"
        />
        <path
          fill="#FFFFFF"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M279.25 1325.844H268"
        />
        <path
          fill="#FFFFFF"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M279.25 1308.344H268"
        />
        <path
          fill="#FFFFFF"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M279.25 1260.844H268"
        />
        <path
          fill="#FFFFFF"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M279.25 1213.344H268"
        />
        <path
          fill="#FFFFFF"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M516.75 1325.844H528"
        />
        <path
          fill="#FFFFFF"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M516.75 1308.344H528"
        />
        <path
          fill="#FFFFFF"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M516.75 1260.844H528"
        />
        <path
          fill="#FFFFFF"
          stroke="#000000"
          strokeMiterlimit="10"
          d="M516.75 1213.344H528"
        />
      </svg>
    )
  }

  renderLegend() {
    const clrs = this.colors()
    return (
      <svg
        x="0px"
        y="0px"
        width="120px"
        height="37px"
        viewBox="0 0 112.667 34.75"
        style={{ marginTop: -15, display: 'inline' }}
      >
        <polygon
          fill={clrs[0]}
          points="21.589,14.83 29.485,19.398 29.479,28.521 21.573,33.078 13.675,28.51 13.683,19.385"
        />
        <polygon
          fill={clrs[1]}
          points="38.421,14.83 46.318,19.398 46.312,28.521 38.405,33.078 30.508,28.51 30.515,19.385"
        />
        <polygon
          fill={clrs[2]}
          points="55.259,14.83 63.156,19.398 63.149,28.521 55.244,33.078 47.347,28.51 47.354,19.385"
        />
        <polygon
          fill={clrs[3]}
          points="72.088,14.83 79.985,19.398 79.978,28.521 72.072,33.078 64.175,28.51 64.182,19.385"
        />
        <polygon
          fill={clrs[4]}
          points="88.921,14.83 96.818,19.398 96.812,28.521 88.905,33.078 81.008,28.51 81.016,19.385"
        />
        <text
          transform="matrix(1 0 0 1 100.8037 27.9912)"
          fontFamily="'Myriad-Roman'"
          fontSize="14"
        >
          +
        </text>
        <text
          transform="matrix(1 0 0 1 2.3838 29.8711)"
          fontFamily="'Myriad-Roman'"
          fontSize="22"
          letterSpacing="-1"
        >
          -
        </text>
      </svg>
    )
  }

  render() {
    const colors = this.colors()
    const { minimal, settings, onlyThrees, plainTips, model } = this.props
    const { width, height } = this.getSize()
    const {
      hexbin,
      bins,
      radius,
      shots,
      zones,
      stdDeviation,
      mean,
      median,
      length,
      min,
      max,
    } = this.state.all[minimal ? 0 : this.state.index]
    const filteredModel = this.filteredModel(model)

    const showLegend = true // !minimal;

    return (
      <div className="bg-white">
        {this.state.all.length > 1 && !minimal ? (
          <div style={{ marginTop: 10 }}>
            <span
              style={{
                fontWeight: 300,
                fontSize: '200%',
                textAlign: 'center',
                display: 'block',
              }}
            >
              {(filteredModel.cumulative && this.state.index > 0
                ? `${this.state.all[0].name}  to  `
                : '') + this.state.all[minimal ? 0 : this.state.index].name}
            </span>
            <input
              style={{
                margin: '0 auto',
                width: '75%',
                display: 'block',
                zIndex: 1,
              }}
              type="range"
              min={0}
              max={this.state.all.length - 1}
              value={this.state.index}
              step="1"
              onInput={this.onSeriesChange.bind(this)}
              onChange={this.onSeriesChange.bind(this)}
            />
          </div>
        ) : (
          ''
        )}
        <div
          ref="root"
          style={{
            position: 'relative',
            paddingTop: 15,
            backgroundColor: 'white',
          }}
        >
          {this.renderCourt()}
          {length < 100 ? (
            <div style={{ height: 50 }} className="text-center mx-auto mb-2.5">
              <svg width="160px" viewBox="0 0 160 50">
                <g transform="translate(10, 25)">
                  <circle
                    opacity={1}
                    fill={colors[3]}
                    stroke={colors[3]}
                    strokeWidth="2"
                    r="5"
                  />
                  <text x="9" y="4">
                    makes
                  </text>
                </g>
                <g transform="translate(95, 25)">
                  <circle
                    opacity={0.6}
                    fill="white"
                    stroke={colors[1]}
                    strokeWidth="2"
                    r="5"
                  />
                  <text x="9" y="4">
                    misses
                  </text>
                </g>
              </svg>
            </div>
          ) : (
            <div className="text-center mx-auto mb-2.5">
              <span style={{ display: 'block' }}>fg% vs. league avg</span>
              {this.renderLegend()}
            </div>
          )}
          <div
            ref="container"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
            onMouseMove={this.onMouseMove.bind(this)}
            onMouseOut={this.onMouseOut.bind(this)}
          >
            <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
              <g transform="translate(0,0)">
                <g>
                  {length < 100
                    ? shots.map((d, index) => (
                        <circle
                          key={index}
                          opacity={d.M ? 1 : 0.6}
                          transform={`translate(${d.x},${d.y})`}
                          fill={d.M ? colors[3] : 'white'}
                          stroke={d.M ? colors[3] : colors[1]}
                          strokeWidth="2"
                          r="5"
                        />
                      ))
                    : bins.map((d, index) => (
                        <path
                          key={index}
                          className={`hexagon shot-zone-${d[0].Z}`}
                          fill={this.getZoneColor(d[0])}
                          d={hexbin.hexagon(radius(d.length))}
                          transform={`translate(${d.x},${d.y})`}
                        />
                      ))}
                </g>
              </g>
            </svg>
          </div>
          {zones && zones.map
            ? zones.map((zone) => (
                <div
                  key={`zoneInfo.${zone.Z}`}
                  ref={`zoneInfo.${zone.Z}`}
                  data-shotchart-zone-info
                  className={cx(
                    'bg-white shadow-lg h-auto p-2.5 pointer-events-none border-l-4 border-[#0064d9] hidden',
                    {
                      'border-none': plainTips,
                    },
                  )}
                  style={this.getZoneInfoStyle(zone, width, height)}
                >
                  <span
                    style={{
                      display: 'block',
                      color: plainTips ? '#1a1a1a' : '#0064d9',
                      fontSize: 24,
                      fontWeight: 200,
                    }}
                  >
                    {`${
                      get(['FGPCT', 'toFixed'], zone)
                        ? zone.FGPCT.toFixed(1)
                        : '0'
                    }%`}
                  </span>
                  <span className="block">
                    {`(league: ${
                      get(['lFGPCT', 'toFixed'], zone)
                        ? zone.lFGPCT.toFixed(1)
                        : '0'
                    }%` + `)`}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontStyle: plainTips ? 'normal' : 'italic',
                    }}
                  >
                    {`${zone.FGM} of ${zone.FGA}`}
                  </span>
                </div>
              ))
            : ''}
        </div>
      </div>
    )
  }
}
