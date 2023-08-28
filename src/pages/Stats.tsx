import { useEffect, useState } from "react";
import { getAll, getOne } from "../services/userService";
import User from "../models/User";
import UserStats from "../models/UserStats";
import { getWeekStats } from "../services/faceitService";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import UserTable from "../components/UserTable";
import CircularProgressCustom from "../components/CircularProgressCustom";

const Stats = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [weekStats, setWeekStats] = useState<{ [playerId: string]: UserStats }>(
        {}
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null); // Use null for initial state

    const fetchWeekStats = async (player_id: string) => {
        try {
            const stats = await getWeekStats(player_id);
            setWeekStats((prevStats) => ({ ...prevStats, [player_id]: stats }));
        } catch (error) {
            console.error("Error fetching week stats:", error);
        }
    };

    const fetchUsersAndStats = async () => {
        setLoading(true);
        try {
            const users = await getAll();
            setUsers(users);
            await Promise.all(
                users.map((user: User) => fetchWeekStats(user.faceit_id))
            );
        } catch (error) {
            console.error("Error fetching users:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const fetchUser = async (id: string) => {
            try {
                const user = await getOne(id);
                setUser(user);

                // Update local storage with the new user data
                localStorage.setItem("user", JSON.stringify(user));
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        const localUser = localStorage.getItem("user");
        if (localUser) {
            const localUserId = JSON.parse(localUser)._id;
            if (localUserId) {
                fetchUser(localUserId);
            }
        }
    }, []);

    useEffect(() => {
        fetchUsersAndStats();
    }, []);
    
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Grid container justifyContent="center">
                <Grid>
                    <Card sx={{
                            backgroundColor: "#202124",
                            color: "white",
                            width: "98%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            alignContent: "center",
                            flexDirection: "column",
                            padding: "20px",
                            borderRadius: "20px",
                        }}>      
                        <CardContent>
                            <Typography variant="h4" align="center" gutterBottom sx={{color:"white"}}>
                                Statistiques des joueurs sur la semaine
                            </Typography>
                            {loading ? (
                                <CircularProgressCustom/>
                            ) : (
                                <UserTable users={users} weekStats={weekStats} />
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}

export default Stats