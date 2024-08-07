import { createAskPath } from '@statmuse/core/path'

const nbaExamples = [
  [
    'Scores',
    [
      'Did the Warriors win?',
      'Who won the Finals last year?',
      'What was the score of the last Pacers game?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nba', query: q }),
    })),
  ],
  [
    'Schedules',
    [
      'Who do the Cavs play this week?',
      'What channel is the Raptors game on?',
      'When do the Spurs play next?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nba', query: q }),
    })),
  ],
  [
    'Standings',
    [
      'Are the Sixers in the playoffs?',
      'Western Conference standings this season?',
      'Who leads the East?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nba', query: q }),
    })),
  ],
  [
    'Stats',
    [
      'Lowest defensive rating by a team this season?',
      'Who had the most points in a game last season?',
      'Which team has the most threes in a playoff game?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nba', query: q }),
    })),
  ],
  [
    'Bios',
    [
      'How tall is Giannis?',
      'Where did Kyrie Irving go to college?',
      'Tell me about Larry Bird',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nba', query: q }),
    })),
  ],
  [
    'Recaps',
    [
      'How did Jokic do?',
      'Is Ja Morant having a good season this year?',
      'How did MJ do in his rookie season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nba', query: q }),
    })),
  ],
  [
    'Odds',
    ['NBA odds', 'Who are the favorites tonight?', 'Lakers over/under'].map(
      (q) => ({
        query: q,
        path: createAskPath({ domain: 'nba', query: q }),
      }),
    ),
  ],
  [
    'Beyond the Box Score',
    [
      "What is Steph Curry's career true shooting percentage?",
      'Who had the most DraftKings points in the last playoffs?',
      'Kevin Durant shot chart in 2013-14?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nba', query: q }),
    })),
  ],
]

const nflExamples = [
  [
    'Scores',
    [
      'Did the Eagles win?',
      'Who won the first Super Bowl?',
      'What was the score of the last Saints game?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nfl', query: q }),
    })),
  ],
  [
    'Schedules',
    [
      'Who do the Chiefs play this week?',
      'What channel is the Super Bowl on?',
      'When do the Rams play next?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nfl', query: q }),
    })),
  ],
  [
    'Standings',
    [
      "What is the Carolina Panthers' record?",
      'Which team had the best record in the NFC East last season?',
      'Did the Ravens make the playoffs?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nfl', query: q }),
    })),
  ],
  [
    'Stats',
    [
      'Who has the most touchdowns?',
      'Which team has the most two-point conversions this season?',
      'Which QB has the most passing yards in a playoff game?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nfl', query: q }),
    })),
  ],
  [
    'Bios',
    [
      'Tell me about the 49ers',
      'Where did Peyton Manning go to college?',
      'Dan Marino career stats?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nfl', query: q }),
    })),
  ],
  [
    'Recaps',
    [
      'How did Justin Jefferson do?',
      'Did Justin Herbert have a good season last year?',
      'How did Randy Moss do in his rookie season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nfl', query: q }),
    })),
  ],
  [
    'Odds',
    ['NFL odds', 'Who are the favorites this week?', 'Chiefs spread'].map(
      (q) => ({
        query: q,
        path: createAskPath({ domain: 'nfl', query: q }),
      }),
    ),
  ],
  [
    'Beyond the Box Score',
    [
      'Which team has the most career ties in the NFL?',
      'Who had the most DraftKings points in the last playoffs?',
      'Which team had the most third down conversions last season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nfl', query: q }),
    })),
  ],
]

const mlbExamples = [
  [
    'Scores',
    [
      'Did the Giants win?',
      'Which team has won the most World Series?',
      'Who won the World Series last year?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'mlb', query: q }),
    })),
  ],
  [
    'Schedules',
    [
      'When is the next Athletics home game?',
      'What channel is the Mariners game on?',
      'When do the Dodgers play the Giants next?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'mlb', query: q }),
    })),
  ],
  [
    'Standings',
    [
      "What is the Cubs' record?",
      "What was the White Sox' record last season?",
      'Who had the best record in the American League last season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'mlb', query: q }),
    })),
  ],
  [
    'Stats',
    [
      'Which pitcher has the most strikeouts this season?',
      'Which team had the most home runs in a season?',
      'Who has the most RBI in a World Series?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'mlb', query: q }),
    })),
  ],
  [
    'Bios',
    [
      'How tall was Randy Johnson?',
      'How much does Bartolo Colon weigh?',
      "What are Babe Ruth's career stats?",
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'mlb', query: q }),
    })),
  ],
  [
    'Recaps',
    [
      'How did Shohei do?',
      'How did the Blue Jays do last season?',
      'How did Jose Altuve do in his rookie season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'mlb', query: q }),
    })),
  ],
  [
    'Odds',
    ['MLB odds', 'Who are the favorites tonight?', 'Red Sox moneyline'].map(
      (q) => ({
        query: q,
        path: createAskPath({ domain: 'mlb', query: q }),
      }),
    ),
  ],
  [
    'Beyond the Box Score',
    [
      'Who has the highest wRC+ in a season?',
      'Which pitcher has the highest career strikeouts per nine innings?',
      'Who has the highest weighted on base percentage in a season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'mlb', query: q }),
    })),
  ],
]

const nhlExamples = [
  [
    'Scores',
    [
      'Did the Golden Knights win?',
      'Who won the Stanley Cup last season?',
      'What happened in the Predators game?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nhl', query: q }),
    })),
  ],
  [
    'Schedules',
    [
      'What NHL games are there tonight?',
      'What channel is the Avalanche game on?',
      'When do the Sharks play next?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nhl', query: q }),
    })),
  ],
  [
    'Standings',
    [
      "What is the Carolina Hurricanes' record?",
      'What place are the Ducks in?',
      "What is the Devils' best record in a season?",
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nhl', query: q }),
    })),
  ],
  [
    'Stats',
    [
      'Who leads the NHL in points?',
      'Which team had the most power play points this season?',
      'Who had the most assists in a season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nhl', query: q }),
    })),
  ],
  [
    'Bios',
    [
      'How old is Matty Beniers?',
      'How tall is Wayne Gretzky?',
      "What are Mario Lemieux's career stats?",
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nhl', query: q }),
    })),
  ],
  [
    'Recaps',
    [
      'Tell me about Gordie Howe',
      'Did Tyler Seguin have a good season this year?',
      'How did Sidney Crosby do in his rookie season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nhl', query: q }),
    })),
  ],
  [
    'Odds',
    ['NHL odds', 'Who are the favorites tonight?', 'Maple Leafs moneyline'].map(
      (q) => ({
        query: q,
        path: createAskPath({ domain: 'nhl', query: q }),
      }),
    ),
  ],
  [
    'Beyond the Box Score',
    [
      'Which team has the highest faceoff win percentage this season?',
      'Which team has the highest penalty kill percentage in a season in the playoffs with at least 8 games played?',
      'Who had the most game winning goals in a season in the playoffs?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'nhl', query: q }),
    })),
  ],
]

const pgaExamples = [
  [
    'Scores',
    [
      'Who won the Masters last year?',
      'Who won the PGA Championship in 1980?',
      'Who won the US Open in 2000?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'pga', query: q }),
    })),
  ],
  [
    'Schedules',
    [
      'What is the PGA schedule?',
      'When is the next US Open?',
      'When is the next Masters?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'pga', query: q }),
    })),
  ],
  [
    'Standings',
    [
      'FedEx Cup rankings in 2013?',
      '2016 Masters standings',
      'Who led the FedEx rankings last year?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'pga', query: q }),
    })),
  ],
  [
    'Stats',
    [
      'Who won the most tournaments in 2000?',
      'Who had the best putting average last season?',
      "What was Tiger's FWY% in 2003?",
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'pga', query: q }),
    })),
  ],
  [
    'Bios',
    [
      'How old is Phil Mickelson?',
      'Tiger Woods career stats',
      'Tell me about Rory McIlroy',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'pga', query: q }),
    })),
  ],
  [
    'Recaps',
    [
      'How did Tiger Woods do in 2000?',
      'Did Justin Thomas have a good season last year?',
      'How did Jordan Spieth do in his first season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'pga', query: q }),
    })),
  ],
  [
    'Beyond the Box Score',
    [
      'Who had the best driving distance average in a season, minimum 80 events?',
      'Who was the last player with at least 70 gir% in a season when winning at least 5 tournaments?',
      'When was the last time Tiger had 70 GIR% and 70 FWY% in a season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'pga', query: q }),
    })),
  ],
]

const eplExamples = [
  [
    'Stats',
    [
      'Most G/A in a LaLiga season?',
      'Who scored the most PL hat tricks all time?',
      'Which player has created the most chances in the last 2 PL seasons?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'fc', query: q }),
    })),
  ],
  [
    'Advanced Stats',
    [
      'Which winger has completed the most take-ons in the last 3 LaLiga seasons?',
      'Highest xG overperformers in the Prem?',
      'Who had the most through balls in LaLiga last season?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'fc', query: q }),
    })),
  ],
  [
    'Scores',
    [
      'Did Barcelona win?',
      'What was the score of the last Manchester derby?',
      'What happened in the Arsenal match?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'fc', query: q }),
    })),
  ],
  [
    'Fixtures',
    [
      'What PL matches are on this week?',
      'When is the next El Clásico?',
      'When do Liverpool play next?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'fc', query: q }),
    })),
  ],
  [
    'Table',
    [
      'Premier League table?',
      'Who won LaLiga last season?',
      "What was Real Madrid's record last year?",
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'fc', query: q }),
    })),
  ],
  [
    'Bios',
    [
      'Zinedine Zidane stats',
      'How tall is Peter Crouch?',
      'How old is Bukayo Saka?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'fc', query: q }),
    })),
  ],
  [
    'Recaps',
    [
      'How did Neymar do in 2015/16 season?',
      'How is Phil Foden doing?',
      'Did Vini Jr have a good season last year?',
    ].map((q) => ({
      query: q,
      path: createAskPath({ domain: 'fc', query: q }),
    })),
  ],
]

export type ExampleSet = [string, { query: string; path: string }[]]

export const examples = {
  nba: nbaExamples as ExampleSet[],
  nfl: nflExamples as ExampleSet[],
  mlb: mlbExamples as ExampleSet[],
  nhl: nhlExamples as ExampleSet[],
  pga: pgaExamples as ExampleSet[],
  fc: eplExamples as ExampleSet[],
}
