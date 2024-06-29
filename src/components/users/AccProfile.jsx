import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from 'react-router-dom';
import Header from "../../components/Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';

const AccProfile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [loading, setLoading] = useState(true);
    const {userId} = useParams();
    const [user, setUser] = useState({});
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        fetchData();
      }, [userId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://127.0.0.1:8000/api/user/${userId}/`);
            setUser(response.data);
            // Convert binary data to base64 string
            if (response.data.user_profile_image) {
                setProfileImage(`data:image/jpeg;base64,${response.data.user_profile_image}`);
            }

            console.log('user in accprofile', user);
            setLoading(false);
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      };

      console.log('user in accprofile', user);


    return (
                    <Box m="10px 20px">
                    <Box boxShadow={15} p="10px" m="20px" >
                        <Header title="PROFILE SETTING" />
                        <Box display="flex" justifyContent="center" alignItems="center" style={{ width: '95%', height: '400px' }} boxShadow={10} ml="20px">
                        {/* <Box>
                            {profileImage ? (
                                <img
                                    alt="Profile"
                                    src={profileImage}
                                    width="300px"
                                    height="300px"
                                    style={{ cursor: 'pointer', borderRadius: '50%', border: '1px solid black' , margin: '20px'}}
                                />
                            ) : (
                                <Typography>No Profile Image</Typography>
                            )}
                        </Box> */}
                        <Box>
                        <TextField label="ID" variant="outlined"
                            value={user.id} InputProps={{ readOnly: true, }}
                            style={{ margin: '20px 20px 20px 0', width: '47%'}} />
                        <TextField label="Username" variant="outlined"
                            value={user.username} InputProps={{ readOnly: true, }}
                            style={{ margin: '20px 20px 20px 0', width: '47%'}} />
                        <TextField label="Name" variant="outlined"
                            value={user.first_name + ' ' + user.last_name} InputProps={{ readOnly: true, }}
                            style={{ margin: '0px 20px 20px 0', width: '47%'}} />
                        <TextField label="Email" variant="outlined"
                            value={user.email} InputProps={{ readOnly: true, }}
                            style={{ margin: '0px 20px 20px 0', width: '47%'}} />
                        <TextField label="Role" variant="outlined"
                            value={user.role} InputProps={{ readOnly: true, }}
                            style={{ margin: '0px 20px 20px 0', width: '47%'}} />
                        <TextField label="Date Joined" variant="outlined"
                            value={user.date_joined} InputProps={{ readOnly: true, }}
                            style={{ margin: '0px 20px 20px 0', width: '47%'}} />

                        </Box>
                    </Box>
                            {/* Update Button */}
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                sx={{ marginRight: 1 }}
                                component={RouterLink}
                                to={`/updateaccprofile/${user.id}`}
                                style={{ margin: '30px'}}
                            >
                                Update Profile
                            </Button>
                    
                    </Box>
                    </Box>
                    
    );

}

export default AccProfile;

