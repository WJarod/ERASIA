import React, { useState } from "react";
import { TextField, Button, Grid, Card, CardContent, Typography, Alert, Box } from "@mui/material";
import { login } from "../services/userService";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = () => {
        setError(null); // Clear any previous error
        login({ username, password })
            .then((response) => {
                localStorage.setItem("user", JSON.stringify(response));
                window.location.href = "/";
            })
            .catch((error) => {
                console.error("Login failed:", error);
                setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
            });
    };

    return (
        <Box className="container" sx={{
            //center
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            height: "100vh",
        }}>
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardContent sx={{
                            backgroundColor: "#ffffff",
                        }}>
                            <Typography variant="h4" align="center" gutterBottom>
                                Connexion
                            </Typography>
                            {error && <Alert severity="error" sx={{ marginBottom: "1rem" }}>{error}</Alert>}
                            <form>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Nom d'utilisateur"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            fullWidth
                                            sx={{ backgroundColor: "white" }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Mot de passe"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            fullWidth
                                            sx={{ backgroundColor: "white" }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="center" sx={{ marginTop: "1rem" }}>
                                    <Button onClick={handleLogin} variant="contained" color="primary">
                                        Se connecter
                                    </Button>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;
