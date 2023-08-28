export default interface UserStats {
    wins: 0,
    losses: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    headshots: 0,
    "headshots %": 0,
    "K/D Ratio": 0,
    "K/R Ratio": 0,
    mvps: 0,
    tripleKills: 0,
    quadroKills: 0,
    pentaKills: 0,
    rating: 0,
    [key: string]: number;
}