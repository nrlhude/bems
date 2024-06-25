// frontend/src/scenes/settings/kspk.jsx
// route path : /settings/kspk

import SettingsWrapper from '../../components/SettingsWrapper';
import React, { useState, useEffect } from 'react';
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SettingKSPK = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // 6 Tabs: Tunjang Utama, Sub Tunjang, Fokus, Standard Kandungan, Standard Pembelajaran, Penerapan Nilai
    // "tunjang-utama": "http://127.0.0.1:8000/api/tunjang-utama/tunjangId",
    // "sub-tunjang": "http://127.0.0.1:8000/api/sub-tunjang/subtunjangId",
    // "fokus": "http://127.0.0.1:8000/api/fokus/fokusId",
    // "std-kandungan": "http://127.0.0.1:8000/api/std-kandungan/stdKandunganId",
    // "std-pembelajaran": "http://127.0.0.1:8000/api/std-pembelajaran/stdPembelajaranId",
    // "penerapan-nilai": "http://127.0.0.1:8000/api/penerapan-nilai/penerapanNilaiId"

    // Tunjang Utama Data
    const [tunjangUtama, setTunjangUtama] = useState([]);

    const columnsTunjangUtama = [
        { field: "tunjang_name", headerName: "Tunjang Utama", flex: 1 },
        { field: "tunjang_code", headerName: "Kod", flex: 0.5 },
        { field: "tunjang_desc", headerName: "Keterangan", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleUpdateTunjangUtama(params.row.tunjang_id)}
                  sx={{ marginRight: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteTunjangUtama(params.row.tunjang_id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
    ];

    const getTunjangUtama = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/tunjang-utama/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.tunjang_id }));
            setTunjangUtama(dataWithIds);
        } catch (error) {
            console.error("Error fetching tunjang utama data:", error);
        }
    };

    const handleUpdateTunjangUtama = (tunjangId) => {
        window.location.href = `/updatetunjangutama/${tunjangId}`;
    };

    const handleDeleteTunjangUtama = async (tunjangId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/tunjang-utama/${tunjangId}/`);
            console.log(response);
            alert(`Tunjang Utama with ID ${tunjangId} deleted successfully.`);
            getTunjangUtama();
        } catch (error) {
            console.error("Error deleting Tunjang Utama:", error);
            alert(`Error deleting tunjang utama with ID ${tunjangId}. Please try again later.`);
        }
    };

    // end of Tunjang Utama Data


    // Subtunjang Data : name, code, desc , tunjang_id
    const [subTunjang, setSubTunjang] = useState([]);

    const getSubTunjang = async () => {
        try {
            const tunjangUtamaResponse = await axios.get('http://127.0.0.1:8000/api/tunjang-utama/');
            const tunjangUtamaMap = new Map(tunjangUtamaResponse.data.map(tunjangUtama => [tunjangUtama.tunjang_id, tunjangUtama.tunjang_name]));
            console.log(tunjangUtamaMap);
            const response = await axios.get('http://127.0.0.1:8000/api/sub-tunjang/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.subtunjang_id, tunjang_name: tunjangUtamaMap.get(item.tunjang_id) || ' ',}));
            setSubTunjang(dataWithIds);
        } catch (error) {
            console.error("Error fetching subtunjang data:", error);
        }
    };

    const handleUpdateSubTunjang = (subtunjangId) => {
        window.location.href = `/updatesubtunjang/${subtunjangId}`;
    };

    const handleDeleteSubTunjang = async (subtunjangId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/sub-tunjang/${subtunjangId}/`);
            console.log(response);
            alert(`Sub Tunjang with ID ${subtunjangId} deleted successfully.`);
            getSubTunjang();
        } catch (error) {
            console.error("Error deleting Sub Tunjang:", error);
            alert(`Error deleting subtunjang with ID ${subtunjangId}. Please try again later.`);
        }
    };

    const columnsSubTunjang = [
        { field: "subtunjang_name", headerName: "Sub Tunjang", flex: 1 },
        { field: "subtunjang_code", headerName: "Kod", flex: 0.5 },
        { field: "subtunjang_desc", headerName: "Keterangan", flex: 0.5 },
        { field: "tunjang_name", headerName: "Tunjang Utama", flex: 1},
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleUpdateSubTunjang(params.row.subtunjang_id)}
                  sx={{ marginRight: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteSubTunjang(params.row.subtunjang_id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
    ];

    // end of Subtunjang Data

    // Fokus Data : fokus_ name, code, desc , subtunjang_id, actions

    const [fokus, setFokus] = useState([]);

    const getFokus = async () => {
        try {
            const subtunjangResponse = await axios.get('http://127.0.0.1:8000/api/sub-tunjang/');
            const subtunjangMap = new Map(subtunjangResponse.data.map(subtunjang => [subtunjang.subtunjang_id, subtunjang.subtunjang_name]));
            console.log(subtunjangMap);
            const response = await axios.get('http://127.0.0.1:8000/api/fokus/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.fokus_id, subtunjang_name: subtunjangMap.get(item.subtunjang_id) || ' ',}));
            setFokus(dataWithIds);
        } catch (error) {
            console.error("Error fetching fokus data:", error);
        }
    };

    const handleUpdateFokus = (fokusId) => {
        window.location.href = `/updatefokus/${fokusId}`;
    };

    const handleDeleteFokus = async (fokusId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/fokus/${fokusId}/`);
            console.log(response);
            alert(`Fokus with ID ${fokusId} deleted successfully.`);
            getFokus();
        } catch (error) {
            console.error("Error deleting Fokus:", error);
            alert(`Error deleting fokus with ID ${fokusId}. Please try again later.`);
        }
    };

    const columnsFokus = [
        { field: "fokus_name", headerName: "Fokus", flex: 1 },
        { field: "fokus_code", headerName: "Kod", flex: 0.5 },
        { field: "fokus_desc", headerName: "Keterangan", flex: 1 },
        { field: "subtunjang_name", headerName: "Subtunjang", flex: 0.5},
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleUpdateFokus(params.row.fokus_id)}
                  sx={{ marginRight: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteFokus(params.row.fokus_id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
    ];

    // end of Fokus Data   

    // StdKandungan Data : std_kandungan_ name, code, desc , fokus_id, actions
    const [stdKandungan, setStdKandungan] = useState([]);

    const getStdKandungan = async () => {
        try {
            const kspkResponse = await axios.get('http://127.0.0.1:8000/api/fokus/');
            const kspkMap = new Map(kspkResponse.data.map(kspk => [kspk.fokus_id, kspk.fokus_code]));
            console.log(kspkMap);
            const response = await axios.get('http://127.0.0.1:8000/api/std-kandungan/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.std_kandungan_id, fokus_code: kspkMap.get(item.fokus_id) || ' ', }));
            setStdKandungan(dataWithIds);
        } catch (error) {
            console.error("Error fetching std kandungan data:", error);
        }
    };

    const handleUpdateStdKandungan = (stdKandunganId) => {
        window.location.href = `/updatestdkandungan/${stdKandunganId}`;
    };

    const handleDeleteStdKandungan = async (stdKandunganId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/std-kandungan/${stdKandunganId}/`);
            console.log(response);
            alert(`Standard Kandungan with ID ${stdKandunganId} deleted successfully.`);    
            getStdKandungan();
        } catch (error) {
            console.error("Error deleting Standard Kandungan:", error);
            alert(`Error deleting standard kandungan with ID ${stdKandunganId}. Please try again later.`);
        }
    };

    const columnsStdKandungan = [
        { field: "std_kandungan_name", headerName: "Standard Kandungan", flex: 1 },
        { field: "std_kandungan_code", headerName: "Kod", flex: 0.5 },
        { field: "std_kandungan_desc", headerName: "Keterangan", flex: 1 },
        { field: "fokus_code", headerName: "Fokus", flex: 0.5},
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">

                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleUpdateStdKandungan(params.row.std_kandungan_id)}
                  sx={{ marginRight: 1 }}
                >
                  Update
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                  onClick={() => handleDeleteStdKandungan(params.row.std_kandungan_id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
    ];

    // end of StdKandungan Data

    // StdPembelajaran Data : std_pembelajaran_ name, code, desc , stdkandungan_id, actions "http://127.0.0.1:8000/api/std-pembelajaran/"
    const [stdPembelajaran, setStdPembelajaran] = useState([]);

    const getStdPembelajaran = async () => {
        try {
            const kspkResponse = await axios.get('http://127.0.0.1:8000/api/std-kandungan/');
            const kspkMap = new Map(kspkResponse.data.map(kspk => [kspk.std_kandungan_id, kspk.std_kandungan_code]));
            console.log(kspkMap);
            const response = await axios.get('http://127.0.0.1:8000/api/std-pembelajaran/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.std_pembelajaran_id, std_kandungan_code: kspkMap.get(item.std_kandungan_id) || ' ', }));
            setStdPembelajaran(dataWithIds);
        } catch (error) {
            console.error("Error fetching std pembelajaran data:", error);
        }
    };

    const handleUpdateStdPembelajaran = (stdPembelajaranId) => {
        window.location.href = `/updatestdpembelajaran/${stdPembelajaranId}`;
    };

    const handleDeleteStdPembelajaran = async (stdPembelajaranId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/std-pembelajaran/${stdPembelajaranId}/`);
            console.log(response);
            alert(`Standard Pembelajaran with ID ${stdPembelajaranId} deleted successfully.`);
            getStdPembelajaran();
        } catch (error) {
            console.error("Error deleting Standard Pembelajaran:", error);
            alert(`Error deleting standard pembelajaran with ID ${stdPembelajaranId}. Please try again later.`);
        }
    };

    const columnsStdPembelajaran = [
        { field: "std_pembelajaran_name", headerName: "Standard Pembelajaran", flex: 1 },
        { field: "std_pembelajaran_code", headerName: "Kod", flex: 0.5 },
        { field: "std_pembelajaran_desc", headerName: "Keterangan", flex: 1 },
        { field: "std_kandungan_code", headerName: "Standard Kandungan", flex: 0.5},
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleUpdateStdPembelajaran(params.row.std_pembelajaran_id)}
                  sx={{ marginRight: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteStdPembelajaran(params.row.std_pembelajaran_id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
    ];

    // end of StdPembelajaran Data

    // StdPrestasiKriteria Data : StdPrestasiCriteria --> cri_id, cri_code, cri_desc, subtunjang_id, actions http://127.0.0.1:8000/api/stdprestasicriteria/

    const [stdPrestasiKriteria, setStdPrestasiCriteria] = useState([]);
    
    const getStdPrestasiCriteria = async () => {
        try {
            const subtunjangResponse = await axios.get('http://127.0.0.1:8000/api/sub-tunjang/');
            const subtunjangMap = new Map(subtunjangResponse.data.map(subtunjang => [subtunjang.subtunjang_id, subtunjang.subtunjang_name]));
            console.log(subtunjangMap);
            const response = await axios.get('http://127.0.0.1:8000/api/stdprestasicriteria/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.cri_id, subtunjang_name: subtunjangMap.get(item.subtunjang_id) || ' ', }));
            setStdPrestasiCriteria(dataWithIds);
        } catch (error) {
            console.error("Error fetching std prestasi criteria data:", error);
        }
    };

    const handleUpdateStdPrestasiCriteria = (criId) => {
        window.location.href = `/updatestdprestasicriteria/${criId}`;
    };

    const handleDeleteStdPrestasiCriteria = async (criId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/stdprestasicriteria/${criId}/`);
            console.log(response);
            alert(`Standard Prestasi Criteria with ID ${criId} deleted successfully.`);
            getStdPrestasiCriteria();
        } catch (error) {
            console.error("Error deleting Standard Prestasi Criteria:", error);
            alert(`Error deleting standard prestasi criteria with ID ${criId}. Please try again later.`);
        }
    };

    const columnsStdPrestasiKriteria = [
        { field: "cri_code", headerName: "Kod", flex: 0.5 },
        { field: "cri_desc", headerName: "Keterangan", flex: 2 },
        { field: "subtunjang_name", headerName: "Sub Tunjang", flex: 1},
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">

                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleUpdateStdPrestasiCriteria(params.row.cri_id)}
                  sx={{ marginRight: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteStdPrestasiCriteria(params.row.cri_id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
    ];

    // StdPrestasiKategori Data : StdPrestasiLevel --> level_id, level_score, level_desc, cri_id, actions http://127.0.0.1:8000/api/stdprestasilevel/

    const [stdPrestasiLevel, setStdPrestasiLevel] = useState([]);

    const getStdPrestasiLevel = async () => {
        try {
            const criResponse = await axios.get('http://127.0.0.1:8000/api/stdprestasicriteria/');
            const criMap = new Map(criResponse.data.map(cri => [cri.cri_id, cri.cri_code]));
            console.log(criMap);
            const response = await axios.get('http://127.0.0.1:8000/api/stdprestasilevel/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.level_id, cri_code: criMap.get(item.cri_id) || ' ', }));
            setStdPrestasiLevel(dataWithIds);
        } catch (error) {
            console.error("Error fetching std prestasi level data:", error);
        }
    };

    const handleUpdateStdPrestasiLevel = (levelId) => {
        window.location.href = `/updatestdprestasilevel/${levelId}`;
    };

    const handleDeleteStdPrestasiLevel = async (levelId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/stdprestasilevel/${levelId}/`);
            console.log(response);
            alert(`Standard Prestasi Level with ID ${levelId} deleted successfully.`);
            getStdPrestasiLevel();
        } catch (error) {
            console.error("Error deleting Standard Prestasi Level:", error);
            alert(`Error deleting standard prestasi level with ID ${levelId}. Please try again later.`);
        }
    };

    const columnsStdPrestasiLevel = [
        { field: "level_score", headerName: "Tahap Penguasaan", flex: 0.5 },
        { field: "level_desc", headerName: "Keterangan", flex: 2 },
        { field: "cri_code", headerName: "Kod", flex: 0.5},
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleUpdateStdPrestasiLevel(params.row.level_id)}
                  sx={{ marginRight: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeleteStdPrestasiLevel(params.row.level_id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
    ];

    // Sort model configuration for default sorting
    const sortModelStdPrestasi = [
        {
            field: 'cri_code', // Field to sort by
            sort: 'asc',      // 'asc' for ascending, 'desc' for descending
        },
    ];

    // PenerapanNilai Data : penerapan_nilai_ name, desc , actions "http://127.0.0.1:8000/api/penerapan-nilai/"
    
    const [penerapanNilai, setPenerapanNilai] = useState([]);

    const getPenerapanNilai = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/penerapan-nilai/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.penerapan_nilai_id }));
            setPenerapanNilai(dataWithIds);
        } catch (error) {
            console.error("Error fetching penerapan nilai data:", error);
        }
    };

    const handleUpdatePenerapanNilai = (penerapanNilaiId) => {
        window.location.href = `/updatepenerapannilai/${penerapanNilaiId}`;
    };

    const handleDeletePenerapanNilai = async (penerapanNilaiId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/penerapan-nilai/${penerapanNilaiId}/`);
            console.log(response);
            alert(`Penerapan Nilai with ID ${penerapanNilaiId} deleted successfully.`);
            getPenerapanNilai();
        } catch (error) {
            console.error("Error deleting Penerapan Nilai:", error);
            alert(`Error deleting penerapan nilai with ID ${penerapanNilaiId}. Please try again later.`);
        }
    };  

    const columnsPenerapanNilai = [
        { field: "penerapan_nilai_name", headerName: "Penerapan Nilai", flex: 1 },
        { field: "penerapan_nilai_desc", headerName: "Keterangan", flex: 1 },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" alignItems="center">
                
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => handleUpdatePenerapanNilai(params.row.penerapan_nilai_id)}
                  sx={{ marginRight: 1 }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => handleDeletePenerapanNilai(params.row.penerapan_nilai_id)}
                >
                  Delete
                </Button>
              </Box>
            ),
          },
    ];

    // end of PenerapanNilai Data

    useEffect(() => {
        getTunjangUtama();
        getSubTunjang();
        getFokus();
        getStdKandungan();
        getStdPembelajaran();
        getPenerapanNilai();
        getStdPrestasiCriteria();
        getStdPrestasiLevel();

    }, []);

    // Tab Value
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box m="10px">
            <SettingsWrapper>
                <Typography variant="h4" color={colors.greenAccent[400]} gutterBottom>
                    KSPK
                </Typography>

                <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
                    <Tab label="Tunjang Utama" />
                    <Tab label="Sub Tunjang" />
                    <Tab label="Fokus" />
                    <Tab label="Standard Kandungan" />
                    <Tab label="Standard Pembelajaran" />
                    <Tab label="Standard Prestasi Kriteria" />
                    <Tab label="Standard Prestasi Tahap Penguasaan" />
                    <Tab label="Penerapan Nilai" />
                </Tabs>

                {/* Tunjang Utama Tab start */}
                {tabValue === 0 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Tunjang Utama</Typography>
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createtunjangutama">

                                <Button
                                    sx={{
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "10px 15px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <AddOutlinedIcon sx={{ mr: "10px" }} />
                                    Add New
                                </Button>
                            </Link>
                            {/* Add New end */}
                            
                    </Box>                    
                    <Box
                        m="5px 0 0 0"
                        height="70vh"
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
                            
                            rows={tunjangUtama}
                            columns={columnsTunjangUtama}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                            disableColumnResize={false}
                        />
                        {/* checkboxSelection */}
                    </Box>
                     
                </Box>
                )}
                {/* Tunjang Utama Tab ends */}

                {/* Sub Tunjang Tab start */}
                {tabValue === 1 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Sub Tunjang</Typography>
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createsubtunjang">

                                <Button
                                    sx={{
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "10px 15px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <AddOutlinedIcon sx={{ mr: "10px" }} />
                                    Add New
                                </Button>
                            </Link>
                            {/* Add New end */}
                            
                    </Box>                    
                    <Box
                        m="5px 0 0 0"
                        height="70vh"
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
                            
                            rows={subTunjang}
                            columns={columnsSubTunjang}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                            disableColumnResize={false}
                        />
                        {/* checkboxSelection */}
                    </Box>
                </Box>
                )}
                {/* Sub Tunjang Tab ends */}

                {/* Fokus Tab start */}
                {tabValue === 2 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Fokus</Typography>
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createfokus">

                                <Button
                                    sx={{
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "10px 15px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <AddOutlinedIcon sx={{ mr: "10px" }} />
                                    Add New
                                </Button>
                            </Link>
                            {/* Add New end */}
                            
                    </Box>                    
                    <Box
                        m="5px 0 0 0"
                        height="70vh"
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
                            
                            rows={fokus}
                            columns={columnsFokus}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                            disableColumnResize={false}
                        />
                        {/* checkboxSelection */}
                    </Box>
                </Box>
                )}
                {/* Fokus Tab ends */}

                {/* Standard Kandungan Tab start */}
                {tabValue === 3 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Standard Kandungan</Typography>
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createstdkandungan">

                                <Button
                                    sx={{
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "10px 15px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <AddOutlinedIcon sx={{ mr: "10px" }} />
                                    Add New
                                </Button>
                            </Link>
                            {/* Add New end */}
                            
                    </Box>                    
                    <Box
                        m="5px 0 0 0"
                        height="70vh"
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
                            
                            rows={stdKandungan}
                            columns={columnsStdKandungan}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                            disableColumnResize={false}
                        />
                        {/* checkboxSelection */}
                    </Box>
                </Box>
                )}
                {/* Standard Kandungan Tab ends */}

                {/* Standard Pembelajaran Tab start */}
                {tabValue === 4 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Standard Pembelajaran</Typography>
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createstdpembelajaran">

                                <Button
                                    sx={{
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "10px 15px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <AddOutlinedIcon sx={{ mr: "10px" }} />
                                    Add New
                                </Button>
                            </Link>
                            {/* Add New end */}
                            
                    </Box>                    
                    <Box
                        m="5px 0 0 0"
                        height="70vh"
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
                            
                            rows={stdPembelajaran}
                            columns={columnsStdPembelajaran}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                            disableColumnResize={false}
                        />
                        {/* checkboxSelection */}
                    </Box>
                </Box>
                )}

                {/* Standard Pembelajaran Tab ends */}


                {tabValue === 5 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Standard Prestasi Kriteria
                    </Typography>
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createstdprestasicriteria">

                                <Button
                                    sx={{
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "10px 15px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <AddOutlinedIcon sx={{ mr: "10px" }} />
                                    Add New
                                </Button>
                            </Link>
                            {/* Add New end */}
                            
                    </Box>                    
                    <Box
                        m="5px 0 0 0"
                        height="70vh"
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
                            
                            rows={stdPrestasiKriteria}
                            columns={columnsStdPrestasiKriteria}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                            // sortModel={sortModelStdPrestasi}
                            disableColumnResize={false}
                        />
                        {/* checkboxSelection */}
                    </Box>
                </Box>
                )}

                {tabValue === 6 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Standard Prestasi Tahap Penguasaan
                    </Typography>
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createstdprestasilevel">

                                <Button
                                    sx={{
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "10px 15px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <AddOutlinedIcon sx={{ mr: "10px" }} />
                                    Add New
                                </Button>
                            </Link>
                            {/* Add New end */}
                            
                    </Box>                    
                    <Box
                        m="5px 0 0 0"
                        height="70vh"
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
                            
                            rows={stdPrestasiLevel}
                            columns={columnsStdPrestasiLevel}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                            // sortModel={sortModelStdPrestasi}
                            disableColumnResize={false}
                        />
                        {/* checkboxSelection */}
                    </Box>
                </Box>
                )}

                {/* Penerapan Nilai Tab start */}
                {tabValue === 7 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Penerapan Nilai
                    </Typography>
                    <Box m="10px 0 0 0">
                            {/* Add New Button start */}
                                <Link to="/createpenerapannilai">

                                <Button
                                    sx={{
                                        backgroundColor: colors.blueAccent[700],
                                        color: colors.grey[100],
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        padding: "10px 15px",
                                        marginBottom: "5px",
                                    }}
                                >
                                    <AddOutlinedIcon sx={{ mr: "10px" }} />
                                    Add New
                                </Button>
                            </Link>
                            {/* Add New end */}
                            
                    </Box>                    
                    <Box
                        m="5px 0 0 0"
                        height="70vh"
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
                            
                            rows={penerapanNilai}
                            columns={columnsPenerapanNilai}
                            getRowId={(row) => row.id}
                            slots={{ toolbar: GridToolbar }}
                            disableColumnResize={false}
                        />
                        {/* checkboxSelection */}
                    </Box>
                </Box>
                )}
                {/* Penerapan Nilai Tab ends */}
            </SettingsWrapper>
        </Box>
        
    );
};

export default SettingKSPK;
