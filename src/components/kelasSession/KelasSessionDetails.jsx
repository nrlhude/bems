// frontend/src/components/kelasSession/ViewKelasSession.jsx
// route path : /viewkelassession/:kelassessionId

import Header from "../Header";
import { Box, Button, Tab, Tabs, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const ViewKelasSession = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { kelassessionId } = useParams();
    const [kelasSession, setKelasSession] = useState({});
    const [loading, setLoading] = useState(true);
    const [peopleKelas, setPeopleKelas] = useState([]);
    const [peopleKelasLoading, setPeopleKelasLoading] = useState(true);
    const [tabValue, setTabValue] = React.useState(0);

    const currentUserRole = localStorage.getItem('role');
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const filteredTeacherPeopleKelas = peopleKelas.filter(item => item.kelassession_id === parseInt(kelassessionId) && item.role === 'GURU');

    const filteredStudentPeopleKelas = peopleKelas.filter(item => item.kelassession_id === parseInt(kelassessionId) && item.role === 'PELAJAR');

    const filteredStudentPeopleKelasAktif = peopleKelas.filter(item => item.kelassession_id === parseInt(kelassessionId) && item.role === 'PELAJAR' && item.status === 'Aktif');

    useEffect(() => {
        const fetchKelasSession = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/kelas-session/${kelassessionId}/`);
                setKelasSession(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching kelas session:', error);
                setLoading(false);
            }
        };
        const fetchPeopleKelas = async () => {
            try {
                const teacherResponse = await axios.get('http://127.0.0.1:8000/api/teacherprofile/');
                const teacherNameMap = new Map(teacherResponse.data.map(teacher => [teacher.id, teacher.full_name]));
                console.log('teacherNameMap', teacherNameMap);
                const teacherICMap = new Map(teacherResponse.data.map(teacher => [teacher.id, teacher.ic_number]));
                console.log('teacherICMap', teacherICMap);
                const teacherGenderMap = new Map(teacherResponse.data.map(teacher => [teacher.id, teacher.gender]));
                console.log('teacherGenderMap', teacherGenderMap);

                const studentResponse = await axios.get('http://127.0.0.1:8000/api/studentprofile/');
                const studentNameMap = new Map(studentResponse.data.map(student => [student.id, student.full_name]));
                console.log('studentNameMap', studentNameMap);
                const studentICMap = new Map(studentResponse.data.map(student => [student.id, student.ic_number]));
                console.log('studentICMap', studentICMap);
                const studentGenderMap = new Map(studentResponse.data.map(student => [student.id, student.gender]));
                console.log('studentGenderMap', studentGenderMap);

                const enrolResponse = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                const kelasMap = new Map(enrolResponse.data.map(kelas => [kelas.kelassession_id, kelas.kelassession_name]));
                console.log('kelasMap', kelasMap);

                const response = await axios.get('http://127.0.0.1:8000/api/people-kelas/');
                console.log('response', response);
                const dataWithIds = response.data.map((item) => ({ 
                    ...item, 
                    id: item.peoplekelas_id, 
                    id_teacher: item.teacher_id, 
                    id_student: item.student_id, 
                    id_kelassession: item.kelassession_id,
                    status: item.status,
                    teacher_full_name: teacherNameMap.get(item.teacher_id) || ' ',
                    student_full_name: studentNameMap.get(item.student_id) || ' ',
                    teacher_ic: teacherICMap.get(item.teacher_id) || ' ',
                    student_ic: studentICMap.get(item.student_id) || ' ',
                    teacher_gender: teacherGenderMap.get(item.teacher_id) || ' ',
                    student_gender: studentGenderMap.get(item.student_id) || ' ',
                    kelas_name: kelasMap.get(item.kelassession_id) || ' ', 
                    role: item.role,
                }));

                setPeopleKelas(dataWithIds);
                console.log('dataWithIds', dataWithIds);
                setPeopleKelasLoading(false);
            } catch (error) {
                console.error('Error fetching people kelas:', error);
                setPeopleKelasLoading(false);
            }
        };

        fetchPeopleKelas();
        fetchKelasSession();
    }, [kelassessionId]);

    const handleViewTeacher = (teacherId) => {
        window.location.href = `/viewprofileteacher/${teacherId}`;
    };

    const handleViewStudent = (studentId) => {
        window.location.href = `/viewprofilestudent/${studentId}`;
    };

    const handleDeletePeopleSession = async (peoplekelas_id, role, student_name, teacher_name, kelas_name) => {
        console.log('peoplekelas_id: ', peoplekelas_id);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/people-kelas/${peoplekelas_id}/`);
            setPeopleKelas(prevState => prevState.filter(item => item.peoplekelas_id !== peoplekelas_id));
            const name = role === 'PELAJAR' ? student_name : teacher_name;
            alert(`${role} ${name} removed successfully from kelas ${kelas_name}.`);
        } catch (error) {
            console.error('Error deleting people session:', error);
            alert('Failed to remove.');
            console.log('response.data: ', error.response.data);
        }
    };

    const handlePeopleKelasUpdate = async (peoplekelas_id, kelassession_id, role, status) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/people-kelas/${peoplekelas_id}/`, { 
                status,
                kelassession_id: kelassession_id,
                role: role,
             });
            setPeopleKelas(prevState => prevState.map(item => item.peoplekelas_id === peoplekelas_id ? { ...item, status } : item));
            alert('Status updated successfully.');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status.');
        }
    };
    
    const handleSemuaAktifTeacherUpdate = async () => {
        try {
            await Promise.all(filteredTeacherPeopleKelas.map(async (teacher) => {
                await axios.put(`http://127.0.0.1:8000/api/people-kelas/${teacher.id}/`, {
                    status: 'Aktif',
                    kelassession_id: teacher.kelassession_id,
                    role: teacher.role
                });
            }));
            const updatedTeachers = filteredTeacherPeopleKelas.map(teacher => ({
                ...teacher,
                status: 'Aktif'
            }));
            setPeopleKelas(prevState => prevState.map(item => {
                const updatedTeacher = updatedTeachers.find(teacher => teacher.id === item.id);
                return updatedTeacher ? updatedTeacher : item;
            }));
            alert('Semua Aktif successfully updated.');
        } catch (error) {
            console.error('Error updating Semua Aktif:', error);
            alert('Failed to update Semua Aktif.');
        }
    };
    
    const handleSemuaTidakAktifTeacherUpdate = async () => {
        try {
            await Promise.all(filteredTeacherPeopleKelas.map(async (teacher) => {
                await axios.put(`http://127.0.0.1:8000/api/people-kelas/${teacher.id}/`, {
                    status: 'Tidak Aktif',
                    kelassession_id: teacher.kelassession_id,
                    role: teacher.role
                });
            }));
            const updatedTeachers = filteredTeacherPeopleKelas.map(teacher => ({
                ...teacher,
                status: 'Tidak Aktif'
            }));
            setPeopleKelas(prevState => prevState.map(item => {
                const updatedTeacher = updatedTeachers.find(teacher => teacher.id === item.id);
                return updatedTeacher ? updatedTeacher : item;
            }));
            alert('Semua Tidak Aktif successfully updated.');
        } catch (error) {
            console.error('Error updating Semua Tidak Aktif:', error);
            alert('Failed to update Semua Tidak Aktif.');
        }
    };
    
    const handleSemuaAktifStudentUpdate = async () => {
        try {
            await Promise.all(filteredStudentPeopleKelas.map(async (student) => {
                await axios.put(`http://127.0.0.1:8000/api/people-kelas/${student.id}/`, {
                    status: 'Aktif',
                    kelassession_id: student.kelassession_id,
                    role: student.role
                });
            }));
            const updatedStudents = filteredStudentPeopleKelas.map(student => ({
                ...student,
                status: 'Aktif'
            }));
            setPeopleKelas(prevState => prevState.map(item => {
                const updatedStudent = updatedStudents.find(student => student.id === item.id);
                return updatedStudent ? updatedStudent : item;
            }));
            alert('Semua Aktif successfully updated.');
        } catch (error) {
            console.error('Error updating Semua Aktif:', error);
            alert('Failed to update Semua Aktif.');
        }
    };
    
    const handleSemuaTidakAktifStudentUpdate = async () => {
        try {
            await Promise.all(filteredStudentPeopleKelas.map(async (student) => {
                await axios.put(`http://127.0.0.1:8000/api/people-kelas/${student.id}/`, {
                    status: 'Tidak Aktif',
                    kelassession_id: student.kelassession_id,
                    role: student.role
                });
            }));
            const updatedStudents = filteredStudentPeopleKelas.map(student => ({
                ...student,
                status: 'Tidak Aktif'
            }));
            setPeopleKelas(prevState => prevState.map(item => {
                const updatedStudent = updatedStudents.find(student => student.id === item.id);
                return updatedStudent ? updatedStudent : item;
            }));
            alert('Semua Tidak Aktif successfully updated.');
        } catch (error) {
            console.error('Error updating Semua Tidak Aktif:', error);
            alert('Failed to update Semua Tidak Aktif.');
        }
    };
    

    const teachercolumns = [
        { field: 'teacher_full_name', headerName: 'Nama Guru', flex: 1},
        { field: 'teacher_ic', headerName: 'No Kad Pengenalan', flex: 1},
        { field: 'teacher_gender', headerName: 'Jantina', flex: 0.5 },
        { field: 'status', headerName: 'Status', flex: 0.5},
        {
            field: "updatestatus",
            headerName: "Update Status",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center" mt='10px'>
                    {currentUserRole !== 'PARENT' && params.row.status === 'Tidak Aktif' && (
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handlePeopleKelasUpdate(params.row.id, params.row.id_kelassession, params.row.role, 'Aktif')}
                        sx={{ marginRight: 1 }}
                    >
                        Aktif
                    </Button>
                    )}
                    {currentUserRole !== 'PARENT' && params.row.status === 'Aktif' && (
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handlePeopleKelasUpdate(params.row.id, params.row.id_kelassession, params.row.role, 'Tidak Aktif')}
                        sx={{ marginRight: 1 }}
                    >
                        Tidak Aktif
                    </Button>
                    )}
                </Box>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center" mt='10px'>
                {currentUserRole !== 'PARENT' && (
                <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeletePeopleSession(params.row.id, params.row.role, '',params.row.teacher_full_name, params.row.kelas_name)}
                        sx={{ marginRight: 1 }}
                    >
                        Remove
                </Button>

                )}
                {currentUserRole !== 'PARENT' && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewTeacher(params.row.id_teacher)}
                        sx={{ marginRight: 1 }}
                    >
                        View
                    </Button>
                )}
                
              </Box>
            ),
          },
    ];

    const studentcolumns = [
        { field: 'student_full_name', headerName: 'Pelajar', flex: 1},
        { field: 'student_ic', headerName: 'No Kad Pengenalan', flex: 1},
        { field: 'student_gender', headerName: 'Jantina', flex: 0.5 },
        { field: 'status', headerName: 'Status', flex: 0.5},
        {
            field: "updatestatus",
            headerName: "Update Status",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                {currentUserRole !== 'PARENT' && params.row.status === 'Tidak Aktif' && (
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handlePeopleKelasUpdate(params.row.id, params.row.id_kelassession, params.row.role, 'Aktif')}
                        sx={{ marginRight: 1 }}
                    >
                        Aktif
                    </Button>
                )}
                {currentUserRole !== 'PARENT' && params.row.status === 'Aktif' && (
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handlePeopleKelasUpdate(params.row.id, params.row.id_kelassession, params.row.role, 'Tidak Aktif')}
                        sx={{ marginRight: 1 }}
                    >
                        Tidak Aktif
                    </Button>
                )}
                </Box>
                
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                {currentUserRole !== 'PARENT' && (<Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewStudent(params.row.id_student)}
                        sx={{ marginRight: 1 }}
                    >
                        View
                    </Button>
                )}
                {currentUserRole !== 'PARENT' && (
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeletePeopleSession(params.row.id, params.row.role, params.row.student_full_name, '', params.row.kelas_name)}
                        sx={{ marginRight: 1 }}
                    >
                        Remove
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
        ) : kelasSession ? (
        <Box>
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/kelasSession" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        Kelas
                    </Link>
                    <Typography color="text.primary"> Kelas {kelasSession.kelassession_name}</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="10px 0 0 20px"> 
                <Header title="KELAS" />
                <Box boxShadow={15} p="10px" mt="20px">
                <TextField
                        name="kelas_name"
                        label="Nama Kelas"
                        value={kelasSession.kelassession_name}
                        InputProps={{
                            readOnly: true,
                        }}
                        style={{ margin: '10px', width: '25%' }}
                />
                <TextField
                                name="bilangan_guru"
                                label="Bilangan Guru"
                                value={filteredTeacherPeopleKelas.length}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '22%' }}
                            />
                            <TextField
                                name="bilangan_pelajar"
                                label="Bilangan Pelajar"
                                value={filteredStudentPeopleKelas.length}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '22%' }}
                            />
                            <TextField
                                name="bilangan_pelajar_aktif"
                                label="Bilangan Pelajar Aktif"
                                value={filteredStudentPeopleKelasAktif.length}
                                InputProps={{
                                    readOnly: true,
                                }}
                                style={{ margin: '10px', width: '22%' }}
                            />

                </Box>
                <Box p="10px" mt="20px">
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
                            <Tab label="Maklumat Guru" />
                            <Tab label="Senarai Pelajar" />
                        </Tabs>
                </Box>
                
                {tabValue === 0 && (
                    <Box m="10px" color="text.primary" >
                    {/* List Student and Teacher in the PeopleKelas for this kelassessionId */}
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>MAKLUMAT GURU</Typography>
                    {currentUserRole !== 'PARENT' && (
                    <Box boxShadow={15} p="10px" mt="20px">
                        
                        <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleSemuaAktifTeacherUpdate()}
                        sx={{ marginRight: 2 }}
                        > Semua Aktif </Button>
                        <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleSemuaTidakAktifTeacherUpdate()}
                        > Semua Tidak Aktif </Button>
                    </Box>
                    )}
                    <Box
                                m="10px"
                                height="30vh"
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
                                rows={filteredTeacherPeopleKelas} 
                                columns={teachercolumns}
                                getRowId={(row) => row.id}
                            />
                        </Box>
                    </Box>
                )}

                {/* Maklumat Ibu Bapa - 2 column of ibu and bapa*/}
                {tabValue === 1 && (
                    <Box m="10px" color="text.primary" >
                    {/* List Student and Teacher in the PeopleKelas for this kelassessionId */}
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>SENARAI PELAJAR</Typography>
                    {currentUserRole !== 'PARENT' && (
                    <Box boxShadow={15} p="10px" mt="20px">
                        <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleSemuaAktifStudentUpdate()}
                        sx={{ marginRight: 2 }}
                        > Semua Aktif </Button>
                        <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleSemuaTidakAktifStudentUpdate()}
                        > Semua Tidak Aktif </Button>
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
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                    color: `${colors.grey[100]} !important`,
                                },
                                
                                }}
                            >
                            <DataGrid 
                                rows={filteredStudentPeopleKelas} 
                                columns={studentcolumns}
                                getRowId={(row) => row.id}
                                slots={{ toolbar: GridToolbar }}
                            />
                        </Box>
                    </Box>

                    )}
            </Box>
        </Box>
        ) : (
            <Typography>Kelas not found</Typography>
        )}
    </Box>
    
    );
};

export default ViewKelasSession;