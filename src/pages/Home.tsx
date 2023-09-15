import {
    Box,
    Grid,
    Typography,
} from "@mui/material";
import CircularProgressCustom from "../components/CircularProgressCustom";
import Item from "../components/Item";
import React, { useState, Suspense, useEffect } from "react";
import User from "../models/User";
import { getAll } from "../services/userService";
import CarouselCustom from "../components/Carousel";
import EventCalandar from "../components/EventCalandar";

const Home = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const Spline = React.lazy(() => import('@splinetool/react-spline'));
    const [users, setUsers] = useState<User[]>([]);
    

const fetchUsers = async () => {
    const users = await getAll();
    return users;
}

useEffect(() => {
    const fetchUser = async () => {
        const users = await fetchUsers();
        setUsers(users);
        console.log("users: ", users);
        if(users.length === 5){
            localStorage.setItem("players", JSON.stringify(users));
        }
    }

    const localPlayers = localStorage.getItem("players");
    if(localPlayers){
        setUsers(JSON.parse(localPlayers));
    } else {
        fetchUser();
    }
}, []);

    return (
        <>
            {!loading ? (
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
                            <Suspense fallback={
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                    height: "35vh",
                                    width: "100%",
                                }}>
                                    <img src="/logo2000.png" alt="logo" height="200px" />
                                </div>
                            }>
                                <Spline style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                    height: "35vh",
                                    width: "100%",
                                }}
                                    scene="https://prod.spline.design/eeifoQDe6EzAT3cp/scene.splinecode"
                                />
                            </Suspense>
                        } />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={3}>
                        {/* Maillot 3D */}
                        <Item element={<div style={{height: "35vh",}}></div>} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Item element={
                            users.length === 5 ? (
                                    <CarouselCustom users={users} />
                            ) : (
                                <CircularProgressCustom/>
                            )
                        } />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={6}>
                        <Item element={
                            <EventCalandar />
                        } />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={6}>
                        <Item element={<div style={{height: "45vh",}}></div>} />
                    </Grid>
                </Grid>
            )}
        </>
    );
};

export default Home;
