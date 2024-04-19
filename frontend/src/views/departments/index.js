import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';


// material-ui
import { Grid,Box,TextField,Typography,Divider,Select,MenuItem,InputLabel } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { DataGrid } from '@mui/x-data-grid';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';

// project imports

import TotalIncomeLightCard from '../dashboard/Default/TotalIncomeLightCard';
import TotalGrowthBarChart from '../dashboard/Default/TotalGrowthBarChart';
import TotalIncomeDarkCard from '../dashboard/Default/TotalIncomeDarkCard';
import PopularCard from '../dashboard/Default/PopularCard';
import { gridSpacing } from 'store/constant';
import { flexbox } from '@mui/system';
import { red } from '@mui/material/colors';

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
//---------------------------
const modulesColumns = [
  { field: 'moduleId', headerName: 'ID', width: 100 },
  { field: 'moduleName', headerName: 'Module Name', width: 200 },
  { field: 'departmentName', headerName: 'Department', width: 200 },
  { field: 'intituleModule', headerName: 'Intitule Module', width: 200 },
  { field: 'NameByDepartment', headerName: 'Name By Department', width: 200 },
  { field: 'professorFirstName', headerName: 'Professor First Name', width: 200 },
  { field: 'professorLastName', headerName: 'Professor Last Name', width: 200 },
  { field: 'level', headerName: 'Level', width: 200 },
];

const professorsColumns = [
  { field: 'professorId', headerName: 'ID', width: 100 },
  { field: 'firstName', headerName: 'First Name', width: 160 },
  { field: 'lastName', headerName: 'Last Name', width: 160 },
  { field: 'fullName', headerName: 'Full name', width: 200, valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`},
];

const Departement = ({name,desc}) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const [modules, setModules] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [allProfessors, setAllProfessors] = useState([]);
  const [levels, setLevels] = useState([]);
  const [departmentId, setDepartmentId] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [password, setPassword] = useState('');
  const [levelId, setLevelId] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules');
  const [newModuleName, setNewModuleName] = useState('');
  const [newIntituleModule, setNewIntituleModule] = useState('');
  const [newNameByDepartment, setNewNameByDepartment] = useState('');
  const [newProfessorFirstName, setNewProfessorFirstName] = useState('');
  const [newProfessorLastName, setNewProfessorLastName] = useState('');
  const [newProfessorEmail, setNewProfessorEmail] = useState('');

  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [showAddProfessorForm, setShowAddProfessorForm] = useState(false);
  // Fonction pour afficher ou masquer le formulaire d'ajout de module
  const toggleAddModuleForm = () => {
    setShowAddModuleForm(!showAddModuleForm);
  };

  // Fonction pour afficher ou masquer le formulaire d'ajout de professeur
  const toggleAddProfessorForm = () => {
    setShowAddProfessorForm(!showAddProfessorForm);
  };

  // Fonction pour récupérer les professeurs par le nom du département
  const fetchProfessorsByDepartment = async () => {
    try {
      const response = await axios.get(`http://localhost:8011/api/professors/department/${name}`);
      const formattedProfessors = response.data.map(professor => ({
        professorId: professor.professorId,
        firstName: professor.firstName,
        lastName: professor.lastName
      }));
      setProfessors(formattedProfessors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching professors:', error);
    }
  };
  // Fonction pour récupérer les modules par le nom du département
  const fetchModulesByDepartment = async () => {
    try {
      const response = await axios.get(`http://localhost:8011/api/modules/department/${name}`);
      console.log(response.data)
      const formattedModules = response.data.map(module => ({
        moduleId: module.moduleId,
        moduleName: module.moduleName,
        departmentName: module.department.departmentName,
        intituleModule: module.intituleModule,
        NameByDepartment: module.nameByDepartment,
        professorFirstName: module.professor.firstName,
        professorLastName: module.professor.lastName,
        level: module.level.levelName,
      }));
      setModules(formattedModules);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };
  useEffect(() => {

    // Fonction pour récupérer tous les professeurs (pour le formulaire)
    const fetchProfessors = async () => {
      try {
        const response = await axios.get(`http://localhost:8011/api/professors/all`);
        const formattedProfessors = response.data.map(professor => ({
          professorId: professor.professorId,
          firstName: professor.firstName,
          lastName: professor.lastName,
        }));
        setAllProfessors(formattedProfessors);
      } catch (error) {
        console.error('Error fetching professors:', error);
      }
    };
    // Fonction pour récupérer les niveaux
    const fetchLevels = async () => {
      try {
        const response = await axios.get(`http://localhost:8011/api/levels`);
        const formattedLevels = response.data.map(level => ({
          levelId: level.levelId,
          levelName: level.levelName,
        }));
        setLevels(formattedLevels);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };

    // Appeler les fonctions pour récupérer les données
    fetchModulesByDepartment();
    fetchProfessorsByDepartment();
    fetchProfessors();
    fetchLevels();
    
  }, [name]);


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Afficher ou masquer les formulaires d'ajout en fonction de l'onglet sélectionné
    if (tab === 'modules') {
      setShowAddModuleForm(false);
      setShowAddProfessorForm(false);
    } else if (tab === 'professors') {
      setShowAddProfessorForm(false);
      setShowAddModuleForm(false);
    }
  };
  const getModuleRowId = (module) => {
    return `${module.moduleId}-${module.departmentName}`;
  };
  const getProfessorRowId = (professor) => `${professor.professorId}-${professor.department}`;
  const handleDepartmentChange = (event) => {
    setDepartmentId(event.target.value);
  };
  const handleProfessorChange = (event) => {
    setProfessorId(event.target.value);
  };
  const handleLevelChange = (event) => {
    setLevelId(event.target.value);
  };


  const handleModuleAdd = async () => {
    try {
      const moduleData = {
        moduleName: newModuleName,
        department: {
          departmentId: departmentId
        },
        intituleModule: newIntituleModule,
        professor: {
          professorId: professorId
        },
        level: {
          levelId: levelId
        },
        nameByDepartment: newNameByDepartment
      };
      await axios.post('http://localhost:8011/api/modules', moduleData);
      // Refresh modules list after adding
      fetchModulesByDepartment();
      setNewModuleName('');
      setNewIntituleModule('');
      setNewNameByDepartment('');
    } catch (error) {
      console.error('Error adding module:', error);
    }
  };

  const handleProfessorAdd = async () => {
    try {
      // Créer un objet contenant les données à envoyer
      const professorData = {
        firstName: newProfessorFirstName,
        lastName: newProfessorLastName,
        email: newProfessorEmail,
        password: password,
        role: "ROLE_PROFESSOR",
        department: {
          departmentId: departmentId
        }
      };
  
      // Envoyer les données au backend avec Axios
      await axios.post('http://localhost:8011/api/professors', professorData);
  
      // Actualiser la liste des professeurs après l'ajout
      fetchProfessorsByDepartment();
  
      // Réinitialiser les champs du formulaire après l'ajout
      setNewProfessorFirstName('');
      setNewProfessorLastName('');
      setNewProfessorEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error adding professor:', error);
    }
  };
  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  // Function to handle importing modules from the selected file
  const handleImportModules = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://localhost:8011/api/modules/upload', formData)
        .then((response) => {
          console.log('modules uploaded:', response.data);
        })
        .catch((error) => {
          console.error('Error uploading modules:', error);
        });
    }
  };
  // Function to handle importing professors from the selected file
  const handleImportProfessors = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://localhost:8011/api/professors/upload', formData)
        .then((response) => {
          console.log('professors uploaded:', response.data);
        })
        .catch((error) => {
          console.error('Error uploading professors:', error);
        });
    }
  };


  if (!localStorage.getItem('token')) return null;
  return (
    <Grid container spacing={gridSpacing}>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={12} md={6} sm={6} xs={12}>
            <TotalIncomeLightCard isLoading={isLoading} desc={desc} name={name} />
          </Grid>
          {/* <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid> */}
          <Grid item lg={12} md={6} sm={6} xs={12} justifyContent={'center'}>
            {/* <TotalOrderLineChartCard isLoading={isLoading} />*/}
            <Stack direction="row" spacing={3} justifyContent={'center'}>
            <Button color="secondary" size="large" variant={activeTab === 'modules' ? 'contained' : 'outlined'} onClick={() => handleTabChange('modules')} >Voir Modules</Button>
            <Button color="secondary" size="large" variant={showAddModuleForm ? 'contained' : 'outlined'} onClick={toggleAddModuleForm}>Ajouter Module</Button>
            <Button color="secondary" size="large" variant={activeTab === 'professors' ? 'contained' : 'outlined'} onClick={() => handleTabChange('professors')} >Voir Professeurs</Button>
            <Button color="secondary" size="large" variant={showAddProfessorForm ? 'contained' : 'outlined'} onClick={toggleAddProfessorForm}>Ajouter Professeur</Button>
            </Stack>
          </Grid>
          <Grid item lg={showAddModuleForm || showAddProfessorForm ? 8 : 12} xs={12} md={8}>
              {/* <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                />
            </div> */}
            {activeTab === 'modules' && (
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  loading={isLoading}
                  rows={modules} // Utilisez la variable d'état des modules
                  columns={modulesColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  getRowId={getModuleRowId}
                  checkboxSelection
                />
              </div>
                )}
            {activeTab === 'professors' && (
              <div style={{ height: '100%', width: '100%' }}>
                <DataGrid
                  loading={isLoading}
                  rows={professors} // Utilisez la variable d'état des professeurs
                  columns={professorsColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  getRowId={getProfessorRowId}
                  checkboxSelection
                />
              </div>
            )}
          </Grid>
          {/* <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid> */}
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing} justifyContent={'center'}>
                      {showAddModuleForm  && (
                      <Grid item lg={12} sm={6} xs={12} md={6}>
                        {/* <TotalIncomeDarkCard isLoading={isLoading} /> */}
                        <Box
                            component="form"
                            sx={{
                              '& > :not(style)': { m: 1, },
                            }}
                            noValidate
                            padding={'20px 10px 20px 10px'}
                            boxShadow={'0px 4px 12px rgba(0, 0, 0, 0.1)'}
                            width={'100%'}
                            autoComplete="off"
                            bgcolor={'#fff'}
                            borderRadius={'20px'}
                            display={'flex'}
                            flexDirection={'column'}
                          >  
                          <Typography variant="h4" color="primary" textAlign={'center'}>Ajouter modules via Excel</Typography>
                          <Grid container direction="column" justifyContent="center" spacing={0}>
                          <Grid item lg={12} textAlign={'center'} style={{ marginLeft: '-20px' }}>
                                <input
                                  type="file"
                                  accept=".xls,.xlsx"
                                  onChange={(e) => {
                                    handleFileChange(e); // Appeler la fonction handleFileChange existante si nécessaire
                                    handleImportModules(); // Appeler la fonction handleImportModuless lorsqu'un fichier est sélectionné
                                  }}
                                  style={{ display: 'none' }}
                                  id="file-upload"
                                />
                                <label htmlFor="file-upload" >
                                  <Button component="span" startIcon={<GetAppTwoToneIcon sx={{ mr: 1.75 }} />} sx={{ color: theme.palette.grey[500] }} >
                                    Import Liste Des Modules
                                  </Button>
                                </label>
                            </Grid>
                            <Grid item xs={12} lg={12}>
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex'
                                }}
                                marginLeft={'-16px'}
                              >
                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                                <Button
                                  variant="outlined"
                                  sx={{
                                    cursor: 'unset',
                                    m: 2,
                                    py: 0.5,
                                    px: 7,
                                    borderColor: `${theme.palette.grey[100]} !important`,
                                    color: `${theme.palette.grey[800]}!important`,
                                    fontWeight: 500,
                                    borderRadius: `${customization.borderRadius}px`
                                  }}
                                  disableRipple
                                  disabled
                                >
                                  OR
                                </Button>
                                <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                              </Box>
                            </Grid>
                          </Grid>
                            <Typography variant="h4" color="primary" textAlign={'center'}>Ajouter module</Typography>
                            <TextField id="standard-basic" label="Nom De Module" variant="standard" onChange={(e) => setNewModuleName(e.target.value)}/>
                            <TextField id="standard-basic" label="Intitulé De Module" variant="standard" onChange={(e) => setNewIntituleModule(e.target.value)}/>
                            <TextField id="standard-basic" label="Nom By Département" variant="standard" onChange={(e) => setNewNameByDepartment(e.target.value)}/>
                            <Select
                              id="department-id"
                              value={departmentId}
                              onChange={handleDepartmentChange}
                              labelId="department-select-label"
                              variant="standard"
                              displayEmpty
                            >
                              <MenuItem value="" disabled>Sélectionner le département</MenuItem>
                              <MenuItem value={1}>MMA</MenuItem>
                              <MenuItem value={2}>EIT</MenuItem>
                              <MenuItem value={3}>LC</MenuItem>
                            </Select>
                            <Select
                              id="professor-id"
                              value={professorId}
                              onChange={handleProfessorChange}
                              labelId="professor-select-label"
                              variant="standard"
                              displayEmpty
                            >
                              <MenuItem value="" disabled>Sélectionner le professeur</MenuItem>
                              {allProfessors.map(professor => (
                                <MenuItem key={professor.professorId} value={professor.professorId}>{`${professor.firstName} ${professor.lastName}`}</MenuItem>
                              ))}
                            </Select>
                            <Select
                              id="level-id"
                              value={levelId}
                              onChange={handleLevelChange}
                              labelId="level-select-label"
                              variant="standard"
                              displayEmpty
                            >
                              <MenuItem value="" disabled>Sélectionner le niveau</MenuItem>
                              {levels.map(level => (
                                <MenuItem key={level.levelId} value={level.levelId}>{level.levelName}</MenuItem>
                              ))}
                            </Select>
                            <Button variant="outlined" color="primary" style={{marginTop:'30px'}} onClick={handleModuleAdd}>Ajouter</Button>
                        </Box>
                      </Grid>)}

                      {showAddProfessorForm  && (
                      <Grid item sm={6} xs={12} md={6} lg={12} >
                        {/* <TotalIncomeLightCard isLoading={isLoading} /> */}
                        <Box
                            component="form"
                            sx={{
                              '& > :not(style)': { m: 1, },
                            }}
                            noValidate
                            boxShadow={'0px 4px 12px rgba(0, 0, 0, 0.1)'}
                            padding={'20px 10px 20px 10px'}
                            width={'100%'}
                            autoComplete="off"
                            bgcolor={'#fff'}
                            borderRadius={'20px'}
                            display={'flex'}
                            flexDirection={'column'}
                          > 
                            <Typography variant="h4" color="primary" textAlign={'center'}>Ajouter professeurs via Excel</Typography>
                            <Grid container direction="column" justifyContent="center" spacing={0}>
                              <Grid item lg={12} textAlign={'center'} style={{ marginLeft: '-20px' }}>
                                <input
                                  type="file"
                                  accept=".xls,.xlsx"
                                  onChange={(e) => {
                                    handleFileChange(e); // Appeler la fonction handleFileChange existante si nécessaire
                                    handleImportProfessors(); // Appeler la fonction handleImportProfessors lorsqu'un fichier est sélectionné
                                  }}
                                  style={{ display: 'none' }}
                                  id="file-upload"
                                />
                                <label htmlFor="file-upload" >
                                  <Button component="span" startIcon={<GetAppTwoToneIcon sx={{ mr: 1.75 }} />} sx={{ color: theme.palette.grey[500] }} >
                                    Import Liste Des Professeurs
                                  </Button>
                                </label>
                              </Grid>
                              <Grid item xs={12} lg={12}>
                                <Box
                                  sx={{
                                    alignItems: 'center',
                                    display: 'flex'
                                  }}
                                  marginLeft={'-16px'}
                                >
                                  <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                                  <Button
                                    variant="outlined"
                                    sx={{
                                      cursor: 'unset',
                                      m: 2,
                                      py: 0.5,
                                      px: 7,
                                      borderColor: `${theme.palette.grey[100]} !important`,
                                      color: `${theme.palette.grey[900]}!important`,
                                      fontWeight: 500,
                                      borderRadius: `${customization.borderRadius}px`
                                    }}
                                    disableRipple
                                    disabled
                                  >
                                    OR
                                  </Button>
                                  <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                </Box>
                              </Grid>
                            </Grid>
                            <Typography variant="h4" color="primary" textAlign={'center'}>Ajouter Professeur</Typography>
                            <TextField id="standard-basic" label="Nom " variant="standard" onChange={(e) => setNewProfessorLastName(e.target.value)} />
                            <TextField id="standardstandard-basic" label="Prénom" variant="standard" onChange={(e) => setNewProfessorFirstName(e.target.value)}/>
                            <TextField id="standardstandard-basic" label="Email"standard variant="standard" onChange={(e) => setNewProfessorEmail(e.target.value)}/>
                            <TextField id="standard-password-input" label="Password" type="password" autoComplete="current-password" variant="standard" onChange={(e) => setPassword(e.target.value)}/>
                            {/* <TextField id="standardstandard-basic" label="ID De Departement" variant="standard" /> */}
                            <Select
                              id="professor-department-id"
                              value={departmentId}
                              onChange={handleDepartmentChange}
                              labelId="department-select-label"
                              variant="standard"
                              displayEmpty
                            >
                              <MenuItem value="" disabled>Sélectionner le département</MenuItem>
                              <MenuItem value={1}>MMA</MenuItem>
                              <MenuItem value={2}>EIT</MenuItem>
                              <MenuItem value={3}>LC</MenuItem>
                            </Select>
                            <Button variant="outlined" color="primary" style={{marginTop:'30px'}} onClick={handleProfessorAdd}>Ajouter</Button>
                        </Box>
                      </Grid>)}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* <Grid item xs={12} md={8}>
            <TotalGrowthBarChart isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularCard isLoading={isLoading} />
          </Grid> */}
          <Grid item lg={12} xs={12} md={8}>
            
        </Grid>
      </Grid>
      </Grid>
    </Grid>
  );
};

export default Departement;
