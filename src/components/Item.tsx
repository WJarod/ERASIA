import { Paper } from "@mui/material";

interface ItemProps {
    element: React.ReactNode;
} 

const Item: React.FC<ItemProps> = ({ element }) => {
    return <Paper
    elevation={4}
    sx={{
        backgroundColor: "#202124",
        padding: "1rem",
        textAlign: "center",
        borderRadius: "20px",
        color: "#FFFFFF",
        height: "100%", 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    }}
    >{element}</Paper>;
};

export default Item;