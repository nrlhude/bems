// Path: frontend/src/scenes/global/Sidebar.jsx

import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// Menu icons - Dashboard, Users, Teachers, Students, Parents, Kelas, Attendance, RPH, Evaluate, Class Report, Student Report, Settings
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EscalatorWarningOutlinedIcon from '@mui/icons-material/EscalatorWarningOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import HistoryEduOutlinedIcon from '@mui/icons-material/HistoryEduOutlined';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SettingsCellOutlinedIcon from '@mui/icons-material/SettingsCellOutlined';
import WorkspacesOutlinedIcon from '@mui/icons-material/WorkspacesOutlined';
import RoomPreferencesOutlinedIcon from '@mui/icons-material/RoomPreferencesOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <MenuItem
            active={selected === title}
            style={{
                color: colors.grey[100],
            }}
            onClick={() => setSelected(title)}
            icon={icon}
            title={title}
        >
            <Typography>{title}</Typography>
            <Link to={to} />
        </MenuItem>
    );
};

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false); // Sidebar collapse state
    const [selected, setSelected] = useState("Dashboard");

    return(
        <Box 
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`,
                    height: "100%", 
                    overflow: "hidden",
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
                "@media (max-width: 768px)": {
                    "& .pro-sidebar-inner": {
                        display: "none",
                    },
                },
                height: "100%",
                
            }}
        >
            <ProSidebar collapsed={isCollapsed} style={{ height: '100%', overflow: 'hidden' }}>
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: "10px 0 0 0",
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                ml="15px"
                            >
                                <Typography variant="h3" color={colors.grey[100]}>
                                    BEMS
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>

                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img
                                    alt="profile-user"
                                    width="100px"
                                    height="100px"
                                    src={`../../assets/user.jpg`}
                                    style={{ cursor: "pointer", borderRadius: "50%" }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: "10px 0 0 0" }}
                                >
                                    Nurul Huda
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    Administrator
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* MENU ITEMS */}
                    {/* Menu list - Dashboard, Calendar, Teachers, Students, Timetable, Attendance, RPH, Class Report, Student Report, Settings */}

                    <Box paddingLeft={isCollapsed ? undefined : "10%"}>
                        <Item
                            title="Utama"
                            to="/dashboard"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "10px 0 5px 15px" }}
                        >
                            Ahli
                        </Typography>
                        <Item
                            title="Semua Ahli"
                            to="/users"
                            icon={<WorkspacesOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Guru"
                            to="/teachers"
                            icon={<SupervisedUserCircleOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Pelajar"
                            to="/students"
                            icon={<SchoolOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Ibu Bapa"
                            to="/parents"
                            icon={<EscalatorWarningOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 15px" }}
                        >
                            Halaman
                        </Typography>

                        {/* <Item
                            title="Kalendar Acara"
                            to="/calendar"
                            icon={<CalendarMonthOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> */}

                        {/* <Item
                            title="Jadual Waktu"
                            to="/timetable"
                            icon={<TableChartOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> */}

                        <Item
                            title="Kelas"
                            to="/kelasSession"
                            icon={<RoomPreferencesOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Item
                            title="Kehadiran"
                            to="/attendance"
                            icon={<AssignmentTurnedInOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected} 
                        /> 

                        <Item
                            title="RPH"
                            to="/rph"
                            icon={<HistoryEduOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        
                        <Item
                            title="Penilaian Pelajar"
                            to="/evaluation"
                            icon={<TableChartOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        /> 
                        
                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Laporan
                        </Typography>
                        <Item
                            title="Laporan Kelas"
                            to="/reportClass"
                            icon={<FolderZipOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Laporan Pelajar"
                            to="/reportStudent"
                            icon={<CoPresentOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        <Typography
                            variant="h6"
                            color={colors.grey[300]}
                            sx={{ m: "15px 0 5px 20px" }}
                        >
                            Info
                        </Typography>
                            

                        <Item
                            title="Educational Info"
                            to="/settings/school-sessions"
                            icon={<SettingsOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        
                        <Item
                            title="FAQ"
                            to="/faq"
                            icon={<HelpOutlineOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />

                        {/* <Item
                            title="Test UI"
                            to="/testUI"
                            icon={<SettingsCellOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                        />  */}
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>

    );
};

export default Sidebar;