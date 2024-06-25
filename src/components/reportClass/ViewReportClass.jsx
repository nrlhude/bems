import Header from "../Header";
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const ViewClassReport = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { classreportID } = useParams();
    const [classReportDetails, setClassReportDetails] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassReportDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/report-class/${classreportID}/`);
                setClassReportDetails(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching Class Report details.');
                console.error('Error fetching Class Report details:', error);
            } 
        };
        fetchClassReportDetails();
    }, [classreportID]);

    return (
        <Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : classReportDetails ? (
            <Box>
            <Box m="10px 0 0 20px">
            <Breadcrumbs aria-label="breadcrumb">
            <Link component={RouterLink} to="/reportClass" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Laporan Kelas
            </Link>
            <Typography color="text.primary">Butiran Laporan Kelas</Typography>
            </Breadcrumbs>
            </Box>

            <Box m="0 0 0 20px">
                <Header title="BUTIRAN LAPORAN KELAS" subtitle="" />

                <Box boxShadow={10} p="10px" mt="20px">
                <TextField
                        label="Tarikh"
                        value={classReportDetails.tarikh}
                        style={{ margin: '10px', width: '23%' }}
                        InputProps={{ readOnly: true,}}
                        
                    />
                    <TextField
                        label="Masa"
                        value={classReportDetails.masa}
                        style={{ margin: '10px', width: '23%' }}
                        InputProps={{ readOnly: true,}}
                    />
                    <TextField
                        label="Kehadiran Murid"
                        value={classReportDetails.kehadiran_murid}
                        style={{ margin: '10px', width: '23%' }}
                        InputProps={{ readOnly: true,}}
                    />
                    <TextField
                        label="Kelas"
                        value={classReportDetails.kelas}
                        style={{ margin: '10px', width: '23%' }}
                        InputProps={{ readOnly: true,}}
                    />
                    <TextField
                        label="Tajuk"
                        value={classReportDetails.tajuk}
                        style={{ margin: '10px', width: '47.5%' }}
                        InputProps={{ readOnly: true,}}
                    />
                    <TextField
                        label="Tema"
                        value={classReportDetails.tema}
                        style={{ margin: '10px', width: '47.5%' }}
                        InputProps={{ readOnly: true,}}
                    />
                    <TextField
                        label="Ulasan Keseluruhan"
                        value={classReportDetails.ulasan_keseluruhan}
                        style={{ margin: '10px' , width: '97%' }}
                        InputProps={{ readOnly: true,}}
                    />
                    <TextField
                        label="Cadangan Penambahbaikan"
                        value={classReportDetails.cadangan_penambahbaikan}
                        style={{ margin: '10px' , width: '97%' }}
                        InputProps={{ readOnly: true,}}
                    />
                    <TextField
                        label="Dilaporkan oleh"
                        value={classReportDetails.dilaporkan_oleh}
                        style={{ margin: '10px' , width: '97%' }}
                        InputProps={{ readOnly: true,}}
                    />
                </Box>
            </Box>
            </Box>
            ) : (
                <Typography>Class Report not found</Typography>
            )}
        </Box>
    );
};

export default ViewClassReport;