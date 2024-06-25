import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Breadcrumbs, Typography } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "../Header";
import { Link } from 'react-router-dom';

const UpdateSchoolSession = () => {
  const { schoolSessionID } = useParams(); // Get the session ID from the URL params
  const history = useNavigate(); // Use useNavigate to redirect user to another page

  const [session, setSession] = useState(null); // State to store the session data
  const [loading, setLoading] = useState(true); // Loading state

  // Define validation schema for form fields
  const validationSchema = yup.object().shape({
    session_name: yup.string().required("Session name is required"),
    session_start_date: yup.date().required("Start date is required"),
    session_end_date: yup.date().required("End date is required"),
    session_status: yup.string().required("Session status is required"),
  });

  // Fetch session data when component mounts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/school-sessions/${schoolSessionID}/`);
        setSession(response.data); // Set session data to state
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching session:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };
    fetchSession();
  }, [schoolSessionID]); // Fetch session data whenever schoolSessionID changes

  // Handle form submission
  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      // Make API call to update school session
    const response = await axios.put(`http://127.0.0.1:8000/api/school-sessions/${schoolSessionID}/`, values);
      console.log(response.data);
      // Handle success, e.g., redirect to another page
      alert("School session updated successfully!");
      history('/settings/school-sessions'); // Redirect to Settings page
    } catch (error) {
      console.error('Error updating school session:', error);
      // Handle error, e.g., display error message to the user
      alert("Error updating school session. Please try again later.");
    }
    setSubmitting(false);
  };

  return (
    <Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : session ? (
        <Box>
          <Box m="10px 0 0 20px">
            {/* Breadcrumb with session name */}
            <Breadcrumbs aria-label="breadcrumb">
              <Link component={RouterLink} to="/settings/school-sessions" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Settings
              </Link>
              <Typography color="text.primary">Kemaskini Sesi {session.session_name}</Typography>
            </Breadcrumbs>
          </Box>
          <Box m="0 20px 0px 20px">
            {/* Header with session name as title */}
            <Header title="SESI PEMBELAJARAN" subtitle="Kemaskini Sesi Pembelajaran" />
            {/* Formik form for updating session */}
            <Box boxShadow={15} p="10px" mt="20px">
            <Formik
              initialValues={session}
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
                    variant="outlined"
                    type="text"
                    label="Session Name"
                    name="session_name"
                    value={values.session_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.session_name && !!errors.session_name}
                    helperText={touched.session_name && errors.session_name}
                    style={{ margin: '20px' , width: '95%'}}
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
                    style={{ margin: '20px' , width: '45%'}}
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
                    style={{ margin: '20px' , width: '45%'}}
                  />
                  {/* Session Status */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    select
                    label="Session Status"
                    name="session_status"
                    value={values.session_status}
                    style={{ margin: '20px' , width: '95%' }}
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
                      {isSubmitting ? 'Submitting...' : 'Kemaskini'}
                    </Button>
                    {/* Cancel Button */}
                    <Button
                      color="error"
                      variant="contained"
                      style={{ marginLeft: '10px' }}
                      onClick={() => history('/settings/school-sessions')}
                    >
                      Batal
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
            </Box>
          </Box>
        </Box>
      ) : (
        <Typography>Session not found.</Typography>
      )}
    </Box>
  );
};

export default UpdateSchoolSession;
