import { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { Grid, Divider, Snackbar, Alert } from '@mui/material';
import Loadable from 'ui-component/Loadable';
import { lazy } from 'react';
import EarningCard from '../dashboard/Default/EarningCard';
import Module from './Module';
import { gridSpacing } from 'store/constant';

const SamplePage = Loadable(lazy(() => import('views/sample-page')));

const studentsColumns = [
  { field: 'studentApogee', headerName: 'Apogee', width: 100 },
  { field: 'studentFirstName', headerName: 'First Name', width: 150 },
  { field: 'studentLastName', headerName: 'Last Name', width: 150 },
  { field: 'studentGroup', headerName: 'Groupe', width: 150 },
];

const Filieres = ({ abr }) => {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedModuleName, setSelectedModuleName] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedProfessorId, setSelectedProfessorId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [activeModuleId, setActiveModuleId] = useState(null);
  const samplePageRef = useRef(null);

  useEffect(() => {
    const fetchStudentsByLevelName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/${abr}`);
        const formattedStudents = response.data.map((student, index) => ({
          id: index + 1,
          studentApogee: student.apogee,
          studentFirstName: student.firstName,
          studentLastName: student.lastName,
          studentGroup: student.groupName,
        }));
        setStudents(formattedStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchModulessByLevelName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/modules/levelName/${abr}`);
        const filteredModules = response.data.filter(module => module.professor !== null);
        const formattedModules = filteredModules.map(module => ({
          moduleName: module.moduleName,
          professorName: `${module.professor.firstName} ${module.professor.lastName}`,
          moduleId: module.moduleId,
          levelId: module.level.levelId,
          professorId: module.professor.professorId,
        }));
        setModules(formattedModules);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    fetchStudentsByLevelName();
    fetchModulessByLevelName();
  }, [abr]);

  const handleModuleClick = (moduleId, levelId, moduleName, professorId) => {
    setSelectedModuleId(moduleId);
    setSelectedLevelId(levelId);
    setSelectedModuleName(moduleName);
    setSelectedProfessorId(professorId);
    setSnackbarMessage(`Module sélectionné : ${moduleName}`);
    setSnackbarOpen(true);
    setActiveModuleId(moduleId);
    // Scroll to absence list 
    if (samplePageRef.current) {
      samplePageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} marginTop="16px">
        <Grid container spacing={gridSpacing} justifyContent="center">
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} abr={abr} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} marginTop="16px">
        <Grid container spacing={gridSpacing}>
          {modules.map((module) => (
            <Grid item lg={4} md={6} sm={6} xs={12} key={module.moduleId}>
              <Module
                isLoading={isLoading}
                name={module.moduleName}
                professor={{
                  id: module.professorId,
                  name: module.professorName,
                }}
                levelId={module.levelId}
                isActive={activeModuleId === module.moduleId}
                onClick={() => handleModuleClick(module.moduleId, module.levelId, module.moduleName, module.professorId)}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} marginTop="16px" lg={12} ref={samplePageRef}>
        {selectedModuleId && (
          <>
            <Divider sx={{ margin: '16px 0', backgroundColor: 'primary.main', height: '2px' }} />
            <SamplePage moduleId={selectedModuleId} levelId={selectedLevelId} professorId={selectedProfessorId} />
          </>
        )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="info" onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Filieres;
