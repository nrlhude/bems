import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatBox from "../../components/StatBox";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import ProgressCircle from "../../components/ProgressCircle";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, newThisMonth: 0 },
    teacherProfiles: { total: 0, complete: 0, newThisMonth: 0 },
    parentProfiles: { total: 0, active: 0, newThisMonth: 0 },
    schoolSessions: { total: 0, ongoing: 0, completed: 0 },
    kelas: { total: 0, active: 0, withEvaluations: 0 },
    studentProfiles: { total: 0, complete: 0, newThisMonth: 0 },
    attendanceKelas: { total: 0, averageRate: 0, issues: 0 },
    evaluateKelas: { total: 0, averageScore: 0, newThisMonth: 0 },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        usersData,
        teacherProfileData,
        parentProfileData,
        schoolSessionData,
        kelasData,
        studentProfileData,
        attendanceKelasData,
        evaluateKelasData,
      ] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/user/'),
        axios.get('http://127.0.0.1:8000/api/teacherprofile/'),
        axios.get('http://127.0.0.1:8000/api/parentprofile/'),
        axios.get('http://127.0.0.1:8000/api/school-sessions/'),
        axios.get('http://127.0.0.1:8000/api/kelas-session/'),
        axios.get('http://127.0.0.1:8000/api/studentprofile/'),
        axios.get('http://127.0.0.1:8000/api/student-attendance/'),
        axios.get('http://127.0.0.1:8000/api/evaluate-kelas/'),
      ]);
      console.log('usersData', usersData.data);
      console.log('teacherProfileData', teacherProfileData.data);
      console.log('parentProfileData', parentProfileData.data);
      console.log('schoolSessionData', schoolSessionData.data);
      console.log('kelasData', kelasData.data);
      console.log('studentProfileData', studentProfileData.data);
      console.log('attendanceKelasData', attendanceKelasData.data);
      console.log('evaluateKelasData', evaluateKelasData.data);
      console.log('usersData length', usersData.data.length);

      setStats({
        users: {
          total: usersData.data.length,
          active: usersData.data.filter(user => user.is_active).length,
          newThisMonth: calculateNewThisMonth(usersData.data, 'date_joined'),
        },
      
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // Handle error state
    }
  };

  const calculateNewThisMonth = (data, dateField) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    }).length;
  };
   
  console.log('stats:', stats);

  return (
    <Box m="10px 20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Utama" subtitle="Selamat datang, " />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "10px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>
      
       {/* GRID & CHARTS */}
       <Box
        display="grid"
        gridTemplateColumns="repeat(15, 1fr)"
        gridAutoRows="100px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" >
          <StatBox title="Total Users" subtitle={stats.users.total} icon={ <PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" , m:"10px"}}/> } />
        </Box>
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" >
        <StatBox title="Active Users" subtitle={stats.users.active} />
        </Box>
        <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" >
        <StatBox title="New Users This Month" subtitle={stats.users.newThisMonth} />
        </Box>
      </Box>

      {/* ROW 2 */}
      
    </Box>
    
  );
};

export default Dashboard;
