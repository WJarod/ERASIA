
import { useEffect, useState } from "react";
import { Calendar, Home, LogIn, LogOut, BarChart, User } from "react-feather";
import UserModel from "../models/User";
import { Box, Link, Stack, } from "@mui/material";

const NavBar = () => {

    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [user, setUser] = useState<UserModel | null>(null);

    const fetchLocalUser = () => {
        const user = localStorage.getItem("user");
        if (user) {
            setUserLoggedIn(true);
            setUser(JSON.parse(user));
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUserLoggedIn(false);
    };

    useEffect(() => {
        fetchLocalUser();
    }
        , []);

    return (
        <Box
            className="navbar" // Ajoute la classe CSS ici
            sx={{
                backgroundColor: "#202124",
                height: "95vh",
                width: "100%",
                borderRadius: "20px",
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                alignContent: "center",
                padding: "0px",
                margin: "0px",
            }}
        >
            <Stack sx={{
                height: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
                alignContent: 'center',
            }}>
                <Link href="/">
                    <img src="/logo2000.png" alt="logo" width="90%" height="90%" />
                </Link>
                {!userLoggedIn ? (<div></div>) : (
                    <Link href="/">
                        <Home color="white" size={30} />
                    </Link>
                )}
                {!userLoggedIn ? (<div></div>) : (
                    <Link href="/calendar">
                        <Calendar color="white" size={30} />
                    </Link>
                )}
                {!userLoggedIn ? (<div></div>) : (
                    <Link href="/profile">
                        <User color="white" size={30} />
                    </Link>
                )}
                {!userLoggedIn ? (<div></div>) : (
                    <Link href="/stats">
                        <BarChart color="white" size={30} />
                    </Link>
                )}
                {userLoggedIn ? (
                    <Link href="/" onClick={logout}>
                        <LogOut color="white" size={30} />
                    </Link>
                ) : (
                    <Link href="/login">
                        <LogIn color="white" size={30} />
                    </Link>
                )}
            </Stack>
        </Box>
    );
};

export default NavBar;
