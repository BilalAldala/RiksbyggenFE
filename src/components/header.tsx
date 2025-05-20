import { Typography } from "@mui/material";
import styles from "../app/styles/header.module.css";


const Header = () => {

    return (
        <header className={styles.appBar}>
            <Typography variant="h6" className={styles.title}>
                Admin Back Office
            </Typography>
        </header>
    );
};

export default Header;