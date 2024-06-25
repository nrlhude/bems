import { Box, Breadcrumbs, Typography, TextField, Tabs, Tab, Button, Select, MenuItem } from "@mui/material";
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const UpdateStudentEvaluate = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { studentevaluateId } = useParams();
    const navigate = useNavigate();

    const [studentEvaluate, setStudentEvaluate] = useState({});
    const [loading, setLoading] = useState(true);
    const [stdPrestasiEvaluation, setStdPrestasiEvaluation] = useState([]);
    const [stdPrestasiCriteria, setStdPrestasiCriteria] = useState([]);
    const [stdPrestasiLevel, setStdPrestasiLevel] = useState([]);
    const [subtunjang, setSubtunjang] = useState([]);

    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    studentEvaluateRes,
                    stdPrestasiEvaluationRes,
                    stdPrestasiCriteriaRes,
                    subtunjangRes,
                    stdPrestasiLevelRes,
                    evaluateRes,
                    studentRes,
                    kelassessionRes
                ] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/api/student-evaluate/${studentevaluateId}/`),
                    axios.get('http://127.0.0.1:8000/api/stdprestasievaluation/'),
                    axios.get('http://127.0.0.1:8000/api/stdprestasicriteria/'),
                    axios.get('http://127.0.0.1:8000/api/sub-tunjang/'),
                    axios.get('http://127.0.0.1:8000/api/stdprestasilevel/'),
                    axios.get('http://127.0.0.1:8000/api/evaluate-kelas/'),
                    axios.get('http://127.0.0.1:8000/api/studentprofile/'),
                    axios.get('http://127.0.0.1:8000/api/kelas-session/')
                ]);

                const studentEvaluateData = studentEvaluateRes.data;
                const evaluateData = evaluateRes.data;
                const studentData = studentRes.data;
                const kelasData = kelassessionRes.data;

                const evaluate = evaluateData.find(e => e.evaluate_id === studentEvaluateData.evaluate_id);
                const student = studentData.find(s => s.id === studentEvaluateData.student_id);
                const kelas = kelasData.find(k => k.kelassession_id === studentEvaluateData.kelassession_id);

                setStudentEvaluate({
                    ...studentEvaluateData,
                    evaluate_name: evaluate ? evaluate.evaluate_name : 'Unknown',
                    student_name: student ? student.full_name : 'Unknown',
                    kelasssession_name: kelas ? kelas.kelassession_name : 'Unknown',
                });

                setStdPrestasiEvaluation(stdPrestasiEvaluationRes.data);
                setStdPrestasiCriteria(stdPrestasiCriteriaRes.data);
                setSubtunjang(subtunjangRes.data);
                setStdPrestasiLevel(stdPrestasiLevelRes.data);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [studentevaluateId]);

    const [levelIds, setLevelIds] = useState({});

    const handleLevelChange = (criId, newLevelId) => {
        setLevelIds(prevState => ({
            ...prevState,
            [criId]: newLevelId,
        }));
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Update stdprestasievaluation records
            const updatePromises = filteredStdPrestasiEvaluation.map(async (stdPrestasiEval) => {
                const response = await axios.put(`http://127.0.0.1:8000/api/stdprestasievaluation/${stdPrestasiEval.id}/`, {
                    level_id: levelIds[stdPrestasiEval.cri_id], // Use level_id from state based on cri_id
                    cri_id: stdPrestasiEval.cri_id,
                    studentevaluate_id: stdPrestasiEval.studentevaluate_id,
                    student_id: stdPrestasiEval.student_id,
                    term: stdPrestasiEval.term,
                    kelassession_id: stdPrestasiEval.kelassession_id,
                });
                return response.data; // Return updated data from response
            });
    
            const updatedEvaluations = await Promise.all(updatePromises);
            console.log('updatedEvaluations', updatedEvaluations);
            alert('Evaluations updated successfully');
    
            // Update student-evaluate status
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/student-evaluate/${studentEvaluate.studentevaluate_id}/`, {
                    status: 'Evaluated',
                    studentevaluate_id: studentEvaluate.studentevaluate_id,
                    student_id: studentEvaluate.student_id,
                    evaluate_id: studentEvaluate.evaluate_id,
                    teacher_comment: studentEvaluate.teacher_comment,
                    kelassession_id: studentEvaluate.kelassession_id,
                });
                console.log('Status updated successfully:', response.data);
                // alert('Status updated successfully.');
            } catch (error) {
                console.error('Error updating status:', error);
                alert('Failed to update status.');
            }

            navigate(`/viewstudentevaluate/${studentEvaluate.studentevaluate_id}`);
        } catch (error) {
            alert('Error updating evaluations');
            console.error('Error updating evaluations', error);
        }
    };
    
    

    const filteredStdPrestasiEvaluation = stdPrestasiEvaluation
        .filter(item => item.studentevaluate_id === parseInt(studentevaluateId))
        .sort((a, b) => {
            const criA = stdPrestasiCriteria.find(c => c.cri_id === a.cri_id);
            const criB = stdPrestasiCriteria.find(c => c.cri_id === b.cri_id);
            return criA.subtunjang_id - criB.subtunjang_id;
        });

        const groupedBySubtunjang = stdPrestasiCriteria.reduce((acc, cri) => {
            const group = filteredStdPrestasiEvaluation.filter(item => item.cri_id === parseInt(cri.cri_id));
            console.log('group', group);
            if (group.length > 0) {
                if (!acc[cri.subtunjang_id]) {
                    acc[cri.subtunjang_id] = [];
                }
                acc[cri.subtunjang_id].push({
                    cri,
                    evaluations: group,
                    level_id: group[0].level_id,
                    levels: stdPrestasiLevel.filter(level => level.cri_id === parseInt(cri.cri_id)),
                });
            }
            console.log('acc', acc);
            return acc;
        }, {});

    
    console.log('filteredStdPrestasiEvaluation', filteredStdPrestasiEvaluation);
    console.log('groupedBySubtunjang', groupedBySubtunjang);
    console.log('studentEvaluate', studentEvaluate);
    console.log('stdPrestasiEvaluation', stdPrestasiEvaluation);
    console.log('stdPrestasiCriteria', stdPrestasiCriteria);
    console.log('subtunjang', subtunjang);
    console.log('stdPrestasiLevel', stdPrestasiLevel);

    return (
        <Box>
            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <form onSubmit={handleSubmit}>
                    <Box m="10px 0 0 20px">
                        <Breadcrumbs aria-label="breadcrumb">
                            <RouterLink to="/evaluation">Pentaksiran</RouterLink>
                            <RouterLink to={`/viewevaluatekelas/${studentEvaluate.evaluate_id}`}>Penilaian Kelas</RouterLink>
                            <Typography>Pentaksiran Pelajar {studentEvaluate.student_name}</Typography>
                        </Breadcrumbs>
                    </Box>
                    <Box m="5px 0 0 20px">
                        <Typography variant="h4" color={colors.greenAccent[400]} gutterBottom>Kemaskini Pentaksiran Pelajar</Typography>
                    </Box>
                    <Box display="flex" justifyContent="end" mr="80px">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{ backgroundColor: colors.blueAccent[700], color: colors.grey[100], fontSize: "12px", fontWeight: "bold", padding: "10px 20px" }}
                        >
                            hantar penilaian
                        </Button>
                    </Box>

                    <Box boxShadow={15} p="10px" m="10px 20px">
                        <TextField
                            name="evaluate_name"
                            label="Nama Pentaksiran"
                            value={studentEvaluate.evaluate_name || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '47.5%' }}
                        />
                        <TextField
                            name="evaluate_date"
                            label="Tarikh Pentaksiran"
                            value={studentEvaluate.evaluate_date || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '20%' }}
                        />
                        <TextField
                            name="term"
                            label="Penggal Persekolahan"
                            value={studentEvaluate.term || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '26%' }}
                        />
                        <TextField
                            name="student_name"
                            label="Nama Pelajar"
                            value={studentEvaluate.student_name || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '47.5%' }}
                        />
                        <TextField
                            name="kelas_name"
                            label="Kelas"
                            value={studentEvaluate.kelasssession_name || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '20%' }}
                        />
                        <TextField
                            name="status"
                            label="Status"
                            value={studentEvaluate.status || ''}
                            InputProps={{ readOnly: true }}
                            style={{ margin: '10px', width: '26%' }}
                        />
                    </Box>

                    <Box boxShadow={10} m="20px">
                        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                            {subtunjang.map((subTunjang, index) => (
                                <Tab key={index} label={subTunjang.subtunjang_name} />
                            ))}
                            <Tab label="Ulasan Guru" />
                        </Tabs>
                    </Box>

                    {subtunjang.map((subTunjang, index) => (
                        tabValue === index && (
                            <Box key={subTunjang.subtunjang_id} boxShadow={10} p="10px" m="20px">
                                <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>
                                    {subTunjang.subtunjang_name}
                                </Typography>
                                {groupedBySubtunjang[subTunjang.subtunjang_id] && groupedBySubtunjang[subTunjang.subtunjang_id].map((item, idx) => (
                                    <Box key={idx} boxShadow={5} p="10px" m="10px 0">
                                        <TextField
                                            name="cri_desc"
                                            label={`Kriteria Kod : ${item.cri.cri_code}`}
                                            value={item.cri.cri_desc || ''}
                                            InputProps={{ readOnly: true }}
                                            style={{ margin: '10px', width: '47.5%' }}
                                        />
                                        <TextField
                                            name={levelIds[item.cri.cri_id] || ''} // Use cri_id for unique identification
                                            value={levelIds[item.cri.cri_id] || ''} // Retrieve value from levelIds state
                                            onChange={(event) => handleLevelChange(item.cri.cri_id, event.target.value)} // Pass cri_id to handleLevelChange
                                            style={{ margin: '10px', width: '47.5%' }}
                                            required
                                            select
                                            SelectProps={{
                                                native: true,
                                            }}
                                            error={levelIds[item.cri.cri_id] === ''}
                                        >
                                            <option value="">-- Select Level --</option>
                                            {item.levels.map(level => (
                                                <option key={level.level_id} value={level.level_id}>
                                                    {`${level.level_score} - ${level.level_desc}`}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Box>
                                ))}
                            </Box>
                        )
                    ))}

                    {/* tab for ulasan guru : textfield for studentEvaluate.teacher_comment*/}
                    {tabValue === subtunjang.length && (
                    <Box boxShadow={10} p="10px" m="20px">
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>
                            Ulasan Guru
                        </Typography>
                        <TextField
                            name="teacher_comment"
                            label="Ulasan Guru"
                            value={studentEvaluate.teacher_comment || ''}
                            onChange={(event) => setStudentEvaluate({ ...studentEvaluate, teacher_comment: event.target.value })}
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            style={{ margin: '10px 0' , width: '85%'}}
                            required
                            error={studentEvaluate.teacher_comment === ''}
                        />
                    </Box>
                )}

                </form>
            )}
        </Box>
    );
};

export default UpdateStudentEvaluate;
                                           
