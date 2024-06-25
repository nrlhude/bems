import React, { useState, useEffect } from 'react';
import { Box, Breadcrumbs, Typography, Button } from "@mui/material";
import Header from "../Header";
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ViewSchoolSession = () => {
  const { schoolSessionID } = useParams(); // Get the session ID from the URL params
  const [session, setSession] = useState(null); // State to store the session data

  // Fetch session data when component mounts
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/school-sessions/${schoolSessionID}`);
        setSession(response.data); // Set session data to state
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    fetchSession();
  }, [schoolSessionID]); // Fetch session data whenever schoolSessionID changes

  return (
    <Box>
      {session && (
        <Box>
          <Box m="10px 0 0 20px">
            {/* Breadcrumb with session name */}
            <Breadcrumbs aria-label="breadcrumb">
              <Link component={RouterLink} to="/settings" color="text.primary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Settings
              </Link>
              <Typography color="text.primary">{session.session_name}</Typography>
            </Breadcrumbs>
          </Box>
          <Box m="0 0 0px 20px">
            {/* Header with session name as title */}
            <Header title={session.session_name} subtitle="Sesi Pembelajaran" />
            {/* Display session details */}
            <Box boxShadow={15} p="10px" mt="20px">
              <Typography variant="h6">Session Details</Typography>
              <Typography variant="body1">Start Date: {session.session_start_date}</Typography>
              <Typography variant="body1">End Date: {session.session_end_date}</Typography>
              <Typography variant="body1">Status: {session.session_status}</Typography>
              {/* Button to navigate back */}
              <Box display="flex" justifyContent="end" mt="20px">
                <Button component={RouterLink} to="/settings" color="secondary" variant="contained">
                  Back
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ViewSchoolSession;
