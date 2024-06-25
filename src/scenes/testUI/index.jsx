import { Box, Button, Tab, Tabs, Typography , useMediaQuery} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import * as React from 'react';
import { Link } from 'react-router-dom';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

const TestUI = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
        { field: "age", headerName: "Age", type: "number", headerAlign: "left", align: "left", resizable: false },
        { field: "phone", headerName: "Phone Number", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
    ];

    const [tabValue, setTabValue] = React.useState(0);

    const [selectedRows, setSelectedRows] = React.useState([]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDeleteClick = () => {
        // Implement deletion logic here for selected rows
        console.log("Delete clicked for selected rows:", selectedRows);
    };

    const handleUpdateProgrammeClick = () => {
      // Implement update programme logic here for selected rows
      console.log("Update Programme for selected rows:", selectedRows);
  };


    return (
        <Box m="10px">
          {/* start Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header title="TEST UI" subtitle="Test UI" />
        </Box>
        {/* end Header */}
            <Box m="10px 0 0 0">
              {/* Add New Button start */}
                <Link to="/create">

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
              {/* Import start */}
                <Button
                    sx={{
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "10px 15px",
                        marginBottom: "5px",
                        marginLeft: "10px",
                        border: "1px solid grey",
                    }}
                >
                    <UploadOutlinedIcon sx={{ mr: "10px" }} />
                    Import
                </Button>
              {/* Import end */}
              {/* (incomplete) Button Update Details (appear selected only 1 entry), Update Programme (appear selected 1 or more entries), Delete (appear selected 1 or more entries, icon DeleteOutlineOutlined)*/}

              {/* Delete Button */}
                <Button
                    sx={{
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "10px 15px",
                        marginBottom: "5px",
                        border: "1px solid red",
                        marginLeft: "10px",
                    }}
                    startIcon={<DeleteOutlineOutlinedIcon />}
                    onClick={handleDeleteClick}
                >
                    Delete
                </Button>

              {/* Update Details Button */}
              <Button
                  sx={{
                      backgroundColor: colors.grey[900],
                      color: colors.grey[100],
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "10px 15px",
                      marginBottom: "5px",
                      border: "1px solid blue",
                      marginLeft: "10px",
                  }}
              >
                  Update Details
              </Button>

              {/* Update Programme Button */}
              <Button
                  sx={{
                      backgroundColor: colors.grey[900],
                      color: colors.grey[100],
                      fontSize: "12px",
                      fontWeight: "bold",
                      padding: "10px 15px",
                      marginBottom: "5px",
                      border: "1px solid blue",
                      marginLeft: "10px",
                  }}
              >
                  Update Programme
              </Button>
            </Box>
            <Box m="10px 0 0 0">
              {/* View Profile Student */}
              <Link to="/viewprofilestudent">
                <Button
                    sx={{
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "10px 15px",
                        marginBottom: "5px",
                        border: "1px solid blue",
                        marginLeft: "10px",
                    }}
                > View Profile Student
                </Button>
              </Link>
                
            {/* View Profile Teacher */}
            <Link to="/viewprofileteacher">
                <Button
                    sx={{
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "10px 15px",
                        marginBottom: "5px",
                        border: "1px solid blue",
                        marginLeft: "10px",
                    }}
                > View Profile Teacher
                </Button>
            </Link>
            {/* View Profile Parent */}
            <Link to="/viewprofileparent">
                <Button
                    sx={{
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "10px 15px",
                        marginBottom: "5px",
                        border: "1px solid blue",
                        marginLeft: "10px",
                    }}
                > View Profile Parent
                </Button>
            </Link>
            {/* View RPH */}
            <Link to="/viewrph">
                <Button
                    sx={{
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "10px 15px",
                        marginBottom: "5px",
                        border: "1px solid blue",
                        marginLeft: "10px",
                    }}
                > View RPH
                </Button>
            </Link>
            {/* View Class Report */}
            <Link to="/viewclassreport">
                <Button
                    sx={{
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "10px 15px",
                        marginBottom: "5px",
                        border: "1px solid blue",
                        marginLeft: "10px",
                    }}
                > View Class Report
                </Button>
            </Link>
            {/* View Student Report */}
            <Link to="/viewstudentreport">
                <Button
                    sx={{
                        backgroundColor: colors.grey[900],
                        color: colors.grey[100],
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "10px 15px",
                        marginBottom: "5px",
                        border: "1px solid blue",
                        marginLeft: "10px",
                    }}
                > View Student Report
                </Button>
            </Link>
            </Box>
            
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="Tabs">
              <Tab label="All" />
              <Tab label="View Timetable" />
            </Tabs>

            {tabValue === 0 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>All Tab Content</Typography>                    
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
                            checkboxSelection
                            rows={mockDataTeam}
                            columns={columns}
                            slots={{ toolbar: GridToolbar }}
                        />
                    </Box>
                </Box>
            )}

            {tabValue === 1 && (
                <Box boxShadow={15} p="10px">
                    <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>Timetable</Typography>
                    {/* Content for Mine Tab */}
                </Box>
            )}
        </Box>
    );
};

export default TestUI;
