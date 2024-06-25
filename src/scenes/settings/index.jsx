import React, { useState } from 'react';
import { Box, Typography, Tab, Tabs } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

const Settings = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const settingsItems = [
        { label: "Sesi Persekolahan", path: "/settings/school-sessions" },
        { label: "Program", path: "/settings/programs" },
        { label: "Kelas", path: "/settings/classes" },
        { label: "Jadual Waktu", path: "/settings/timetable" },
        { label: "KSPK", path: "/settings/kspk" }
    ];

    return (
        <Box m="10px">
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Settings Tabs">
                {settingsItems.map((item, index) => (
                    <Tab key={index} label={item.label} component={Link} to={item.path} />
                ))}
            </Tabs>
        </Box>
    );
};

export default Settings;
