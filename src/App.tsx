import React from "react";
import NavBar from "./components/NavBar";
import { Route, Routes } from "react-router-dom";
import AuthGuard from "./helpers/guard";
import { Box, Grid, ThemeProvider, createTheme } from "@mui/material";
import "./App.css";

// import pages here
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Stats from "./pages/Stats";
import Login from "./pages/Login";
import UserStat from "./pages/UserStat";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#582C82", // Change the primary color
      },
      secondary: {
        main: "#FFFFFF", // Change the secondary color
      },
      info: {
        main: "#202124", // Change the info color
      },
      background: {
        default: "#202124", // Change the default background color
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid container spacing={0.5} height="100vh">
        <Grid
          item
          xs={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <NavBar />
        </Grid>
        <Grid item xs={11}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              overflow: "auto",
              overflowY: "scroll",
            }}>
            <Routes>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/calendar"
                element={<AuthGuard element={<Calendar />} redirectTo="/login" />}
              />
              <Route
                path="/stats"
                element={<AuthGuard element={<Stats />} redirectTo="/login" />}
              />
              <Route
                path="/profile"
                element={<AuthGuard element={<UserStat />} redirectTo="/login" />}
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default App;
