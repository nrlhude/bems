import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography} from "@mui/material";
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from "../Header";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const UpdateClassReport = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { classreportID } = useParams();
    const navigate = useNavigate();

    const [classReportDetails, setClassReportDetails] = useState({
        tarikh: '',
        masa: '',
        kehadiran_murid: '',
        kelas: '',
        tajuk: '',
        tema: '',
        ulasan_keseluruhan: '',
        cadangan_penambahbaikan: '',
        dilaporkan_oleh: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [kelasEnrolment, setKelasEnrolment] = useState([]);

    useEffect(() => {
        const fetchClassReportDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/report-class/${classreportID}/`);
                setClassReportDetails(response.data);
            } catch (error) {
                setError('Error fetching Class Report details.');
                console.error('Error fetching Class Report details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchKelas = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/kelas-session/');
                setKelasEnrolment(response.data);
            } catch (error) {
                console.error('Error fetching kelas data:', error);
            }
        };

        fetchKelas();
        fetchClassReportDetails();
    }, [classreportID]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClassReportDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/report-class/${classreportID}/`, classReportDetails);
            alert('Class Report updated successfully.');
            navigate('/reportClass');
        } catch (error) {
            console.error('Error updating Class Report:', error);
            alert('Error updating Class Report. Please try again later.');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box m="10px">
            <Box m="10px 0 10px 20px">
                <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/reportClass" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Laporan Kelas
                </Link>
                <Typography color="text.primary">Tambah Laporan Kelas</Typography>
                </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="TAMBAH LAPORAN KELAS" subtitle="" />
                
                <Box boxShadow={10} p="10px" mt="20px">
                <TextField
                        label="Tarikh"
                        name="tarikh"
                        value={classReportDetails.tarikh}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        label="Masa"
                        name="masa"
                        value={classReportDetails.masa}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        label="Kehadiran Murid"
                        name="kehadiran_murid"
                        value={classReportDetails.kehadiran_murid}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                    />
                    <TextField
                        label="Kelas"
                        name="kelas" 
                        value={classReportDetails.kelas}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '23%' }}
                        select
                        SelectProps={{ native: true }}
                    >
                        <option value="">Kelas</option>
                        {kelasEnrolment.map(kelas => (
                            <option key={kelas.kelassession_id} value={kelas.kelassession_name}>{kelas.kelassession_name}</option>
                            ))}
                    </TextField>
                    <TextField
                        label="Tajuk"
                        name="tajuk"
                        value={classReportDetails.tajuk}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    <TextField
                        label="Tema"
                        name="tema"
                        value={classReportDetails.tema}
                        onChange={handleChange}
                        style={{ margin: '10px', width: '47.5%' }}
                    />
                    <TextField
                        label="Ulasan Keseluruhan"
                        name="ulasan_keseluruhan"
                        value={classReportDetails.ulasan_keseluruhan}
                        onChange={handleChange}
                        style={{ margin: '10px' , width: '97%' }}
                    />
                    <TextField
                        label="Cadangan Penambahbaikan"
                        name="cadangan_penambahbaikan"
                        value={classReportDetails.cadangan_penambahbaikan}
                        onChange={handleChange}
                        style={{ margin: '10px' , width: '97%' }}
                    />
                    <TextField
                        label="Dilaporkan oleh"
                        name="dilaporkan_oleh"
                        value={classReportDetails.dilaporkan_oleh}
                        onChange={handleChange}
                        style={{ margin: '10px' , width: '97%' }}
                    />
                </Box>

                <Box display="flex" justifyContent="center" mt="20px">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdate}
                        sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "14px", fontWeight: "bold", padding: "10px 20px" }}
                    >
                        Kemaskini Laporan Kelas
                    </Button>
                </Box>
            </Box>

        </Box>

    );
};

export default UpdateClassReport;