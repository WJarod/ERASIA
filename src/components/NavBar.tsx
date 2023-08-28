
import { useEffect, useState } from "react";
import { Calendar, Home, LogIn, LogOut, BarChart } from "react-feather";
import User from "../models/User";
import { Avatar, Box, Link, Stack, } from "@mui/material";

const NavBar = () => {

    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

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
            sx={{
                width: "120px",
                backgroundColor: "#202124",
                height: '95vh',
                borderRadius: '20px',
            }}
        >
            <Stack sx={{
                height: '100%',
                justifyContent: 'space-around',
                alignItems: 'center',
                alignContent: 'center',
            }}>
                <Link href="/">
                    <img src="/logo2000.png" alt="logo" width="100" height="100" />
                </Link>
                <Link href="/">
                    <Home color="white" size={30} />
                </Link>
                <Link href="/calendar">
                    <Calendar color="white" size={30} />
                </Link>
                <Link href="/stats">
                    <BarChart color="white" size={30} />
                </Link>
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
