import {
    Box,
    Button,
    Grid,
    LinearProgress,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import User from "../models/User";
import UserInfo from "../models/UserInfo";
import StatsGraph from "../models/StatsGraph";
import { useEffect, useState } from "react";
import { getWeekGraphStats, getPlayerInfo } from "../services/faceitService";
import { update } from "../services/userService";
import Mapplayed from "../models/StatsGraph";
import CircularProgressCustom from "../components/CircularProgressCustom";
import Item from "../components/Item";

const faceitLevel = [
    {
        level: 1,
        min: 0,
        max: 800,
    },
    {
        level: 2,
        min: 801,
        max: 950,
    },
    {
        level: 3,
        min: 951,
        max: 1100,
    },
    {
        level: 4,
        min: 1101,
        max: 1250,
    },
    {
        level: 5,
        min: 1251,
        max: 1400,
    },
    {
        level: 6,
        min: 1401,
        max: 1550,
    },
    {
        level: 7,
        min: 1551,
        max: 1700,
    },
    {
        level: 8,
        min: 1701,
        max: 1850,
    },
    {
        level: 9,
        min: 1851,
        max: 2000,
    },
    {
        level: 10,
        min: 2001,
        max: 2150,
    },
];

const Home = () => {
    const [user, setUser] = useState<User>({} as User);
    const [loading, setLoading] = useState<boolean>(true);
    const [userStats, setUserStats] = useState<StatsGraph[]>([]);
    const [mapPlayed, setMapPlayed] = useState<Mapplayed[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    useEffect(() => {
        const localUser = localStorage.getItem("user");
        if (localUser) {
            setUser(JSON.parse(localUser));
        }
    }, []);

    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                if (!user.faceit_id) {
                    return;
                }
                const stats = await getWeekGraphStats(user.faceit_id);
                setUserStats(stats.matchStatsPlayer);
                setMapPlayed(stats.mapplayed);
                const mapPlayedReduced = stats.mapplayed.slice(0, 4);
                setMapPlayed(mapPlayedReduced);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user stats:", error);
            }
        };

        fetchUserStats();
    }, [user.faceit_id]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (!user.faceit_id) {
                    return;
                }
                const info = await getPlayerInfo(user.faceit_id);
                setUserInfo(info);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo().then();
    }, [user.faceit_id]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedUser: User = {
                username: user?.username || "",
                password: user?.password || "",
                faceit_id: user?.faceit_id || "",
                profile_url: user?.profile_url || "",
                avatar_url: user?.avatar_url || "",
                _id: user?._id || "",
                cs_role: user?.cs_role || "",
            };

            await update(updatedUser._id, updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            console.error("Error updating user:", error);
        }
        handleClose();
    };

    //calculer le nombre de map jouer au total

    let totalMapPlayed = 0;
    mapPlayed.forEach((map) => {
        totalMapPlayed += map.played;
    });

    let progress = 0;
    let min = 0;
    let max = 0;
    let elo = 0;
    if (userInfo.level) {
        const level = userInfo.level;
        min = faceitLevel[level - 1].min;
        max = faceitLevel[level - 1].max;
        elo = userInfo.elo;
        progress = ((elo - min) / (max - min)) * 100;
    }

    //get progress bar
    const getProgress = (mapPlayed: number, mapWin: number) => {
        return (mapWin / mapPlayed) * 100;
    }

    //for date use userStats and for stats use userStats.map((stat) => stat.stats)
    const data = {
        labels: userStats.map((stat) => stat.Map),
        datasets: [
            {
                label: "Rating",
                data: userStats.map((stat) => stat.Rating),
                fill: false,
                backgroundColor: "rgb(255,255,255)",
                borderColor: "rgba(88, 44, 130, 0.5)",
            },
        ],
    };

    const data2 = {
        labels: userStats.map((stat) => stat.Map),
        datasets: [
            {
                label: "K/D",
                data: userStats.map((stat) => stat["K/D Ratio"]),
                fill: false,
                backgroundColor: "rgb(255,255,255)",
                borderColor: "rgba(88, 44, 130, 0.5)",
            },
            {
                label: "K/R",
                data: userStats.map((stat) => stat["K/R Ratio"]),
                fill: false,
                backgroundColor: "rgb(88,44,130)",
                borderColor: "rgba(255, 255, 255, 0.5)",
            },
        ],
    };

    const data3 = {
        labels: userStats.map((stat) => stat.Map),
        datasets: [
            {
                label: "Headshot %",
                data: userStats.map((stat) => stat["Headshots %"]),
                fill: false,
                backgroundColor: "rgb(255,255,255)",
                borderColor: "rgba(88, 44, 130, 0.5)",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Rating par map",
            },
        },
    };

    const options2 = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "K/D et K/R par map",
            },
        },
    };

    const options3 = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Headshot % par map",
            },
        },
    };

    return (
        <>
            {loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        height: "100%",
                        width: "100%",
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        rowSpacing={2}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center",
                            }}
                        >
                            <img src="/logo2000.png" alt="logo" height="400px" />
                        </Grid>
                        <Grid item xs={12}>
                            <CircularProgressCustom />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                variant="h4"
                                align="center"
                                gutterBottom
                                color="white"
                            >
                                Bienvenue
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Grid
                    container
                    spacing={2}
                    rowSpacing={2}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        height: "100vh",
                    }}
                >
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <Item element={
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <img
                                        src={user.avatar_url}
                                        alt="avatar"
                                        width="100"
                                        height="100"
                                        style={{
                                            borderRadius: "50%",
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        gutterBottom
                                        color="white"
                                    >
                                        {user.username}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h6"
                                        align="center"
                                        gutterBottom
                                        color="white"
                                    >
                                        {user.cs_role}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <button
                                        onClick={handleOpen}
                                    >
                                        Modifier
                                    </button>
                                </Grid>
                                <Grid item xs={6}>
                                    <button
                                        onClick={() => {
                                            window.open(userInfo.faceitUrl);
                                        }}
                                    >
                                        Faceit
                                    </button>
                                </Grid>
                            </Grid>
                        } />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        <Item element={
                            <Grid container spacing={2}>
                                <Grid item xs={2}>
                                    <Box sx={{
                                        backgroundColor: "#202124",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        alignContent: "center",
                                        height: "40px",
                                        width: "40px",
                                        borderRadius: "50%",
                                        border: "2px solid #582C82",
                                    }}>
                                        <h1 style={{ color: "#ffffff", fontSize: "20px" }}>{userInfo.level}</h1>
                                    </Box>
                                </Grid>
                                <Grid item xs={10}>
                                    <p
                                        style={{
                                            color: "#ffffff",
                                            fontSize: "16px",
                                            padding: "0px",
                                            margin: "0px",
                                        }}>
                                        Progression ({userInfo.eloToUp} pour le level {userInfo.level + 1})
                                    </p>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={0}>
                                        <Grid item xs={12}>
                                            <LinearProgress
                                                variant="determinate"
                                                sx={{
                                                    width: "100%",
                                                    height: "10px",
                                                    backgroundColor: "#4f4f4f",
                                                    borderRadius: "10px",
                                                }}
                                                value={progress}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <p
                                                    style={{
                                                        color: "#ffffff",
                                                        fontSize: "14px",
                                                        padding: "0px",
                                                        margin: "0px",
                                                    }}
                                                >
                                                    {min}
                                                </p>
                                                <p
                                                    style={{
                                                        color: "#ffffff",
                                                        fontSize: "14px",
                                                        padding: "0px",
                                                        margin: "0px",
                                                    }}
                                                >
                                                    ELO - {elo}
                                                </p>
                                                <p
                                                    style={{
                                                        color: "#ffffff",
                                                        fontSize: "14px",
                                                        padding: "0px",
                                                        margin: "0px",
                                                    }}
                                                >
                                                    {max}
                                                </p>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={5}>
                                    <Box sx={{
                                        backgroundColor: "#202124",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        alignContent: "center",
                                        height: "40px",
                                        width: "40px",
                                        borderRadius: "50%",
                                        border: "2px solid #582C82",
                                    }}>
                                        <h1 style={{ color: "#ffffff", fontSize: "16px" }}>{totalMapPlayed}</h1>
                                    </Box>
                                </Grid>
                                <Grid item xs={7}>
                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        mapPlayed.map((map) => (
                                            <div key={map.map}>
                                                <Grid key={map.map} xs={12}>
                                                    <p style={{
                                                        color: "#ffffff",
                                                        fontSize: "12px",
                                                        padding: "0px",
                                                        margin: "0px",
                                                    }}>{map.map}</p>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        sx={{
                                                            width: "100%",
                                                            height: "10px",
                                                            backgroundColor: "#4f4f4f",
                                                            borderRadius: "10px",
                                                        }}
                                                        value={getProgress(map.played, map.win)}
                                                    />
                                                </Grid>
                                                <Grid xs={12}>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <p
                                                            style={{
                                                                color: "#ffffff",
                                                                fontSize: "14px",
                                                                padding: "0px",
                                                                margin: "0px",
                                                            }}
                                                        > win - {map.win}</p>
                                                        <p
                                                            style={{
                                                                color: "#ffffff",
                                                                fontSize: "14px",
                                                                padding: "0px",
                                                                margin: "0px",
                                                            }}
                                                        >
                                                            {map.played}
                                                        </p>
                                                    </div>
                                                </Grid>
                                            </div>
                                        ))
                                    }
                                </Grid>
                            </Grid>
                        } />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Item element={<Line options={options} data={data} />} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Item element={<Line options={options2} data={data2} />} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Item element={<Line options={options3} data={data3} />} />
                    </Grid>
                </Grid>
            )}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "#ffffff",
                    boxShadow: 24,
                    borderRadius: "20px",
                    p: 4,
                }}>
                    <form onSubmit={handleUpdateProfile}>
                        <div
                            className="column"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            <TextField
                                label="Username"
                                variant="outlined"
                                value={user?.username}
                                onChange={(e) =>
                                    setUser({ ...user, username: e.target.value })
                                }
                                sx={{
                                    backgroundColor: "white",
                                    marginBottom: "1rem",
                                }}
                            />
                            <TextField
                                label="Profile URL"
                                variant="outlined"
                                value={user?.profile_url}
                                onChange={(e) =>
                                    setUser({ ...user, profile_url: e.target.value })
                                }
                                sx={{
                                    backgroundColor: "white",
                                    marginBottom: "1rem",
                                }}
                            />
                            <TextField
                                label="Avatar URL"
                                variant="outlined"
                                value={user?.avatar_url}
                                onChange={(e) =>
                                    setUser({ ...user, avatar_url: e.target.value })
                                }
                                sx={{
                                    backgroundColor: "white",
                                    marginBottom: "1rem",
                                }}
                            />
                            <TextField
                                label="CS Role"
                                variant="outlined"
                                value={user?.cs_role}
                                onChange={(e) =>
                                    setUser({ ...user, cs_role: e.target.value })
                                }
                                sx={{
                                    backgroundColor: "white",
                                    marginBottom: "1rem",
                                }}
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Modifier
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default Home;
