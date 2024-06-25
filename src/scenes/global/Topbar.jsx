import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
  
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
                <IconButton>
                    <SearchIcon />
                </IconButton>

                {/* Theme Mode */}
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "dark" ? (
                        <LightModeOutlinedIcon />
                    ) : (
                        <DarkModeOutlinedIcon />
                    )}
                </IconButton>

                {/* Notifications */}
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>

                {/* Profile */}
                <IconButton>
                    <PersonOutlinedIcon />
                </IconButton>

                {/* Logout */}
                <IconButton>
                    <LogoutOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Topbar;
