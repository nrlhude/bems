import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import axios from 'axios';
import { Formik } from 'formik';
import * as yup from 'yup';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const LoginUser = ({ setLoggedIn, setUserRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://localhost:8000/api/token/', {
                email: values.email,
                password: values.password,
            }); 
            // localstorage : token, access_token, refresh_token, email, role, id, first_name, last_name               
                const { access, refresh } = response.data;
                localStorage.setItem('token', access); // Store token in localStorage
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('email', values.email);

            setLoggedIn(true);
        
            // Decode JWT token to get user role
            const tokenPayload = parseJwt(access);
            setUserRole(tokenPayload.role); // Set user role in state
            localStorage.setItem('role', tokenPayload.role); // Store user role in localStorage
                localStorage.setItem('user_id', tokenPayload.id);
                localStorage.setItem('first_name', tokenPayload.first_name);
                localStorage.setItem('last_name', tokenPayload.last_name);
                const currentYear = new Date().getFullYear().toString();
                localStorage.setItem('currentYear', currentYear);

                const sessionresponse = await axios.get('http://127.0.0.1:8000/api/school-sessions/');
                const currentSession = sessionresponse.data.find(session => session.session_name === currentYear);
                if (currentSession) {
                    localStorage.setItem('schoolsessionID', currentSession.session_id);
                    localStorage.setItem('schoolsessionName', currentSession.session_name);
                }

                console.log('Token Payload:', tokenPayload);
                console.log('localStorage:', localStorage);
                console.log('Role:', tokenPayload.role);
                console.log('loggedIn:', setLoggedIn);

            alert('Login successful.\nWelcome ' + tokenPayload.username + '\nRole: ' + tokenPayload.role + '\nCurrent School Session: ' + currentYear);

                // Redirect to dashboard based on user role
                if (tokenPayload.role === 'ADMIN') {
                    localStorage.removeItem('teacherId');
                    localStorage.removeItem('parentId');
                    navigate('/');
                }
                else if (tokenPayload.role === 'TEACHER') {
                    const tcRes = await axios.get('http://127.0.0.1:8000/api/teacherprofile/');
                    const findteacherprofile = tcRes.data.find((teacherprofile) => teacherprofile.user === parseInt(tokenPayload.id));
                    localStorage.setItem('teacherId', findteacherprofile.id);
                    localStorage.removeItem('parentId');
                    navigate('/');
                }
                else if (tokenPayload.role === 'PARENT') {
                    const prtRes = await axios.get('http://127.0.0.1:8000/api/parentprofile/');
                    const findparentprofile = prtRes.data.find((parentprofile) => parentprofile.user === parseInt(tokenPayload.id));
                    localStorage.setItem('parentId', findparentprofile.id);
                    localStorage.removeItem('teacherId');
                    navigate('/');
                }
                else {
                    alert('Invalid role');
                    navigate('/');
                }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data) {
                alert('Login error: ' + error.response.data.detail);
            }
          // Handle login error
        }
      };

      // Function to parse JWT token
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return {};
        }
    };

    const itemData = [
        { img: '../../assets/1.jpg' },
        { img: '../../assets/2.jpg' },
        { img: '../../assets/3.jpg' },
        { img: '../../assets/5.jpg' },
        { img: '../../assets/6.jpg' },
        { img: '../../assets/7.jpg' },
        { img: '../../assets/8.jpg' },
        { img: '../../assets/9.jpg' },
        { img: '../../assets/10.jpg' },
        { img: '../../assets/4.jpg' },
        { img: '../../assets/13.jpg' },
        { img: '../../assets/14.jpg' },
    ];

    return (
        <Box>
        <Box boxShadow={15} p="10px" m="80px 20px" display="flex" height="75vh">
        <Box boxShadow={10} p="10px" m="20px" width="50%">
        <ImageList sx={{ width: '100%', height: 450 }} cols={3} rowHeight={164}>
        {itemData.map((item) => (
            <ImageListItem key={item.img} m="20px">
            <img
                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                alt="student"
                loading="lazy"
            />
            </ImageListItem>
        ))}
        </ImageList>
        </Box>

        <Box boxShadow={10} p="10px" m="20px" width="50%">
            <Box m="60px">
            <Header title="LOGIN" />
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={yup.object().shape({
                email: yup.string().email().required('Email is required'),
                password: yup.string().required('Password is required'),
            })}
            onSubmit={handleLogin}
            >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, }) => (
                <form onSubmit={handleSubmit}>
                    <Box>
                        <TextField
                        label="Email"
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                        style={{ margin: '20px', width: '60%' }}
                        InputLabelProps={{ shrink: true }}
                    />  
                    </Box>
                    <Box>
                        <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        style={{ margin: '20px', width: '60%' }}
                        InputLabelProps={{ shrink: true }}
                    />
                    </Box>
                <Box display="flex"         justifyContent="flex-start" mt="20px">
                    <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    type="submit"
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? 'Submitting...' : 'Login'}
                    </Button>
              </Box>
                </form>
            )}
            </Formik>
            </Box>
        </Box>
        </Box>
        </Box>
    );
};

export default LoginUser;