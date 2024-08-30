import type { GameraTeamReference } from './base'

export interface StandingsBase {
  team: GameraTeamReference
}

export interface StandingsMlb extends StandingsBase {
  rank: {
    league: number
    division: number
  }
  league: {
    name: string
  }
  division: {
    name: string
  }
  clinchedAbbrev: string
  stats: {
    gamesBehind: {
      mlb: {
        value: number
        display: string
      }
      league: {
        value: number
        display: string
      }
      division: {
        value: number
        display: string
      }
    }
    wins: {
      value: number
      display: string
    }
    losses: {
      value: number
      display: string
    }
    winPercent: {
      value: number
      display: string
    }
  }
}

export interface StandingsNba extends StandingsBase {
  rank: {
    conference: number
    division: number
  }
  conference: {
    name: string
  }
  division: {
    name: string
  }
  stats: {
    gamesBehind: {
      league: {
        value: number
        display: string
      }
      conference: {
        value: number
        display: string
      }
      division: {
        value: number
        display: string
      }
    }
    wins: {
      value: number
      display: string
    }
    losses: {
      value: number
      display: string
    }
    winPercent: {
      value: number
      display: string
    }
  }
}

export interface StandingsNhl extends StandingsBase {
  rank: {
    conference: number
    division: number
    league: number
  }
  conference: {
    name: string
  }
  division: {
    name: string
  }
  stats: {
    points: {
      value: number
      display: string
    }
    wins: {
      value: number
      display: string
    }
    ties: {
      value: number
      display: string
    }
    losses: {
      value: number
      display: string
    }
    overtimeLosses: {
      value: number
      display: string
    }
    goalDifferential: {
      value: number
      display: string
    }
  }
}

export interface StandingsNfl extends StandingsBase {
  rank: {
    conference: number
    division: number
    league: number
  }
  conference: {
    name: string
  }
  division: {
    name: string
  }
  stats: {
    wins: {
      value: number
      display: string
    }
    losses: {
      value: number
      display: string
    }
    ties: {
      value: number
      display: string
    }
    winPercent: {
      value: number
      display: string
    }
  }
}

export interface StandingsEpl extends StandingsBase {
  league: 'epl' | 'lal'
  rank: {
    league: number
  }
  stats: {
    points: {
      value: number
      display: string
    }
    wins: {
      value: number
      display: string
    }
    losses: {
      value: number
      display: string
    }
    draws: {
      value: number
      display: string
    }
    goalDifferential: {
      value: number
      display: string
    }
  }
}

export type StandingsTeam =
  | StandingsMlb
  | StandingsNba
  | StandingsNfl
  | StandingsNhl
  | StandingsEpl

export interface StandingsResponse {
  seasonYearDisplay: string
  teams: StandingsTeam[]
}
