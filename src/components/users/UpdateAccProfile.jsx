import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../../components/Header";

const UpdateAccProfile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { userId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ first_name: '', last_name: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [userId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}/`);
            setUser(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Error fetching user data. Please try again later.');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/api/user/${userId}/`, {
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
                email: user.email,
                role: user.role,
                date_joined: user.date_joined,
                password: user.password
            });
            navigate(`/accprofile/${userId}`);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Error updating profile. Please try again later.');
        }
    };

    if (loading) { return <Typography>Loading...</Typography>; }
    if (error) { return <Typography>{error}</Typography>; }

    return (
        <Box m="10px 20px">
            <Box boxShadow={15} p="10px" m="20px">
                <Header title="UPDATE PROFILE" />
                <Box display="flex" justifyContent="center" alignItems="center" style={{ width: '95%', height: '400px' }} boxShadow={10} m="20px">
                    <form onSubmit={handleSubmit}>
                        <Box m="20px">
                        <TextField
                            label="ID"
                            name="id"
                            variant="outlined"
                            value={user.id}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '20px 20px 20px 0', width: '47%' }}
                        />
                        <TextField
                            label="Username"
                            name="username"
                            variant="outlined"
                            value={user.username}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '20px 20px 20px 0', width: '47%' }}
                        />
                        <TextField
                            label="First Name"
                            name="first_name"
                            variant="outlined"
                            value={user.first_name}
                            onChange={handleChange}
                            style={{ margin: '20px 20px 20px 0', width: '47%' }}
                        />
                        <TextField
                            label="Last Name"
                            name="last_name"
                            variant="outlined"
                            value={user.last_name}
                            onChange={handleChange}
                            style={{ margin: '20px 20px 20px 0', width: '47%' }}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            variant="outlined"
                            value={user.email}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '0px 20px 20px 0', width: '47%' }}
                        />
                        <TextField
                            label="Date Joined"
                            name="date_joined"
                            variant="outlined"
                            value={user.date_joined}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '0px 20px 20px 0', width: '47%' }}
                        />
                        <TextField
                            label="Role"
                            name="role"
                            variant="outlined"
                            value={user.role}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '0px 20px 20px 0', width: '47%' }}
                        />
                        </Box>
                        <Box m="20px">
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            type="submit"
                            style={{ margin: '10px' }}
                        >
                            Save Changes
                        </Button>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default UpdateAccProfile;
