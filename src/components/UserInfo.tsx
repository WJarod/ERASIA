import { useEffect, useState } from "react";
import Stats from "../models/Stats";
import User from "../models/User";
import { getStats } from "../services/faceitService";
import { Grid } from "@mui/material";
import CircularProgressCustom from "../components/CircularProgressCustom";

interface UserInfoProps {
    user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    const [stats, setStats] = useState<Stats>({} as Stats);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchStats = async (id: string) => {
        // const allStats = await getStats(id);
        //fake data
        const allStats = {
            "player_id": "77ee655c-f477-4986-9aab-13f75c5c33d6",
            "totalGames": 50,
            "averages": {
                "K/D Ratio": 1.26,
                "K/R Ratio": 0.72,
                "Headshots %": 40,
                "Rating": 1.10
            },
            "sums": {
                "Kills": 909,
                "Deaths": 859,
                "Assists": 195,
                "Headshots": 362,
                "RoundsPlayed": 1290,
                "Triple Kills": 44,
                "Quadro Kills": 14,
                "Penta Kills": 0
            }
        }

        return allStats;
    }

    useEffect(() => {
        const fetchUserStats = async () => {
            const allStats = await fetchStats(user.faceit_id);
            setStats(allStats);
            setLoading(false);
        }
        fetchUserStats();
    }, []);

    return (
        <Grid container spacing={2} rowSpacing={2}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                height: "100%",
                width: "100%",
                margin: "auto",
            }}
        >
            <Grid xs={4} style={{ position: 'relative', height: '300px' }}>
                <img src="/logo2000.png" alt="logo" style={{ width: '100%', objectFit: 'contain', opacity: '0.5'  }} />
                <img src="https://d21is3bk1bus90.cloudfront.net/roster_avatars_v2/color/medium/broky.webp" alt="avatar" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: '300px' }} />
            </Grid>
            <Grid xs={8}>
                <Grid container spacing={2} rowSpacing={2}>
                    <Grid xs={6}>
                        <h1>{user.username}</h1>
                    </Grid>
                    <Grid xs={6}>
                        <h1>{user.cs_role}</h1>
                    </Grid>
                    <Grid xs={12}>
                        <div style={{
                            height: "10px",
                            width: "100%",
                            backgroundColor: "#582C82",
                            borderRadius: "20px",
                        }}></div>
                    </Grid>
                    {
                        loading ? (
                            <Grid xs={12} sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center",
                                height: "100px",
                                width: "100%",
                            }}>
                                <CircularProgressCustom />
                            </Grid>
                        ) : (
                            <Grid container spacing={2} rowSpacing={2}>
                                <Grid xs={3}>
                                    <h4>Rating</h4>
                                    <p>{stats.averages.Rating}</p>
                                </Grid>
                                <Grid xs={3}>
                                    <h4>Headshots %</h4>
                                    <p>{stats.averages["Headshots %"]} %</p>
                                </Grid>
                                <Grid xs={3}>
                                    <h4>K/D Ratio</h4>
                                    <p>{stats.averages["K/D Ratio"]}</p>
                                </Grid>
                                <Grid xs={3}>
                                    <h4>K/R Ratio</h4>
                                    <p>{stats.averages["K/R Ratio"]}</p>
                                </Grid>
                                <Grid xs={3}>
                                    <h4>Kills</h4>
                                    <p>{stats.sums.Kills}</p>
                                </Grid>
                                <Grid xs={3}>
                                    <h4>Deaths</h4>
                                    <p>{stats.sums.Deaths}</p>
                                </Grid>
                                <Grid xs={3}>
                                    <h4>Assists</h4>
                                    <p>{stats.sums.Assists}</p>
                                </Grid>
                                <Grid xs={3}>
                                    <h4>Headshots</h4>
                                    <p>{stats.sums.Headshots}</p>
                                </Grid>
                                <Grid xs={3}>
                                    <h4>Rounds Played</h4>
                                    <p>{stats.sums.RoundsPlayed}</p>
                                    </Grid>
                                <Grid xs={3}>
                                    <h4>Triple Kills</h4>
                                    <p>{stats.sums["Triple Kills"]}</p>
                                    </Grid>
                                <Grid xs={3}>
                                    <h4>Quadro Kills</h4>
                                    <p>{stats.sums["Quadro Kills"]}</p>
                                    </Grid>
                                <Grid xs={3}>
                                    <h4>Penta Kills</h4>
                                    <p>{stats.sums["Penta Kills"]}</p>
                                    </Grid>
                            </Grid>
                        )
                    }
                </Grid>
            </Grid>
        </Grid>
    );
};

export default UserInfo;