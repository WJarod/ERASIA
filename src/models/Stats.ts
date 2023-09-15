export default interface Stats {
        player_id: string,
        totalGames: number,
        averages: {
            "K/D Ratio": number,
            "K/R Ratio": number
            "Headshots %": number,
            Rating: number
        },
        "sums": {
            Kills: number,
            Deaths: number,
            Assists: number,
            Headshots: number,
            RoundsPlayed: number,
            "Triple Kills": number,
            "Quadro Kills": number,
            "Penta Kills": number
        }
}