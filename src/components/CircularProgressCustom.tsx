import { CircularProgress } from "@mui/material";

const CircularProgressCustom = () => {
    return (
        <CircularProgress
        className="circular-progress"
        color="primary"
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            margin: "auto",
        }}
    />
    )
}

export default CircularProgressCustom;