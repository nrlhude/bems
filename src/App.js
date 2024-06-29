import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, useMediaQuery, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useNavigate } from 'react-router-dom';

import Sidebar from './scenes/global/Sidebar'; 
import Topbar from './scenes/global/Topbar'; 
import AccProfile from './components/users/AccProfile';
import UpdateAccProfile from './components/users/UpdateAccProfile';
import FAQ
 from './scenes/faq';
// Register, Login , User
import LoginUser from './scenes/autho/LoginUser';
import Users from "./scenes/users";
import RegisterUser from './components/Register/RegisterUser';
import RegisterTeacher from './components/Register/RegisterTeacher';
import RegisterParent from './components/Register/RegisterParent';
import Dashboard from './scenes/dashboard/Dashboard';

// Teachers
import Teachers from "./scenes/teachers";
import UpdateTeacher from "./components/teachers/UpdateTeacher";
import ProfileTeacher from "./components/teachers/ProfileTeacher";
import AssignKelasTeacher from "./components/teachers/AssignKelasTeacher";

// Parents
import Parents from "./scenes/parents";
import ProfileParent from "./components/parents/ProfileParent";
import UpdateParent from "./components/parents/UpdateParent";

// Students
import Students from "./scenes/students";
import AddStudents from "./components/students/AddStudentProfile";
import ProfileStudent from "./components/students/ProfileStudent";
import UpdateStudent from "./components/students/UpdateStudent";
import AssignKelasStudent from "./components/students/AssignKelasStudent";

// Settings
import Settings from "./scenes/settings";

// SchoolSession
import SettingSchoolSessions from "./scenes/settings/school-sessions";
import CreateSchoolSession from "./components/schoolsession/AddSchoolSession";
import UpdateSchoolSession from "./components/schoolsession/UpdateSchoolSession";

// Programme
import SettingProgram from "./scenes/settings/program";
import AddProgram from "./components/program/AddProgram";
import UpdateProgram from "./components/program/UpdateProgramme";

// Classes
import SettingClasses from "./scenes/settings/classes";
import AddClass from "./components/kelas/AddClass";
import UpdateClass from "./components/kelas/UpdateClass";

// KSPK
import SettingKspk from "./scenes/settings/kspk";
import AddTunjangUtama from "./components/kspk/AddTunjangUtama";
import AddSubTunjang from "./components/kspk/AddSubTunjang";
import AddFokus from "./components/kspk/AddFokus";
import AddStdKandungan from "./components/kspk/AddStdKandungan";
import AddStdPembelajaran from "./components/kspk/AddStdPembelajaran";
import AddPenerapanNilai from "./components/kspk/AddPenerapanNilai";
import UpdateTunjangUtama from "./components/kspk/UpdateTunjangUtama";
import UpdateSubTunjang from "./components/kspk/UpdateSubTunjang";
import UpdateFokus from "./components/kspk/UpdateFokus";
import UpdateStdKandungan from "./components/kspk/UpdateStdKandungan";
import UpdateStdPembelajaran from "./components/kspk/UpdateStdPembelajaran";
import UpdatePenerapanNilai from "./components/kspk/UpdatePenerapanNilai";
// Std Prestasi
import AddStdPrestasiKriteria from "./components/kspk/AddStdPrestasiKriteria";
import UpdateStdPrestasiKriteria from "./components/kspk/UpdateStdPrestasiKriteria";
import AddStdPrestasiLevel from "./components/kspk/AddStdPrestasiLevel";
import UpdateStdPrestasiLevel from "./components/kspk/UpdateStdPrestasiLevel";

// ClassSession
import KelasSession from "./scenes/kelasSession";
import AddKelasSession from "./components/kelasSession/AddKelasSession";
import UpdateKelasSession from "./components/kelasSession/UpdateKelasSession";
import ViewKelasSession from "./components/kelasSession/KelasSessionDetails";

// RPH
import RPH from "./scenes/rph";
import AddRPH from "./components/rph/AddRPH";
import RphDetails from "./components/rph/RphDetail";
import UpdateRPH from "./components/rph/UpdateRph";

// Evaluate Student
import Evaluation from "./scenes/evaluation";
import AddEvaluateKelas from "./components/evaluation/AddEvaluateKelas";
import ViewEvaluateKelas from "./components/evaluation/ViewEvaluateKelas";
import ViewStudentEvaluate from "./components/evaluation/ViewStudentEvaluate";
import UpdateStudentEvaluate from "./components/evaluation/UpdateStudentEvaluate";

// Examination Student
import Examination from "./scenes/examination";
import AddExamKelas from "./components/examination/AddExamKelas";
import ViewExamKelas from "./components/examination/ViewExamKelas";
import UpdateExamKelas from "./components/examination/UpdateExamKelas";

// Attendance
import Attendance from "./scenes/attendance";
import AddAttendanceKelas from "./components/attendance/AddAttendanceKelas";
import ViewAttendanceKelas from "./components/attendance/ViewAttendanceKelas";

// Student Report
import StudentReport from "./scenes/reportStudent";
import ReportStudentDetails from "./components/reportStudent/ReportStudentDetails";
import ViewStudentExam from './components/examination/ViewStudentExam';

// Class Report
import ClassReport from "./scenes/reportClass";
import AddClassReport from "./components/reportClass/AddReportClass";
import ViewClassReport from "./components/reportClass/ViewReportClass";
import UpdateClassReport from "./components/reportClass/UpdateReportClass";

const App = () => {
    const [theme, colorMode] = useMode();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        // Check if a token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Decode JWT token to get user role
            const tokenPayload = parseJwt(token);
            setUserRole(tokenPayload.role);
            setLoggedIn(true);
        }

        console.log('localStorage in App.js:', localStorage);
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    const handleLogout = () => {
        // Clear user data from localStorage on logout
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('user_id');
        localStorage.removeItem('first_name');
        localStorage.removeItem('last_name');
        localStorage.removeItem('username');
        localStorage.removeItem('schoolsessionID');
        localStorage.removeItem('schoolsessionName');
        localStorage.removeItem('teacherId');
        localStorage.removeItem('parentId');
        localStorage.removeItem('currentYear');
        localStorage.removeItem('authTokens');
        setLoggedIn(false);
        setUserRole('');
        alert('You have been logged out');
        navigate('/'); 
        console.log('localStorage after logout:', localStorage);
        
        window.location.reload();

    };

    // Function to parse JWT token
    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return {};
        }
    };

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
            <CssBaseline />
                    {loggedIn ? (
                    <div className="app">
                        <Sidebar userRole={userRole} />
                        <main className={`content ${isMobile ? "mobile" : ""}`}>
                            <Topbar userRole={userRole} onLogout={handleLogout} />
                                <Routes> 
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/faq" element={<FAQ />} />
                                    <Route path='/accprofile/:userId' element={<AccProfile />} /> 
                                    <Route path='/updateaccprofile/:userId' element={<UpdateAccProfile />} />
                                    {/* Users */}
                                    <Route path="/users" element={<Users />} />
                                    <Route path="/registeruser" element={<RegisterUser />} />
                                    <Route path="/registerteacher" element={<RegisterTeacher />} />
                                    <Route path="/registerparent" element={<RegisterParent />} />

                                    {/* Teachers */}
                                    <Route path="/teachers" element={<Teachers />} />
                                    <Route path="/updateteacher/:teacherId" element={<UpdateTeacher />} />
                                    <Route path="/viewprofileteacher/:teacherId" element={<ProfileTeacher />} />
                                    <Route path="/assignkelasteacher/:teacherId" element={<AssignKelasTeacher />} />


                                    {/* Parents */}
                                    <Route path="/parents" element={<Parents />} />
                                    <Route path="/viewprofileparent/:parentId" element={<ProfileParent />} />
                                    <Route path="/updateparent/:parentId" element={<UpdateParent />} />


                                    {/* Students */}
                                    <Route path="/students" element={<Students />} />
                                    <Route path="/createstudentprofile" element={<AddStudents />} />
                                    <Route path="/updatestudent/:studentId" element={<UpdateStudent />} />
                                    <Route path="/viewprofilestudent/:studentId" element={<ProfileStudent />} />
                                    <Route path="/assignkelasstudent/:studentId" element={<AssignKelasStudent />} />

                                    {/* Settings */}
                                    <Route path="/settings" element={<Settings />} />

                                    {/* SchoolSession */}
                                    <Route path="/settings/school-sessions" element={<SettingSchoolSessions />} />
                                    <Route path="/createschoolsession" element={<CreateSchoolSession />} />
                                    <Route path="/updateschoolsession/:schoolSessionID" element={<UpdateSchoolSession />} />

                                    {/* Programme */}
                                    <Route path="/settings/programs" element={<SettingProgram />} />
                                    <Route path="/createprogram" element={<AddProgram />} />
                                    <Route path="/updateprogram/:programId" element={<UpdateProgram />} />

                                    {/* Classes */}
                                    <Route path="/settings/classes" element={<SettingClasses />} />
                                    <Route path="/createclasses" element={<AddClass />} />
                                    <Route path="/updateclass/:classId" element={<UpdateClass />} />

                                    {/* KSPK */}
                                    <Route path="/settings/kspk" element={<SettingKspk />} />
                                    <Route path="/createtunjangutama" element={<AddTunjangUtama />} />
                                    <Route path="/createsubtunjang" element={<AddSubTunjang />} />
                                    <Route path="/createfokus" element={<AddFokus />} />
                                    <Route path="/createstdkandungan" element={<AddStdKandungan />} />
                                    <Route path="/createstdpembelajaran" element={<AddStdPembelajaran />} />
                                    <Route path="/createpenerapannilai" element={<AddPenerapanNilai />} />
                                    <Route path="/updatetunjangutama/:tunjangId" element={<UpdateTunjangUtama />} />
                                    <Route path="/updatesubtunjang/:subtunjangId" element={<UpdateSubTunjang />} />
                                    <Route path="/updatefokus/:fokusId" element={<UpdateFokus />} />
                                    <Route path="/updatestdkandungan/:stdKandunganId" element={<UpdateStdKandungan />} />
                                    <Route path="/updatestdpembelajaran/:stdPembelajaranId" element={<UpdateStdPembelajaran />} />
                                    <Route path="/updatepenerapannilai/:penerapanNilaiId" element={<UpdatePenerapanNilai />} />
                                    {/* Std Prestasi */}
                                    <Route path="/createstdprestasicriteria" element={<AddStdPrestasiKriteria />} />
                                    <Route path="/updatestdprestasicriteria/:criId" element={<UpdateStdPrestasiKriteria />} />
                                    <Route path="/createstdprestasilevel" element={<AddStdPrestasiLevel />} />
                                    <Route path="/updatestdprestasilevel/:levelId" element={<UpdateStdPrestasiLevel />} /> */

                                    {/* Class Session */}
                                    <Route path="/kelasSession" element={<KelasSession />} />
                                    <Route path="/createkelassession" element={<AddKelasSession />} />
                                    <Route path="/updatekelassession/:kelassessionId" element={<UpdateKelasSession />} />
                                    <Route path="/viewkelassession/:kelassessionId" element={<ViewKelasSession /> } />

                                    {/* RPH */}
                                    <Route path="/rph" element={<RPH />} />
                                    <Route path="/createrph" element={<AddRPH />} />
                                    <Route path="/viewrph/:rphID" element={<RphDetails />} />
                                    <Route path="/updaterph/:rphID" element={<UpdateRPH />} />

                                    {/* Evaluate Student */}
                                    <Route path="/evaluation" element={<Evaluation />} />
                                    <Route path="/createevaluatekelas" element={<AddEvaluateKelas />} />
                                    <Route path="/viewevaluatekelas/:evaluateId" element={<ViewEvaluateKelas />} />
                                    <Route path="/viewstudentevaluate/:studentevaluateId" element={<ViewStudentEvaluate />} />
                                    <Route path="/updatestudentevaluate/:studentevaluateId" element={<UpdateStudentEvaluate />} />

                                    {/* Examination Student */}
                                    <Route path="/examination" element={<Examination />} />
                                    <Route path="/createexamkelas" element={<AddExamKelas />} />
                                    <Route path="/viewexamkelas/:examkelasId" element={<ViewExamKelas />} />
                                    <Route path="/updateexamkelas/:examkelasId" element={<UpdateExamKelas />} />

                                    
                                    {/* Attendance */}
                                    <Route path="/attendance" element={<Attendance />} />
                                    <Route path="/createattendancekelas/:input_date" element={<AddAttendanceKelas />} />
                                    <Route path="/viewattendancekelas/:attendanceKelasId" element={<ViewAttendanceKelas />} />

                                    {/* Student Report */}
                                    <Route path="/reportStudent" element={<StudentReport />} />
                                    <Route path="/viewstudentreport/:studentId/:kelassessionId" element={<ReportStudentDetails />} />
                                    <Route path="/viewstudentexam/:studentId/:kelassessionId" element={<ViewStudentExam />} />

                                    {/* Class Report */}
                                    <Route path="/reportClass" element={<ClassReport />} />
                                    <Route path="/createclassreport" element={<AddClassReport />} />
                                    <Route path="/viewclassreport/:classreportID" element={<ViewClassReport />} />
                                    <Route path="/updateclassreport/:classreportID" element={<UpdateClassReport />} />

                                </Routes>
                            </main>
                        </div>   
                    ) : (
                        <div className="app">
                            <main className={`content ${isMobile ? "mobile" : ""}`} style={{ padding: '0', margin: '0' }}>
                                <Routes> 
                                    <Route path="/" element={<LoginUser setLoggedIn={setLoggedIn} setUserRole={setUserRole} />} />
                                </Routes>
                            </main>
                        </div>
                    )}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default App;
