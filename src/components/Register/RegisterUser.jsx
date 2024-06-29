

import React from "react";
import { Box, Breadcrumbs, Link, Typography, TextField, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";

const RegisterUser = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const history = useNavigate();

    const validationSchema = yup.object({
        username: yup.string().required("Username is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
        first_name: yup.string().required("First name is required"),
        last_name: yup.string().required("Last name is required"),
        password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters"),
        role: yup.string().required("Role is required"),
    });

    const initialValues = {
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        role: "",
    };

    const handleFormSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/register/', values);
            console.log(response.data);
            
            const tcRes = await axios.get('http://127.0.0.1:8000/api/teacherprofile/');
            const findteacherprofile = tcRes.data.find((teacherprofile) => teacherprofile.user === parseInt(response.data.id));
              console.log(findteacherprofile);

            const prtRes = await axios.get('http://127.0.0.1:8000/api/parentprofile/');
            const findparentprofile = prtRes.data.find((parentprofile) => parentprofile.user === parseInt(response.data.id));
            console.log(findparentprofile);

            if(findteacherprofile){
                history(`/updateteacher/${findteacherprofile.id}`);
            } else if (findparentprofile){
                history(`/updateparent/${findparentprofile.id}`);
            } else {
              history('/users');
            }
            
            alert("User registered successfully!");
        }
        catch (error) {
            console.error('Registration error:', error);
            if (error.response && error.response.data) {
                alert(`Registration failed: ${JSON.stringify(error.response.data)}`);
            } else {
                alert('An error occurred during registration');
            }
        }
        setSubmitting(false);
    };


    return (
        <Box m="20px">
            <Box m="10px 0 0 20px">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/users" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        User
                    </Link>
                    <Typography color="text.primary">Tambah User</Typography>
                </Breadcrumbs>
            </Box>
            <Box m="0 0 0px 20px">
                <Header title="USER" subtitle="Tambah USER" />
                {/* Formik form */}
                <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                    <TextField
                        name="username"
                        label="Username"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                    />
                    <TextField
                        name="email"
                        label="Email"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                    />
                    <TextField
                        name="first_name"
                        label="First Name"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={values.first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.first_name && Boolean(errors.first_name)}
                        helperText={touched.first_name && errors.first_name}
                    />
                    <TextField
                        name="last_name"
                        label="Last Name"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={values.last_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.last_name && Boolean(errors.last_name)}
                        helperText={touched.last_name && errors.last_name}
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                    />
                    <TextField
                        name="role"
                        label="Role"
                        fullWidth
                        variant="outlined"
                        margin="normal"
                        value={values.role}
                        onChange={handleChange}
                        SelectProps={{ native: true, }}
                        select
                        required
                    >
                      <option value=""></option>
                      <option value="ADMIN">Admin</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="PARENT">Parent</option>
                    </TextField>
                    
                    <Box display="flex" justifyContent="end" m="20px">
                        <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </Box>
                    </form>
                )}
                </Formik>
            </Box>
        </Box>
    );
};
export default RegisterUser;
