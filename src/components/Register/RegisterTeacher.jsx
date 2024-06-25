// Path : src\components\Teacher\RegisterTeacher.jsx

import React from "react";
import { Box, Breadcrumbs, Link, Typography, TextField, Button } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { registerTeacher } from "../../api/auth";

const RegisterTeacher = () => {
  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await registerTeacher(values);
      setSubmitting(false);
      setErrors({});
      console.log(response.data);
      alert("Teacher created successfully!");
      // window.location.href = `/updateteacher/${teacherId}`; 
    } catch (error) {
      console.error("Error registering teacher:", error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "Registration failed. Please try again later." });
      }
      setSubmitting(false);
    }
  };
  

  return (
    <Box>
      <Box m="10px 0 0 20px">
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            component={RouterLink}
            to="/teachers"
            color="text.primary"
            sx={{ textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
          >
            Teachers
          </Link>
          <Typography color="text.primary">Add Teacher</Typography>
        </Breadcrumbs>
      </Box>

      <Box boxShadow={15} p="10px" m="20px">
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            role: "TEACHER",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
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
                disabled
              />
              <Box display="flex" justifyContent="end" m="20px">
                <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default RegisterTeacher;
