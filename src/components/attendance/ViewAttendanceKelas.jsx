// Desc: View attendance for a specific class
// file path : frontend/src/components/attendance/ViewAttendanceKelas.jsx
// route path : /viewattendancekelas/:attendanceKelasId

import Header from "../Header";
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ViewAttendanceKelas = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { attendanceKelasId } = useParams(); 
    const [attendanceKelas, setAttendanceKelas] = useState({});
    const [loading, setLoading] = useState(true);
    const [studentAttendance, setStudentAttendance] = useState([]);
    const [studentAttendanceLoading, setStudentAttendanceLoading] = useState(true);

    const currentUserRole = localStorage.getItem('role');

    const filteredStudentAttendance = studentAttendance.filter(item => item.attendance_id === parseInt(attendanceKelasId));

    useEffect(() => {
        const fetchAttendanceKelas = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/attendance-kelas/${attendanceKelasId}/`);
                setAttendanceKelas(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching attendance kelas:', error);
                setLoading(false);
            }
        };

        const fetchStudentAttendance = async () => {
            try {
                const studentResponse = await axios.get('http://127.0.0.1:8000/api/studentprofile/');
                const studentNameMap = new Map(studentResponse.data.map(student => [student.id, student.full_name]));

                const attResponse = await axios.get('http://127.0.0.1:8000/api/attendance-kelas/');
                const attNameMap = new Map(attResponse.data.map(att => [att.attendance_id, att.attendance_name]));

                const response = await axios.get('http://127.0.0.1:8000/api/student-attendance/'); 
                
                const dataWithIds = response.data.map((item) => ({
                    ...item,
                    id: item.studentattendance_id,
                    student_name: studentNameMap.get(item.student_id) || ' ',
                    attendance_name: attNameMap.get(item.attendance_id) || ' ',
                }));
                setStudentAttendance(dataWithIds);
                setStudentAttendanceLoading(false);
            } catch (error) {
                console.error('Error fetching student attendance:', error);
                setStudentAttendanceLoading(false);
            }
        };

        fetchAttendanceKelas();
        fetchStudentAttendance();
    }, [attendanceKelasId]);

    console.log('filteredStudentAttendance:', filteredStudentAttendance);

    const handleViewStudent = (studentId) => {
        window.location.href = `/viewprofilestudent/${studentId}`;
    };

    const handleAttendanceStatusUpdate = async (studentAttendanceId, studentId, attendanceId, status) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/student-attendance/${studentAttendanceId}/`, {
                status,
                student_id: studentId,
                attendance_id: attendanceId
            });
            setStudentAttendance(prevState =>
                prevState.map(item =>
                    item.studentattendance_id === studentAttendanceId ? { ...item, status } : item
                )
            );
            alert('Attendance status updated successfully.');
        } catch (error) {
            console.error('Error updating attendance status:', error);
            alert('Failed to update attendance status.');
        }
    };


    const handleSemuaHadirUpdate = async () => {
        try {
            await Promise.all(filteredStudentAttendance.map(async (student) => {
                await axios.put(`http://127.0.0.1:8000/api/student-attendance/${student.studentattendance_id}/`, {
                    status: 'Hadir',
                    student_id: student.student_id,
                    attendance_id: student.attendance_id
                });
            }));
            const updatedAttendance = filteredStudentAttendance.map(student => ({
                ...student,
                status: 'Hadir'
            }));
            setStudentAttendance(updatedAttendance);
            alert('Semua Hadir successfully updated.');
        } catch (error) {
            console.error('Error updating Semua Hadir:', error);
            alert('Failed to update Semua Hadir.');
        }
    };

    const handleSemuaTidakHadirUpdate = async () => {
        try {
            await Promise.all(filteredStudentAttendance.map(async (student) => {
                await axios.put(`http://127.0.0.1:8000/api/student-attendance/${student.studentattendance_id}/`, {
                    status: 'Tidak Hadir',
                    student_id: student.student_id,
                    attendance_id: student.attendance_id
                });
            }));
            const updatedAttendance = filteredStudentAttendance.map(student => ({
                ...student,
                status: 'Tidak Hadir'
            }));
            setStudentAttendance(updatedAttendance);
            alert('Semua Tidak Hadir successfully updated.');
        } catch (error) {
            console.error('Error updating Semua Tidak Hadir:', error);
            alert('Failed to update Semua Tidak Hadir.');
        }
    };
    

    // handleUpdateReasonAbsent -> alert box input, update reason absent
    const handleUpdateReasonAbsent = async (studentAttendanceId, studentId, attendanceId) => {
        const reason = prompt('Please enter the reason for absence:');
        if (reason) {
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/student-attendance/${studentAttendanceId}/`, {
                    status: 'Tidak Hadir',
                    reasonabsent: reason,
                    student_id: studentId,
                    attendance_id: attendanceId
                });
                console.log('Response from update reason absent:', response.data);
                setStudentAttendance(prevState =>
                    prevState.map(item =>
                        item.studentattendance_id === studentAttendanceId ? { ...item, reasonabsent:reason } : item
                    )
                );
                alert('Reason for absence updated successfully.');
            } catch (error) {
                console.error('Error updating reason for absence:', error);
                alert('Failed to update reason for absence.');
            }
        } else {
            alert('Reason for absence cannot be empty.');
        }
    };

    const [isMyKid, setIsMyKid] = useState({});

    const myKids = async (studentId) => {
        const parentId = localStorage.getItem('parentId');
        const studentprofileRes = await axios.get(`http://127.0.0.1:8000/api/studentprofile/${studentId}/`);
        return studentprofileRes.data.parent_id === parseInt(parentId);
    };

    useEffect(() => {
        const checkMyKids = async () => {
            const myKidsStatus = {};
            for (const student of filteredStudentAttendance) {
                myKidsStatus[student.student_id] = await myKids(student.student_id);
            }
            setIsMyKid(myKidsStatus);
        };
    
        checkMyKids();
    }, [filteredStudentAttendance]);



    const columns = [
        { field: 'student_name', headerName: 'Student Name', flex: 0.5 },
        { field: 'attendance_date', headerName: 'Tarikh', flex: 0.5 },
        { field: 'status', headerName: 'Status', flex: 0.5 },
        { field: 'reasonabsent', headerName: 'Sebab Tidak Hadir', flex: 0.5 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" mt='10px'>
                    { currentUserRole !== 'PARENT' && params.row.status !== 'Hadir' &&(
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleAttendanceStatusUpdate(params.row.studentattendance_id, params.row.student_id, params.row.attendance_id, 'Hadir')}
                        sx={{ marginRight: 1 }}
                    >
                        Hadir
                    </Button>
                    )}
                    { currentUserRole !== 'PARENT' && params.row.status !== 'Tidak Hadir' &&(
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleAttendanceStatusUpdate(params.row.studentattendance_id, params.row.student_id, params.row.attendance_id, 'Tidak Hadir')}
                    >
                        Tidak Hadir
                    </Button>
                    )}
                    {((params.row.status === 'Tidak Hadir' && isMyKid[params.row.student_id]) ||  (params.row.status === 'Tidak Hadir' &&currentUserRole !== 'PARENT')) && (
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => handleUpdateReasonAbsent(params.row.studentattendance_id, params.row.student_id, params.row.attendance_id)}
                        sx={{ marginLeft: 1 }}
                    >
                        Update Reason
                    </Button>
                    )}
                    { currentUserRole !== 'PARENT' &&(
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewStudent(params.row.student_id)}
                        sx={{ marginLeft: 1 }}
                    >
                        View Student
                    </Button>
                    )}
                </Box>
            ),
        },
    ];

    return (
        <Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : attendanceKelas ? (
                <Box>
                    <Box m="10px 0 0 20px">
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link component={RouterLink} to="/attendance" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                Kehadiran
                            </Link>
                            <Typography color="text.primary"> Kehadiran Kelas {attendanceKelas.attendance_name}</Typography>
                        </Breadcrumbs>
                    </Box>

                    <Box m="10px 0 0 20px">
                        <Header title={`Kehadiran Kelas ${attendanceKelas.attendance_name}`} />
                        <Box boxShadow={15} p="10px" mt="20px">
                            <TextField
                                name="attendance_date"
                                label="Tarikh Kehadiran"
                                value={attendanceKelas.attendance_date}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                name="attendance_name"
                                label="Kelas Kehadiran"
                                value={attendanceKelas.attendance_name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                name="bilangan_hadir"
                                label="Bilangan Hadir"
                                value={filteredStudentAttendance.filter(item => item.status === 'Hadir').length}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                            <TextField
                                name="bilangan_tidakhadir"
                                label="Bilangan Tidak Hadir"
                                value={filteredStudentAttendance.filter(item => item.status === 'Tidak Hadir').length}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '47.5%' }}
                            />
                        </Box>

                        <Box boxShadow={15} p="10px" m="20px">
                            <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Senarai Pelajar</Typography>
                            { currentUserRole !== 'PARENT' &&(
                            <Box boxShadow={15} p="10px" mt="20px">
                            
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => handleSemuaHadirUpdate('Hadir')}
                                    sx={{ marginRight: 1 }}
                                >
                                    Semua Hadir
                                </Button>
                            
                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleSemuaTidakHadirUpdate('Tidak Hadir')}
                                >
                                    Semua Tidak Hadir
                                </Button>
                            
                            </Box>
                        )}
                            <Box
                                m="10px"
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
                                    "& .MuiDataGrid-toolbarContainer .      MuiButton-text": {
                                        color: `${colors.grey[100]} !important`,
                                    },
                                }}
                            >
                                <DataGrid
                                    rows={filteredStudentAttendance}
                                    columns={columns}
                                    getRowId={(row) => row.studentattendance_id}
                                    slots={{ toolbar: GridToolbar }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            ) : (
                <Typography>Attendance Kelas not found</Typography>
            )}
        </Box>
    );
};

export default ViewAttendanceKelas;
