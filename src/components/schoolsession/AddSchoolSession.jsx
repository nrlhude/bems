import React from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

const CreateSchoolSession = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Use useHistory to redirect user to another page
  const history = useNavigate();

  // Define validation schema for form fields
  const validationSchema = yup.object().shape({
    session_name: yup.string().required("Session name is required"),
    session_start_date: yup.date().required("Start date is required"),
    session_end_date: yup.date().required("End date is required"),
    session_status: yup.string().required("Session status is required"),
  });

  // Initial values for form fields
  const initialValues = {
    session_name: "",
    session_start_date: "",
    session_end_date: "",
    session_status: "",
  };

  // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      // Make API call to create new school session
    const response = await axios.post('http://127.0.0.1:8000/api/school-sessions/', values);
    console.log(response.data);
    // Handle success, e.g., redirect to another page
    alert("School session created successfully!");
    history('/settings/school-sessions');
  } catch (error) {
    console.error('Error creating school session:', error);
    // Handle error, e.g., display error message to the user
    alert("Error creating school session. Please try again later.");
  }
  setSubmitting(false);
  };

  return (
    <Box>
      
      <Box m="10px 0 0 20px">
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} to="/settings/school-sessions" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Settings
          </Link>
          <Typography color="text.primary">Sesi Pembelajaran</Typography>
        </Breadcrumbs>
      </Box>

      <Box m="0 0 0px 20px">
        <Header title="SESI PEMBELAJARAN" subtitle="Tambah Sesi Pembelajaran Baru" />
        <Box boxShadow={15} p="10px" mt="20px">
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
            {/* Session Name */}
            <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Session Name"
                name="session_name"
                value={values.session_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.session_name && !!errors.session_name}
                helperText={touched.session_name && errors.session_name}
                style={{ margin: '20px' }}
            />
            {/* Start Date */}
              <TextField
                variant="outlined"
                type="date"
                label="Start Date"
                name="session_start_date"
                value={values.session_start_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.session_start_date && !!errors.session_start_date}
                helperText={touched.session_start_date && errors.session_start_date}
                style={{ margin: '20px' , width: '50%'}}
              />
              {/* End Date */}
              <TextField
                fullWidth
                variant="outlined"
                type="date"
                label="End Date"
                name="session_end_date"
                value={values.session_end_date}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.session_end_date && !!errors.session_end_date}
                helperText={touched.session_end_date && errors.session_end_date}
                style={{ margin: '20px' , width: '50%'}}
              />
              {/* Session Status */}
              <TextField
                fullWidth
                variant="outlined"
                select
                label="Session Status"
                name="session_status"
                value={values.session_status}
                style={{ margin: '20px' }}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.session_status && !!errors.session_status}
                helperText={touched.session_status && errors.session_status}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select</option>
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                
              </TextField>
              {/* Submit Button */}
              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Hantar'}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      </Box>
    </Box>
  );
};

export default CreateSchoolSession;
