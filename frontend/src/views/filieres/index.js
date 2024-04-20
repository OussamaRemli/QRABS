import { useEffect, useState } from 'react';
import axios from 'axios';


// material-ui
import { Grid} from '@mui/material';
// import { Grid,Box,TextField,Typography,Divider } from '@mui/material';

// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';

// project imports
import EarningCard from '../dashboard/Default/EarningCard';
import Module from './Module';
//import UpgradePlanCard from '../../layout/MainLayout/Header/ProfileSection/UpgradePlanCard';
// import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
// import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';

// ==============================|| DEFAULT DASHBOARD ||============================== //
// const columns = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'firstName', headerName: 'First name', width: 130 },
//   { field: 'lastName', headerName: 'Last name', width: 130 },
//   {
//     field: 'age',
//     headerName: 'Age',
//     type: 'number',
//     width: 90,
//   },
//   {
//     field: 'fullName',
//     headerName: 'Full name',
//     description: 'This column has a value getter and is not sortable.',
//     sortable: false,
//     width: 160,
//     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
//   },
// ];

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

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

  useEffect(() => {
    // Fonction pour récupérer les modules par le nom du département
    const fetchStudentsByLevelName = async () => {
      try {
        const response = await axios.get(`http://localhost:8011/api/students/${abr}`);
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

    // Fonction pour récupérer les modules par le nom du département
    const fetchModulessByLevelName = async () => {
      try {
        const response = await axios.get(`http://localhost:8011/api/modules/levelName/${abr}`);
        console.log(response.data)
        const formattedModules = response.data.map(module => ({
          moduleName: module.moduleName,
          professorName: `${module.professor.firstName} ${module.professor.lastName}`
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

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} marginTop={'16px'}>
        <Grid container spacing={gridSpacing} justifyContent={'center'}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} name={name} abr={abr}/>
          </Grid>
          {/* <Grid item lg={10} md={6} sm={6} xs={12}>
            <div style={{ height: 400, width: '80%'}}>
                <DataGrid
                  rows={students}
                  columns={studentsColumns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
            </div>
          </Grid> */}
          {/* <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeDarkCard isLoading={isLoading} />
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <TotalIncomeLightCard isLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>
      </Grid>
      <Grid item xs={12} marginTop={'16px'}>
        <Grid container spacing={gridSpacing}>
        {modules.map((module) => (
          <Grid item lg={4} md={6} sm={6} xs={12}>
                <Module key={module.moduleId} isLoading={isLoading} name={module.moduleName} professor={module.professorName}/>
          </Grid>
          ))}
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
        
        <Grid item lg={6} md={6} sm={6} xs={12}>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default Filieres;
