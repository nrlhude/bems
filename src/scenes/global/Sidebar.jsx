// Path: frontend/src/scenes/global/Sidebar.jsx

import React, { useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme, TextField, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
// Menu icons - Dashboard, Users, Teachers, Students, Parents, Kelas, Attendance, RPH, Evaluate, Class Report, Student Report, Settings
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
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
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import axios from 'axios';

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


const Sidebar = ({ userRole }) => {
    const parentId = localStorage.getItem('parentId');
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(true); // Sidebar collapse state
    const [selected, setSelected] = useState("Dashboard");

    console.log('User Role in Sidebar:', userRole);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [schoolSessions, setSchoolSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');

    useEffect(() => {
        // Fetch userid from localStorage
        const userId = localStorage.getItem('user_id');
        const currentYear = localStorage.getItem('currentYear');

        const fetchUser = async () => {
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}/`);
                setFirstName(response.data.first_name);
                setLastName(response.data.last_name);
            }
            catch(error){
                console.error('Error fetching user data:', error);
            }
        };

        const fetchSchoolSessions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                setSchoolSessions(response.data);
                const savedSessionId = localStorage.getItem('schoolsessionID');
                if (savedSessionId) {
                    setSelectedSession(savedSessionId);
                } else {
                    const currentSession = response.data.find(session => session.session_name === currentYear);
                    if (currentSession) {
                        setSelectedSession(currentSession.session_id);
                        localStorage.setItem('schoolsessionID', currentSession.session_id);
                        localStorage.setItem('schoolsessionName', currentSession.session_name);
                    }
                }
            } catch (error) {
                console.error('Error fetching school sessions:', error);
            }
        };

        fetchUser();
        fetchSchoolSessions();
            
    }, []);

    const handleSessionChange = (event) => {
        const newSessionId = event.target.value;
        setSelectedSession(newSessionId);
        localStorage.setItem('schoolsessionID', newSessionId);
        const selectedSession = schoolSessions.find(session => session.session_id === parseInt(newSessionId) );
        localStorage.setItem('schoolsessionName', selectedSession.session_name);
        window.location.reload();
    };

    console.log('localStorage in Sidebar:', localStorage);
    console.log('selectedSession in Sidebar:', selectedSession);

    return (
        <Box 
            sx={{
                "& .pro-sidebar-inner": {
                    background: `${colors.primary[400]} !important`,
                },
                "& .pro-icon-wrapper": {
                    backgroundColor: "transparent !important",
                },
                "& .pro-inner-item": {
                    padding: "0px 35px 5px 30px !important",
                },
                "& .pro-inner-item:hover": {
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active": {
                    color: "#6870fa !important",
                },
                height: "100vh",
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/* LOGO AND MENU ICON */}
                    <Tooltip title="Toggle Sidebar">
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
                    </Tooltip>

                    {!isCollapsed && (
                        <Box mb="15px">
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
                                    {firstName}
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    {userRole}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <TextField
                                    select
                                    label="Sesi Persekolahan"
                                    name='schoolSession'
                                    value={selectedSession}
                                    onChange={handleSessionChange}
                                    variant="outlined"
                                    style={{ width: "60%", margin: "20px 0 0 0" }}
                                    SelectProps={{ native: true }}
                                >
                                    {schoolSessions.map((session) => (
                                        <option key={session.session_id} value={session.session_id}>
                                            {session.session_name}
                                        </option>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : "20%"}>
                        

                        {userRole === 'ADMIN' && (
                            <>
                                    <Item
                                    title="Utama"
                                    to="/"
                                    icon={<HomeOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />
                                

                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "10px 0px 5px 25px" }}
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
                                    icon={<Diversity1OutlinedIcon />}
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
                                <Item
                                    title="Peperiksaan"
                                    to="/examination"
                                    icon={<AutoStoriesOutlinedIcon />}
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
                            </>
                        )}

                        {userRole === 'TEACHER' && (
                            <>
                                <Item
                                    title="Utama"
                                    to="/"
                                    icon={<HomeOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "10px 0px 5px 25px" }}
                                >
                                    Ahli
                                </Typography>
                                <Item
                                    title="Guru"
                                    to="/teachers"
                                    icon={<Diversity1OutlinedIcon />}
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
                                <Item
                                    title="Peperiksaan"
                                    to="/examination"
                                    icon={<AutoStoriesOutlinedIcon />}
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
                            </>
                        )}

                        {userRole === 'PARENT' && (
                            <>
                                <Item
                                    title="Utama"
                                    to="/"
                                    icon={<HomeOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

                                <Typography
                                    variant="h6"
                                    color={colors.grey[300]}
                                    sx={{ m: "10px 0 5px 20px" }}
                                >
                                    Halaman
                                </Typography>
                                <Item
                                    title="Profil Saya"
                                    to={`/viewprofileparent/${parentId}`}
                                    icon={<EscalatorWarningOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                />

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
                                    title="Laporan"
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

                            </>

                        )}
                        
                            

                            <Item
                                title="FAQ"
                                to="/faq"
                                icon={<HelpOutlineOutlinedIcon />}
                                selected={selected}
                                setSelected={setSelected}
                            />
                    </Box>
                </Menu>
            </ProSidebar>

        </Box>

    
  );
};

export default Sidebar;
