import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Snackbar,
  Alert,
  createTheme,
  ThemeProvider,
  Select,
  MenuItem,
  Input,
  FormControl,
  TextField,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Search as SearchIcon } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f4f6f8', paper: '#fff' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

const ProfessorListDialog = ({ open, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [editingProfessorId, setEditingProfessorId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

  useEffect(() => {
    if (selectedDepartment) {
      fetchProfessorsByDepartment(selectedDepartment);
    }
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/departments`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setNotification({ open: true, message: 'Erreur lors de la récupération des départements', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessorsByDepartment = async (departmentName) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/department/${departmentName}`);
      const professorsWithId = response.data.map((professor) => ({
        ...professor,
        id: professor.professorId,
        photoURL: null,
      }));
      setProfessors(professorsWithId);
    } catch (error) {
      console.error('Error fetching professors:', error);
      setNotification({ open: true, message: 'Erreur lors de la récupération des professeurs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleEditProfessor = (id) => {
    setEditingProfessorId(id);
  };

  const handleSaveChanges = async (id) => {
    const professorToSave = professors.find((professor) => professor.id === id);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/${id}`,
        professorToSave
      );

      if (response.status === 200) {
        const updatedProfessor = response.data;
        setProfessors((prevProfessors) =>
          prevProfessors.map((professor) =>
            professor.id === id ? { ...professor, ...updatedProfessor } : professor
          )
        );
        setEditingProfessorId(null);
        setNotification({ open: true, message: 'Professeur mis à jour avec succès', severity: 'success' });
      } else {
        throw new Error('Échec de la mise à jour du professeur');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des modifications:', error);
      if (error.response && error.response.status === 404) {
        setNotification({ open: true, message: 'Professeur non trouvé pour la mise à jour', severity: 'error' });
      } else {
        setNotification({ open: true, message: 'Échec de la mise à jour du professeur', severity: 'error' });
      }
    }
  };

  const handleDeleteProfessor = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_SPRING_BASE_URL}/api/professors/${id}`);

      if (response.status === 200) {
        setProfessors((prevProfessors) =>
          prevProfessors.filter((professor) => professor.id !== id)
        );

        setNotification({ open: true, message: 'Professeur supprimé avec succès', severity: 'success' });
      } else {
        throw new Error('Échec de la suppression du professeur');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du professeur:', error);

      if (error.response && error.response.status === 404) {
        setNotification({ open: true, message: 'Professeur non trouvé pour la suppression', severity: 'error' });
      } else {
        setNotification({ open: true, message: 'Échec de la suppression du professeur', severity: 'error' });
      }
    }
  };

  const handleFieldChange = (id, field, value) => {
    setProfessors((prevProfessors) =>
      prevProfessors.map((professor) =>
        professor.id === id ? { ...professor, [field]: value } : professor
      )
    );
  };

  const columns = [
    {
      field: 'firstName',
      headerName: 'Prénom',
      flex: 0.2,
      renderCell: (params) =>
        editingProfessorId === params.row.id ? (
          <Input
            value={params.row.firstName}
            onChange={(e) => handleFieldChange(params.row.id, 'firstName', e.target.value)}
            disableUnderline
            sx={{
              fontSize: 'inherit',
              padding: 0,
              border: 'none',
              outline: 'none',
              '& .MuiInputBase-input': {
                fontSize: 'inherit',
              },
            }}
          />
        ) : (
          params.value
        ),
    },
    {
      field: 'lastName',
      headerName: 'Nom',
      flex: 0.2,
      renderCell: (params) =>
        editingProfessorId === params.row.id ? (
          <Input
            value={params.row.lastName}
            onChange={(e) => handleFieldChange(params.row.id, 'lastName', e.target.value)}
            disableUnderline
            sx={{
              fontSize: 'inherit',
              padding: 0,
              border: 'none',
              outline: 'none',
              '& .MuiInputBase-input': {
                fontSize: 'inherit',
              },
            }}
          />
        ) : (
          params.value
        ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 0.3,
      renderCell: (params) =>
        editingProfessorId === params.row.id ? (
          <Input
            value={params.row.email}
            onChange={(e) => handleFieldChange(params.row.id, 'email', e.target.value)}
            disableUnderline
            sx={{
              fontSize: 'inherit',
              padding: 0,
              border: 'none',
              outline: 'none',
              '& .MuiInputBase-input': {
                fontSize: 'inherit',
              },
            }}
          />
        ) : (
          params.value
        ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {editingProfessorId === params.row.id ? (
            <>
              <IconButton
                aria-label="save"
                onClick={() => handleSaveChanges(params.row.id)}
                sx={{ color: theme.palette.primary.main }}
              >
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="cancel"
                onClick={() => setEditingProfessorId(null)}
                sx={{ color: theme.palette.secondary.main }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                aria-label="edit"
                onClick={() => handleEditProfessor(params.row.id)}
                sx={{ color: theme.palette.primary.main }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="delete"
                onClick={() => handleDeleteProfessor(params.row.id)}
                sx={{ color: theme.palette.error.main }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </div>
      ),
    },
  ];

  const filteredProfessors = professors.filter((professor) =>
    `${professor.firstName} ${professor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Liste des Professeurs
          <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <Select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  displayEmpty
                  input={<Input />}
                  renderValue={(selected) => (selected ? selected : 'Sélectionner un département')}
                  disableUnderline
                >
                  {departments.map((department) => (
                    <MenuItem key={department.departmentId} value={department.departmentName}>
                      {department.departmentName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rechercher un professeur"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  endAdornment: <SearchIcon />,
                }}
              />
            </Grid>
          </Grid>

          <div style={{ height: 400, width: '100%', marginTop: 16 }}>
            <DataGrid
              rows={filteredProfessors}
              columns={columns}
              loading={loading}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" variant="contained">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default ProfessorListDialog;
