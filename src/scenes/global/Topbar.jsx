import React, { useContext } from 'react';
import { Box, IconButton, Typography, useTheme, Tooltip  } from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

const Topbar = ({ userRole, onLogout }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        // Perform logout action here
        onLogout(); // Call parent component's logout function
        navigate('/'); // Redirect to login page after logout
    };

    return (
        <Box
            display="flex"
            justifyContent="space-between"
            p={2}
            sx={{ background: colors.primary[400] }}
        >
            {/* Logo and Title */}
            <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.5rem" } }}>
                AL-BAGHDADI PLAYTIME CENTER PERMAS JAYA
            </Typography>

            {/* Actions */}
            <Box display="flex" alignItems="center">
                {/* Search */}
                {/* <Tooltip title="Search">
                <IconButton>
                    <SearchIcon />
                </IconButton>
                </Tooltip> */}

                {/* Theme Mode */}
                <Tooltip title="Toggle Theme Mode">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <LightModeOutlinedIcon />
                    ) : (
                        <DarkModeOutlinedIcon />
                    )}
                </IconButton>
                </Tooltip>

                {/* Notifications */}
                <Tooltip title="Notifications">
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                </Tooltip>
                {/* Profile */}
                <Tooltip title="Account Profile">
                <IconButton component={RouterLink} to={`accprofile/${localStorage.getItem('user_id')}`}>
                    <PersonOutlinedIcon />
                </IconButton>
                </Tooltip>
                {/* Logout */}
                <Tooltip title="Logout">
                <IconButton onClick={handleLogoutClick}>
                    <LogoutOutlinedIcon />
                </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default Topbar;
