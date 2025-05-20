import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import BusinessIcon from '@mui/icons-material/Business';
import styles from '../app/styles/adminPortal.module.css';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CompaniesTable from './companies';

const AdminPortal = () => {
    const [selectedMenu, setSelectedMenu] = useState('companies');
    const [mobileOpen, setMobileOpen] = useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className={styles.root}>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={styles.menuButton}
                style={{ marginLeft: theme.spacing(1) }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                className={styles.drawer}
                variant={isSmallScreen ? "temporary" : "permanent"}
                open={isSmallScreen ? mobileOpen : true}
                onClose={handleDrawerToggle}
                classes={{ paper: styles.drawerPaper }}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <List>
                    <ListItem onClick={() => setSelectedMenu('companies')} className={selectedMenu === 'companies' ? styles.selectedItem : ''}>
                        <ListItemIcon><BusinessIcon /></ListItemIcon>
                        <ListItemText primary="Bolag" />
                    </ListItem>
                </List>
            </Drawer>
            <main className={`${styles.content} ${isSmallScreen ? styles.contentShift : ''}`}>
                {selectedMenu === 'companies' && <CompaniesTable />}
            </main>
        </div>
    );
};

export default AdminPortal;