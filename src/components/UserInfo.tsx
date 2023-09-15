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
    const [localStats, setLocalStats] = useState<Stats[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchStats = async (id: string) => {
        const allStats = await getStats(id);
        return allStats;
    }

    const fetchLocalStat = async (id: string) => {
        const localStats = localStorage.getItem('stats');
        if (localStats) {
            const stats = JSON.parse(localStats);
            const userStats = stats.find((stat: Stats) => stat.player_id === id);
            return userStats;
        }
        return null;
    }

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                const allStats = await fetchStats(user.faceit_id);
                setStats(allStats);
                // Stocker les données dans le localStorage
                const currentStats = JSON.parse(localStorage.getItem('stats') || '[]');
                const updatedStats = currentStats.filter((stat: Stats) => stat.player_id !== user.faceit_id);
                updatedStats.push(allStats);
                localStorage.setItem('stats', JSON.stringify(updatedStats));
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des stats en ligne, utilisation du localStorage", error);
                const localStat = await fetchLocalStat(user.faceit_id);
                if (localStat) {
                    setStats(localStat);
                    setLoading(false);
                } else {
                    // Gérer l'erreur si aucune donnée n'est disponible en ligne ou dans le localStorage
                    console.error("Aucune donnée disponible en ligne ou dans le localStorage");
                }
            }
        }
        fetchUserStats();
    }, [user.faceit_id]);
    

    return (
        <Grid container spacing={2} rowSpacing={2}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                height: "35vh",
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