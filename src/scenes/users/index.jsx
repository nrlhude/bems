// frontend/src/scenes/users/index.jsx

import React, { useState, useEffect } from 'react';
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Users = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const maskPassword = (password) => {
        return '*'.repeat(password.length);
    };

    const columnsUser = [
        { field: "id", headerName: "ID", flex: 0.5 },
        { field: "username", headerName: "Username", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { 
            field: "password", 
            headerName: "Password", 
            flex: 1,
            renderCell: (params) => maskPassword(params.value) // Mask the password
        },
        { field: "role", headerName: "Role", flex: 1 },
        { 
            field: "last_login", 
            headerName: "Last Login", 
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleString() // Format the date
        },
        { 
            field: "date_joined", 
            headerName: "Date Joined", 
            flex: 1,
            renderCell: (params) => new Date(params.value).toLocaleDateString() // Format the date
        },
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
                        onClick={() => handleUpdateUser(params.row.id)}
                        sx={{ marginRight: 1 }}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteUser(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/user/');
            const dataWithIds = response.data.map((item) => ({ ...item, id: item.id }));
            setUsers(dataWithIds);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const handleUpdateUser = (userId) => {
        window.location.href = `/updateuser/${userId}`;
    }

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/user/${userId}`);
            console.log(`User with ID ${userId} deleted successfully.`);
            alert(`User with ID ${userId} deleted successfully.`);
            getUsers();
        } catch (error) {
            console.error(`Error deleting user with ID ${userId}:`, error);
            alert(`Error deleting user with ID ${userId}. Please try again later.`);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <Box m="10px">
            <Header 
                title="USERS" 
                subtitle="List of all users" 
            /> 
            <Box m="10px 0 0 0">
                <Link to="/register-user">
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
            </Box>
            <Box
                m="10px 0 0 0"
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
                    rows={users} 
                    columns={columnsUser}
                    getRowId={(row) => row.id}
                    slots={{ toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default Users;
