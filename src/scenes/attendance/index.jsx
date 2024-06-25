// file path : frontend/src/scenes/attendance/index.jsx
// route path : /attendance

import React, { useState, useEffect } from 'react';
import Header from "../../components/Header";
import { Box, TextField, Button } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Link } from 'react-router-dom';
import axios from 'axios';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

const Attendance = () => {
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [input_date, setDate] = useState(getTodayDate());
    // const [input_date, setDate] = useState();
    const [attendanceData, setAttendanceData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [studentAttendance, setStudentAttendance] = useState([]);
    const [loading, setLoading] = useState(false);

    
    const calculateHadir = (attendanceId) => {
        const hadirCount = studentAttendance.filter(item => item.attendance_id === attendanceId && item.status === 'Hadir').length;
        console.log('attendanceId hadir', attendanceId, hadirCount);
        return hadirCount;

    };

    const calculateTidakHadir = (attendanceId) => {
        const tidakHadirCount = studentAttendance.filter(item => item.attendance_id === attendanceId && item.status === 'Tidak Hadir').length;
        console.log('attendanceId  tidakhadir', attendanceId, tidakHadirCount);
        return tidakHadirCount;
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
    
                // Fetch both attendance-kelas and student-attendance data
                const [attendanceResponse, studentAttendanceResponse] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/attendance-kelas/'),
                    axios.get('http://127.0.0.1:8000/api/student-attendance/')
                ]);
    
                // Set student attendance data
                setStudentAttendance(studentAttendanceResponse.data);
    
                // Fetch kelas-session data
                const kelasSessionResponse = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const kelasMap = new Map(kelasSessionResponse.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));
    
                // Map over attendance-kelas data to calculate hadir and tidak_hadir
                const data = attendanceResponse.data.map((item) => ({
                    ...item,
                    id: item.attendance_id,
                    kelassession_id: item.kelassession_id,
                    attendance_date: item.attendance_date,
                    attendance_name: item.attendance_name,
                    kelas_name: kelasMap.get(item.kelassession_id) || '',
                    hadir: calculateHadir(item.attendance_id),
                    tidak_hadir: calculateTidakHadir(item.attendance_id),
                }));
    
                // Filter data based on the selected input_date
                const filteredDateData = data.filter((item) => item.attendance_date === input_date);
                setAttendanceData(filteredDateData);
    
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
    
        fetchData();
    }, [input_date]);
    



    const columns = [
        { field: 'kelas_name', headerName: 'Kelas Sesi', flex: 0.5 },
        { field: 'attendance_date', headerName: 'Tarikh', flex: 1 },
        { field: 'attendance_name', headerName: 'Nama Kehadiran', flex: 0.5 },
        { field: 'hadir', headerName: 'Bil Hadir', flex: 1 },
        { field: 'tidak_hadir', headerName: 'Bil Tidak Hadir', flex: 0.5 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ marginRight: 1 }}
                        onClick={() => handleViewAttendanceKelas(params.row.id)}
                    >
                        View
                    </Button>
                </Box>
            ),
        },
    ];

    const handleViewAttendanceKelas = (attendanceId) => {
        window.location.href = `/viewattendancekelas/${attendanceId}`;
    };

    const handleCreateAttendanceKelas = () => {
        window.location.href = `/createattendancekelas/${input_date}`;
    };

    return (
        <Box m="10px 0 0 20px">
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="KEHADIRAN" subtitle="Senarai kehadiran pelajar" />
            </Box>
            
            {/* Date Input */}
            <Box display="flex" alignItems="center" m="20px 0px" boxShadow={15} p="10px" >
                <TextField
                    label="Tarikh"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={input_date}
                    onChange={handleDateChange}
                    style={{ margin: '10px', width: '31%' }}
                />
                {/* <Button 
                        variant="contained"
                        color="secondary"
                        sx={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            padding: "10px 15px",
                            marginBottom: "5px",
                            marginLeft: "150px",
                        }}
                        onClick={fetchAttendanceData}>
                    Get Attendance
                </Button> */}
                <Button
                    sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "12px",
                            fontWeight: "bold",
                            padding: "10px 15px",
                            marginBottom: "5px",
                            marginLeft: "10px",
                    }}
                    onClick={() => handleCreateAttendanceKelas()}
                    >
                        <AddOutlinedIcon sx={{ mr: "10px" }} />
                        Add New
                    </Button>
                    
            </Box>

            {/* Attendance DataGrid */}
            <Box boxShadow={15} p="10px" display="flex" 
                m="10px 0px 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={attendanceData}
                    columns={columns}
                    getRowId={(row) => row.id}
                    slots={{ toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default Attendance;
