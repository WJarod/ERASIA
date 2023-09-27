import { Paper } from "@mui/material";

interface ItemProps {
    element: React.ReactNode;
    bool?: boolean;
} 

const Item: React.FC<ItemProps> = ({ element, bool = true}) => {
    return <Paper
    elevation={4}
    sx={{
        backgroundColor: "#202124",
        padding: bool ? "1rem" : "0px",
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