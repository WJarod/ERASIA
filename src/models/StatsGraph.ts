  export default interface Mapplayed {
    map: string
    played: number
    win: number
    lose: number
  }
  
  export default interface StatsGraph {
    MVPs: string
    Headshots: string
    Kills: string
    "Headshots %": string
    Result: string
    "Penta Kills": string
    "K/R Ratio": string
    "K/D Ratio": string
    Assists: string
    Deaths: string
    "Quadro Kills": string
    "Triple Kills": string
    RoundsPlayed: string
    KillRating: number
    SurvivalRating: number
    MultikillRating: number
    CombinedRating: number
    Rating: number
    Map: string
  }