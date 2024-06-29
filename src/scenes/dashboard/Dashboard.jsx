import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, IconButton, Typography, Button, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LineChart, AnimatedLine } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Diversity1TwoToneIcon from '@mui/icons-material/Diversity1TwoTone';
import PunchClockTwoToneIcon from '@mui/icons-material/PunchClockTwoTone';
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone';
import FolderZipTwoToneIcon from '@mui/icons-material/FolderZipTwoTone';
import HistoryEduTwoToneIcon from '@mui/icons-material/HistoryEduTwoTone';
import RoomPreferencesTwoToneIcon from '@mui/icons-material/RoomPreferencesTwoTone';
import EscalatorWarningTwoToneIcon from '@mui/icons-material/EscalatorWarningTwoTone';
import SchoolTwoToneIcon from '@mui/icons-material/SchoolTwoTone';






const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [users, setUsers] = useState([]);
  const [teacherprofile, setTeacherProfile] = useState([]);
  const [parentprofile, setParentProfile] = useState([]);
  const [schoolsession, setSchoolSession] = useState([]);
  const [kelas, setKelas] = useState([]); 
  const [tunjangutama, setTunjangUtama] = useState([]);
  const [subtunjang, setSubTunjang] = useState([]);
  const [fokus, setFokus] = useState([]);
  const [stdkandungan, setStdKandungan] = useState([]);
  const [stdpembelajaran, setStdPembelajaran] = useState([]);
  const [penerapannilai, setPenerapanNilai] = useState([]);
  const [stdprestasicriteria, setStdPrestasiCriteria] = useState([]);
  const [stdprestasilevel, setStdPrestasiLevel] = useState([]);
  const [studentprofile, setStudentProfile] = useState([]);
  const [peoplekelas, setPeopleKelas] = useState([]);
  const [kelassession, setKelasSession] = useState([]);
  const [rph, setRPH] = useState([]);
  const [evaluatekelas, setEvaluateKelas] = useState([]);
  const [studentevaluate, setStudentEvaluate] = useState([]);
  const [stdprestasievaluation, setStdPrestasiEvaluation] = useState([]);
  const [attendancekelas, setAttendanceKelas] = useState([]);
  const [studentattendance, setStudentAttendance] = useState([]);
  const [studentreport, setStudentReport] = useState([]);
  const [studentreportevaluation, setStudentReportEvaluation] = useState([]);
  const [reportclass, setReportClass] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentSessionName = localStorage.getItem('schoolsessionName');
  const currentSessionID = localStorage.getItem('schoolsessionID');
  const currentUserId = localStorage.getItem('user_id');
  const currentUserName = localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name');
  const currentUserRole = localStorage.getItem('role');
  const currentTeacherID = localStorage.getItem('teacherId');
  const currentParentID = localStorage.getItem('parentId');

  const [currentsessionData, setCurrentSessionData] = useState([]);

  const fetchData = async () => {
    try {
        const [
          usersData,
          teacherProfileData,
          parentProfileData,
          schoolsessionData,
          kelasData,
          tunjangutamaData,
          subtunjangData,
          fokusData,
          stdkandunganData,
          stdpembelajaranData,
          penerapannilaiData,
          stdprestasicriteriaData,
          stdprestasilevelData,
          studentprofileData,
          peoplekelasData,
          kelassessionData,
          rphData,
          evaluatekelasData,
          studentevaluateData,
          stdprestasievaluationData,
          attendancekelasData,
          studentattendanceData,
          studentreportData,
          studentreportevaluationData,
          reportclassData,
          notificationsData,
          currentsessionData,
        
        ] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/user/'),
          axios.get('http://127.0.0.1:8000/api/teacherprofile/'),
          axios.get('http://127.0.0.1:8000/api/parentprofile/'),
          axios.get('http://127.0.0.1:8000/api/school-sessions/'),
          axios.get('http://127.0.0.1:8000/api/kelass/'),
          axios.get('http://127.0.0.1:8000/api/tunjang-utama/'),
          axios.get('http://127.0.0.1:8000/api/sub-tunjang/'),
          axios.get('http://127.0.0.1:8000/api/fokus/'),
          axios.get('http://127.0.0.1:8000/api/std-kandungan/'),
          axios.get('http://127.0.0.1:8000/api/std-pembelajaran/'),
          axios.get('http://127.0.0.1:8000/api/penerapan-nilai/'),
          axios.get('http://127.0.0.1:8000/api/stdprestasicriteria/'),
          axios.get('http://127.0.0.1:8000/api/stdprestasilevel/'),
          axios.get('http://127.0.0.1:8000/api/studentprofile/'),
          axios.get('http://127.0.0.1:8000/api/people-kelas/'),
          axios.get('http://127.0.0.1:8000/api/kelas-session/'),
          axios.get('http://127.0.0.1:8000/api/rph/'),
          axios.get('http://127.0.0.1:8000/api/evaluate-kelas/'),
          axios.get('http://127.0.0.1:8000/api/student-evaluate/'),
          axios.get('http://127.0.0.1:8000/api/stdprestasievaluation/'),
          axios.get('http://127.0.0.1:8000/api/attendance-kelas/'),
          axios.get('http://127.0.0.1:8000/api/student-attendance/'),
          axios.get('http://127.0.0.1:8000/api/studentreport/'),
          axios.get('http://127.0.0.1:8000/api/studentreportevaluation/'),
          axios.get('http://127.0.0.1:8000/api/report-class/'),
          axios.get('http://127.0.0.1:8000/api/notification/'),
          axios.get(`http://127.0.0.1:8000/api/school-sessions/${currentSessionID}/`)
        ]);

        setUsers(usersData.data);
        setTeacherProfile(teacherProfileData.data);
        setParentProfile(parentProfileData.data);
        setSchoolSession(schoolsessionData.data);
        setKelas(kelasData.data);
        setTunjangUtama(tunjangutamaData.data);
        setSubTunjang(subtunjangData.data);
        setFokus(fokusData.data);
        setStdKandungan(stdkandunganData.data);
        setStdPembelajaran(stdpembelajaranData.data);
        setPenerapanNilai(penerapannilaiData.data);
        setStdPrestasiCriteria(stdprestasicriteriaData.data);
        setStdPrestasiLevel(stdprestasilevelData.data);
        setStudentProfile(studentprofileData.data);
        setPeopleKelas(peoplekelasData.data);
        setKelasSession(kelassessionData.data);
        setRPH(rphData.data);
        setEvaluateKelas(evaluatekelasData.data);
        setStudentEvaluate(studentevaluateData.data);
        setStdPrestasiEvaluation(stdprestasievaluationData.data);
        setAttendanceKelas(attendancekelasData.data);
        setStudentAttendance(studentattendanceData.data);
        setStudentReport(studentreportData.data);
        setStudentReportEvaluation(studentreportevaluationData.data);
        setReportClass(reportclassData.data);
        setCurrentSessionData(currentsessionData.data);
        setNotifications(notificationsData.data);
        setLoading(false);
    }
    catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const today = new Date();
  const daysToEndSession = Math.ceil((new Date(currentsessionData.session_end_date) - today) / (1000 * 60 * 60 * 24));

  const activeTeachers = teacherprofile.filter(teacher => teacher.status === 'Aktif').length;
  const activeStudents = studentprofile.filter(student => student.status === 'Aktif').length;
  const activeParents = parentprofile.filter(parent => parent.status === 'Aktif').length;
  const currentClasses = kelassession.filter(klass => klass.session_id === parseInt(currentSessionID)).length;
  const attendancesToday = studentattendance.filter(att => new Date(att.attendance_date).toDateString() === today.toDateString() && att.status === 'Hadir').length;
  const rphThisMonth = rph.filter(item => new Date(item.created_at).getMonth() === today.getMonth() && new Date(item.created_at).getFullYear() === today.getFullYear()).length;
  const reportclassThisMonth = reportclass.filter(report => new Date(report.created_at).getMonth() === today.getMonth() && new Date(report.created_at).getFullYear() === today.getFullYear()).length;


  // Prepare data for charts

  //const sessionMap = new Map(schoolsession.data.map((item) => [item.session_id, item.session_name]));
  //console.log('sessionMap', sessionMap);

  const classes = kelassession.filter((klass) => klass.session_id === parseInt(currentSessionID));

  const filterStudentLelaki = studentprofile.filter((student) => student.gender === 'Lelaki');

  const filterStudentPerempuan = studentprofile.filter((student) => student.gender === 'Perempuan');

  const maleStudentsPerClass = classes.map((klass) =>
    peoplekelas.filter(
      (people) => people.kelassession_id === parseInt(klass.kelassession_id) &&
      filterStudentLelaki.some((student) => people.student_id === parseInt(student.id))
    ).length);

  const femaleStudentsPerClass = classes.map((klass) =>
    peoplekelas.filter(
      (people) => people.kelassession_id === parseInt(klass.kelassession_id) &&
      filterStudentPerempuan.some((student) => people.student_id === parseInt(student.id))
    ).length);

  const filterpelajar = peoplekelas.filter((people) => people.role === 'PELAJAR');

  const studentsPerSession = schoolsession.map((session) => filterpelajar.filter((people) => people.session_id === parseInt(session.session_id)).length);

  const filtertetacher = peoplekelas.filter((people) => people.role === 'GURU');
  const teacherpersession = schoolsession.map((session) => filtertetacher.filter((people) => people.session_id === parseInt(session.session_id)).length);

  console.log('studentsPerSession:', studentsPerSession);
  console.log('classes:', classes);
  console.log('filterStudentLelaki:', filterStudentLelaki);
  console.log('filterStudentPerempuan:', filterStudentPerempuan);
  console.log('maleStudentsPerClass:', maleStudentsPerClass);
  console.log('femaleStudentsPerClass:', femaleStudentsPerClass);
  // console.log('activeTeachers:', activeTeachers);
  // console.log('activeStudents:', activeStudents);
  // console.log('activeParents:', activeParents);
  // console.log('currentClasses:', currentClasses);
  // console.log('attendancesToday:', attendancesToday);
  // console.log('rphThisMonth:', rphThisMonth);
  // console.log('reportclassThisMonth:', reportclassThisMonth);
  // console.log('daysToEndSession:', daysToEndSession);
  // console.log('currentSessionName:', currentSessionName);
  // console.log('currentSessionID:', currentSessionID);
    const handleAddNoti = async () => {
      const mssg = prompt('Enter your notification message');
      if (mssg) {
        try {
          const data = { notification_text: mssg }
          const response = await axios.post('http://127.0.0.1:8000/api/notification/', data);
          setNotifications([...notifications, response.data]);
          console.log('response', response.data, ' notifications: ', notifications);
          alert('New Notification added');
        } catch (error) {
          console.error(error);
          alert('Failed to add new notification');
        }
      }
      else{
        alert("Text cannot be empty");
      }
    };

    const columnNoti = [
      {field: 'notification_text', headerName: 'Messages', flex: 1},
      {field: 'created_at', headerName: '', flex: 0.2},
      {field: 'actions', headerName: '', flex: 0.2,
        renderCell: (params) => (
          <Box display="flex" alignItems="center" mt='10px'>
                    { currentUserRole !== 'PARENT' &&(
                      <IconButton onClick={() => handleDeleteNoti(params.row.notification_id)}>
                      <HighlightOffTwoToneIcon />
                    </IconButton>
                    
                    )}
            </Box>
        )
      }
    ];

    const handleDeleteNoti = async (notificationId) => {
      try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/notification/${notificationId}/`);
        console.log('Notification deleted:', response.data);
        alert('Notification deleted successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('Failed to delete notification');
      }
    };

    console.log('notifications', notifications);

  return (
    <Box p={3}>
      <Typography variant="h4" color={colors.grey[400]} mb={2}>Selamat datang, {currentUserName}</Typography>
    <Grid container spacing={2}>
      
        <Grid item xs={3}>
          <Box bgcolor={colors.greenAccent[500]} p={1} borderRadius={2} display="flex" height='100%'>
          <Box width='50%' textAlign='center' >
              <Diversity1TwoToneIcon style={{ fontSize: '4rem' }}/>
          </Box>
          <Box width='30%'>
            <Typography variant="h6">GURU</Typography>
            <Typography variant="h4">{activeTeachers}</Typography>
          </Box>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box bgcolor={colors.greenAccent[500]} p={1} borderRadius={2} display="flex" height='100%'>
          <Box width='50%' textAlign='center' >
              <SchoolTwoToneIcon style={{ fontSize: '4rem' }}/>
          </Box>
          <Box width='30%'>
            <Typography variant="h6">PELAJAR</Typography>
            <Typography variant="h4">{activeStudents}</Typography>
          </Box>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box bgcolor={colors.greenAccent[500]} p={1} borderRadius={2} display="flex" height='100%'>
          <Box width='50%' textAlign='center' >
              <EscalatorWarningTwoToneIcon style={{ fontSize: '4rem' }}/>
          </Box>
          <Box width='30%'>
            <Typography variant="h6">IBU BAPA</Typography>
            <Typography variant="h4">{activeParents}</Typography>
          </Box>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box bgcolor={colors.greenAccent[500]} p={1} borderRadius={2} display="flex" height='100%'>
          <Box width='50%' textAlign='center' >
              <RoomPreferencesTwoToneIcon style={{ fontSize: '4rem' }}/>
          </Box>
          <Box width='30%'>
            <Typography variant="h6">KELAS</Typography>
            <Typography variant="h4">{currentClasses}</Typography>
          </Box>
          </Box>
        </Grid>
    </Grid>

    <Grid container spacing={2} mt={1}>
      <Grid item xs={3}>
          <Box bgcolor={colors.greenAccent[500]} p={1} borderRadius={2} display="flex" height='100%'>
          <Box width='50%' textAlign='center' >
              <HistoryEduTwoToneIcon style={{ fontSize: '4rem' }}/>
          </Box>
          <Box width='30%'>
            <Typography variant="h6">RPH BULAN INI</Typography>
            <Typography variant="h4">{rphThisMonth}</Typography>
          </Box>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box bgcolor={colors.greenAccent[500]} p={1} borderRadius={2} display="flex" height='100%'>
          <Box width='50%' textAlign='center' >
              <FolderZipTwoToneIcon style={{ fontSize: '4rem' }}/>
          </Box>
          <Box width='50%'>
            <Typography variant="h6">LAPORAN KELAS BULAN INI</Typography>
            <Typography variant="h4">{reportclassThisMonth}</Typography>
          </Box>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box bgcolor={colors.greenAccent[500]} p={1} borderRadius={2} display="flex" height='100%'>
          <Box width='50%' textAlign='center' >
              <AssignmentTurnedInTwoToneIcon style={{ fontSize: '4rem' }}/>
          </Box>
          <Box width='50%'>
            <Typography variant="h6">BIL PELAJAR HADIR</Typography>
            <Typography variant="h4">{attendancesToday}</Typography>
          </Box>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box bgcolor={colors.greenAccent[500]} p={1} borderRadius={2} display="flex" height='100%'>
          <Box width='50%' textAlign='center' >
              <PunchClockTwoToneIcon style={{ fontSize: '4rem' }}/>
          </Box>
          <Box width='50%'>
            <Typography variant="h6">BIL HARI SESI PERSEKOLAHAN TINGGAL</Typography>
            <Typography variant="h4">{daysToEndSession}</Typography>
          </Box>
          </Box>
        </Grid>
    </Grid>

    <Grid container spacing={2} mt={1}>
        <Grid item xs={4}>
          <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" events={[]} />
        </Grid>
        
        <Grid item xs={4}>
          <Box bgcolor={colors.greenAccent[500]} p={1} borderRadius={2} height='100%'>
            <Box>
              <Typography variant="h6">NOTICE BOARD</Typography>
            {currentUserRole !== 'PARENT' ? <Button variant="contained" color="tertiary" onClick={handleAddNoti}>Add Notification</Button> : null}
            </Box>
            <Box m="5px" height="45vh"
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
                                    "& .MuiDataGrid-toolbarContainer .      MuiButton-text": {
                                        color: `${colors.grey[100]} !important`,
                                    },
                                }}
                            >
                                <DataGrid
                                    rows={notifications}
                                    columns={columnNoti}
                                    getRowId={(row) => row.notification_id}
                                    
                                />
                            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box bgcolor={colors.greenAccent[500]} p={2} borderRadius={2} height='100%'>
            <Typography variant="h6">QUICK LINKS</Typography>
            {currentUserRole === 'TEACHER' ? <Button variant="contained" color="tertiary" component={RouterLink} to={`/viewprofileteacher/${currentTeacherID}`} sx={{ margin: 0.5 }}>My Profile</Button> : null}
            {currentUserRole === 'PARENT' ? <Button variant="contained" color="tertiary" component={RouterLink} to={`/viewprofileparent/${currentParentID}`} sx={{ margin: 0.5 }}>My Profile</Button> : null}
            {/* admin : createuser , go to curriculum settings/school-sessions, user list */}
            {currentUserRole === 'ADMIN' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/registeruser'} sx={{ margin: 0.5 }}>Register User</Button> : null}
            {currentUserRole === 'ADMIN' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/settings/school-sessions'} sx={{ margin: 0.5 }}>Curriculum Setting</Button> : null}
            {currentUserRole === 'ADMIN' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/users'} sx={{ margin: 0.5 }}>User List</Button> : null}

            {/* !== 'PARENT' */}
            {currentUserRole !== 'PARENT' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/teachers'} sx={{ margin: 0.5 }}>Teacher List</Button> : null}
            <Button variant="contained" color="tertiary" component={RouterLink} to={'/students'} sx={{ margin: 0.5 }}>Student List</Button>
            {currentUserRole !== 'PARENT' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/parents'} sx={{ margin: 0.5 }}>Parent List</Button> : null}
            {currentUserRole !== 'PARENT' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/kelasSession'} sx={{ margin: 0.5 }}>Class List</Button> : null}
            {currentUserRole !== 'PARENT' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/createrph'} sx={{ margin: 0.5 }}>Create RPH</Button> : null}
            <Button variant="contained" color="tertiary" component={RouterLink} to={'/attendance'} sx={{ margin: 0.5 }}>Today Attendance</Button> 
            {currentUserRole !== 'PARENT' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/createevaluatekelas'} sx={{ margin: 0.5 }}>Create Evaluation</Button> : null}
            {currentUserRole !== 'PARENT' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/createexamkelas'} sx={{ margin: 0.5 }}>Key In Student Result</Button> : null}
            {currentUserRole !== 'PARENT' ? <Button variant="contained" color="tertiary" component={RouterLink} to={'/createclassreport'} sx={{ margin: 0.5 }}>Create Class Report</Button> : null}
            <Button variant="contained" color="tertiary" component={RouterLink} to={'/reportStudent'} sx={{ margin: 0.5 }}>View Student Report</Button>
          </Box>
        </Grid>
    </Grid>
    <Grid container spacing={2} mt={1}>
        <Grid item xs={6}>
          <Box bgcolor={colors.greenAccent[500]} p={2} borderRadius={2} height='100%'>
          <Typography variant="h6">OVERVIEW</Typography>
            
            <BarChart
          xAxis={[{ scaleType: 'band', data: schoolsession.map((klass) => klass.session_name) }]}
            series={[
              { data: studentsPerSession, stack: 'A', label: 'Pelajar' },
              { data: teacherpersession, stack: 'A', label: 'Guru' },
            ]}
            barLabel={(item, context) => {
              if ((item.value ?? 0) > 10) {
                return 'High';
              }
              return context.bar.height < 60 ? null : item.value?.toString();
            }}
            width={600}
            height={350}
          />
          </Box>
        </Grid>


        <Grid item xs={6}>
        <Box bgcolor={colors.greenAccent[500]} p={2} borderRadius={2}>
          <Typography variant="h6">CLASS STUDENT</Typography>
          <BarChart
          xAxis={[{ scaleType: 'band', data: classes.map((klass) => klass.kelassession_name) }]}
            series={[
              { data: maleStudentsPerClass, stack: 'A', label: 'Lelaki' },
              { data: femaleStudentsPerClass, stack: 'A', label: 'Perempuan' },
            ]}
            barLabel={(item, context) => {
              if ((item.value ?? 0) > 10) {
                return 'High';
              }
              return context.bar.height < 60 ? null : item.value?.toString();
            }}
            width={600}
            height={350}
          />
        </Box>
      </Grid>

      </Grid>   
    </Box>
  );
};

export default Dashboard;

