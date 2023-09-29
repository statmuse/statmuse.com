import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeek)

export const getDecadeString = (dateString: string) => {
  const year = dayjs(dateString).year()
  const decade = year - (year % 10)
  return `${decade}s`
}

export const getQuarterString = (dateString: string) => {
  const date = dayjs(dateString)
  const year = date.year()
  const month = date.month()
  const quarter = Math.floor((month + 3) / 3)
  return `Q${quarter} ${year}`
}

export class Frequency {
  readonly _name: string
  readonly _getDateKey: (date: string) => string | number
  readonly _getDateDisplay: (date: string) => string | number

  constructor(
    name: string,
    keyFn: (key: string) => string | number,
    displayFn?: (value: string) => string | number,
  ) {
    this._name = name
    this._getDateKey = keyFn
    this._getDateDisplay = displayFn || keyFn
  }

  get name() {
    return this._name
  }

  getDateKey(date: string) {
    return this._getDateKey(date)
  }

  getDateDisplay(date: string) {
    return this._getDateDisplay(date)
  }
}

export const frequencies = [
  new Frequency('Decade', (date) => getDecadeString(date)),
  new Frequency('Year', (date) => dayjs(date).format('YYYY')),
  new Frequency('Quarter', (date) => getQuarterString(date)),
  new Frequency(
    'Month',
    (date) => dayjs(date).format('YYYYMM'),
    (date) => dayjs(date).format('MMMM YYYY'),
  ),
  new Frequency(
    'Week',
    (date) => dayjs(date).isoWeek(),
    (date) => {
      const d = dayjs(date)
      return d.add(1 - d.isoWeekday(), 'day').format('[Week of] MMMM DD YYYY')
    },
  ),
  new Frequency(
    'Day',
    (date) => dayjs(date).unix(),
    (date) => dayjs(date).format('MMMM DD YYYY'),
  ),
  new Frequency(
    'Hour',
    (date) => dayjs(date).unix(),
    (date) => dayjs(date).format('MMMM DD YYYY HH:mm'),
  ),
]

export const frequencyMap = frequencies.reduce(
  (accum, current) => {
    accum[current.name.toLowerCase()] = current
    return accum
  },
  {} as Record<string, Frequency>,
)

export type FrequencyKey =
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'decade'

export const getFrequencyForTimeframe = (
  startTimestamp: string,
  endTimestamp: string,
): FrequencyKey => {
  if (!startTimestamp) return 'month'

  const endDate = endTimestamp ? dayjs(endTimestamp) : dayjs()
  const diff = endDate.unix() - dayjs(startTimestamp).unix()

  if (diff > 60 * 60 * 24 * 366 * 4) {
    return 'month'
  } else if (diff > 60 * 60 * 24 * 366 * 2) {
    return 'week'
  } else if (diff > 60 * 60 * 24 * 14) {
    return 'day'
  } else {
    return 'hour'
  }
}
