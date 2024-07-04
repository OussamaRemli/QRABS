import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, ButtonGroup, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import TotalIncomeLightCard from '../dashboard/Default/TotalIncomeLightCard';
import { gridSpacing } from 'store/constant';
import './departments.css';

const modulesColumns = [
  { field: 'intituleModule', headerName: 'Intitulé module', flex: 0.35 ,headerAlign: 'center',  renderCell: (params) => <div className="center-text">{params.value}</div>},
  { field: 'moduleName', headerName: 'Element de module', flex: 0.35 ,headerAlign: 'center', renderCell: (params) => <div className="center-text">{params.value}</div>},
  { field: 'level', headerName: 'Niveau', flex: 0.3 ,headerAlign: 'center', renderCell: (params) => <div className="center-text">{params.value}</div>}
];


const professorsColumns = [
  { field: 'Prénom', headerName: 'First Name', flex: 0.25,headerAlign: 'center',  renderCell: (params) => <div className="center-text">{params.value}</div> },
  { field: 'Nom', headerName: 'Last Name', flex: 0.25,headerAlign: 'center',  renderCell: (params) => <div className="center-text">{params.value}</div>},
  { field: 'Email', headerName: 'Email', flex: 0.5,headerAlign: 'center',  renderCell: (params) => <div className="center-text">{params.value}</div> },
];

const Departement = ({ name, abr }) => {
  const [modules, setModules] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules');

  const fetchProfessorsByDepartment = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/department/${name}`);
      const formattedProfessors = response.data.map(professor => ({
        professorId: professor.professorId,
        Prénom: professor.firstName,
        Nom: professor.lastName,
        Email: professor.email,
      }));
      setProfessors(formattedProfessors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching professors:', error);
    }
  };

  const fetchModulesByDepartment = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/modules/department/${name}`);
      const formattedModules = response.data.map(module => ({
        moduleId: module.moduleId,
        moduleName: module.moduleName,
        intituleModule: module.intituleModule,
        level: module.level.levelName,
      }));
      setModules(formattedModules);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  useEffect(() => {
    fetchModulesByDepartment();
    fetchProfessorsByDepartment();
  }, [name]);

  if (!localStorage.getItem('token')) return null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
   
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} className="card">
          <TotalIncomeLightCard isLoading={isLoading} abr={abr} name={name} />
        </Grid>

        <div className="buttons">
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button onClick={() => handleTabChange('modules')} className={activeTab === 'modules' ? 'active' : ''}>
              Voir Modules
            </Button>
            <Button onClick={() => handleTabChange('professors')} className={activeTab === 'professors' ? 'active' : ''}>
              Voir Professeurs
            </Button>
          </ButtonGroup>
        </div>

        <Grid item lg={12} xs={12} md={8} className="data-grid">
          {activeTab === 'modules' && (
            <div style={{ height: '100%', width: '100%' }}>
              <DataGrid
                loading={isLoading}
                rows={modules}
                columns={modulesColumns}
                pageSize={5}
                getRowId={(row) => row.moduleId}
              />
            </div>
          )}
          {activeTab === 'professors' && (
            <div style={{ height: '100%', width: '100%' }}>
              <DataGrid
                loading={isLoading}
                rows={professors}
                columns={professorsColumns}
                pageSize={5}
                getRowId={(row) => row.professorId}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Departement;
