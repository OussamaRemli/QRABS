import { useEffect, useState } from 'react';
import axios from 'axios';


// material-ui
import { Grid, Typography,Divider} from '@mui/material';
import Loadable from 'ui-component/Loadable';
import { lazy } from 'react';
// import { Grid,Box,TextField,Typography,Divider } from '@mui/material';
import {Button,Snackbar,Alert  } from '@mui/material';

// project imports
import EarningCard from '../dashboard/Default/EarningCard';
import Module from './Module';
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
import { gridSpacing } from 'store/constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const studentsColumns = [
  { field: 'studentApogee', headerName: 'Apogee', width: 100 },
  { field: 'studentFirstName', headerName: 'First Name', width: 150 },
  { field: 'studentLastName', headerName: 'Last Name', width: 150 },
  { field: 'studentGroup', headerName: 'Groupe', width: 150 },
];


const Filieres = ({name,abr}) => {
  const [isLoading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedModuleName, setSelectedModuleName] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [selectedProfessorId, setSelectedProdessorId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [activeModuleId, setActiveModuleId] = useState(null);
  

  useEffect(() => {
    // Fonction pour récupérer les modules par le nom du département
    const fetchStudentsByLevelName = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/students/${abr}`);
        const formattedStudents = response.data.map((student,index) => ({
          id: index + 1, // Générer un identifiant unique en utilisant l'index
          studentApogee: student.apogee,
          studentFirstName: student.firstName,
          studentLastName: student.lastName,
          studentGroup: student.groupName
        }));
        setStudents(formattedStudents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    // Fonction pour récupérer les modules par levelName
    const fetchModulessByLevelName = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/modules/levelName/${abr}`);
        const formattedModules = response.data.map(module => ({
          moduleName: module.moduleName,
          professorName: `${module.professor.firstName} ${module.professor.lastName}`,
          moduleId: module.moduleId,
          levelId:module.level.levelId,
          professorId:module.professor.professorId
        }));
        setModules(formattedModules);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    // Appeler la fonction pour récupérer les données
    fetchStudentsByLevelName();
    fetchModulessByLevelName();
  }, [abr]);
  const handleModuleClick = (moduleId, levelId,moduleName,professorId) => {
    setSelectedModuleId(moduleId);
    setSelectedLevelId(levelId);
    setSelectedModuleName(moduleName);
    setSelectedProdessorId(professorId);
    // Ouvrir le Snackbar avec le nom du module sélectionné
    setSnackbarMessage(`Module sélectionné : ${moduleName}`);
    setSnackbarOpen(true);
    setActiveModuleId(moduleId);
  };
  // Fonction pour fermer le Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} marginTop={'16px'}>
        <Grid container spacing={gridSpacing} justifyContent={'center'}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={name} abr={abr}/>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} marginTop={'16px'}>
        <Grid container spacing={gridSpacing}>
        {modules.map((module) => (
          <Grid item lg={4} md={6} sm={6} xs={12}>
                <Module 
                  key={module.moduleId} 
                  isLoading={isLoading} 
                  name={module.moduleName} 
                  professor={module.professorName}
                  isActive={activeModuleId === module.moduleId}
                  onClick={() => handleModuleClick(module.moduleId, module.levelId,module.moduleName,module.professorId)}
                />
          </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} marginTop={'16px'} lg={12}>
        {selectedModuleId &&
        <>
          <Divider sx={{ margin: '16px 0', backgroundColor: 'primary.main', height: '2px'  }} />
          <SamplePage moduleId={selectedModuleId} levelId={selectedLevelId} professorId={selectedProfessorId} />
        </>
        }
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="info" onClose={handleCloseSnackbar}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default Filieres;
