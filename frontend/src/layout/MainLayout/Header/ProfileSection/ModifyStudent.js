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
  InputLabel,
  FormControl,
  Avatar,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import '../../../../assets/scss/style.css';
import Input from '@mui/material/Input';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f4f6f8', paper: '#fff' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

const StudentListDialog = ({ open, onClose }) => {
  const [levels, setLevels] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('GINF3');
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    if (selectedLevel) fetchStudentsByLevel(selectedLevel);
  }, [selectedLevel]);

  const fetchLevels = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels`);
      setLevels(response.data);
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByLevel = async (level) => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/level/name/${level}`);
      const studentsWithId = response.data.map((student) => ({
        ...student,
        id: student.apogee,
        photoURL: null,
      }));
      setStudents(studentsWithId);

      await Promise.all(
        studentsWithId.map(async (student) => {
          try {
            const imageResponse = await fetch(
              `${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/image/${student.apogee}`
            );
            if (!imageResponse.ok) {
              throw new Error('Image not found');
            }
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            setStudents((prevStudents) =>
              prevStudents.map((user) => {
                if (user.apogee === student.apogee) {
                  return { ...user, photoURL: imageUrl };
                }
                return user;
              })
            );
          } catch (error) {
            console.error('Error fetching image data:', error);
          }
        })
      );
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const handleEditStudent = (id) => {
    setEditingStudentId(id);
  };

  const handleSaveChanges = async (apogee) => {
    const studentToSave = students.find((student) => student.id === apogee);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SPRING_BASE_URL}/api/students/update/${apogee}`,
        studentToSave
      );

      if (response.status === 200) {
        const updatedStudent = response.data; // Assuming backend returns updated student object with all fields
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === apogee ? { ...student, ...updatedStudent } : student
          )
        );
        setEditingStudentId(null);
        setNotification({ open: true, message: 'Étudiant mis à jour avec succès', severity: 'success' });
      } else {
        throw new Error('Échec de la mise à jour de l\'étudiant');
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des modifications:', error);
      if (error.response && error.response.status === 404) {
        setNotification({ open: true, message: 'Étudiant non trouvé pour la mise à jour', severity: 'error' });
      } else {
        setNotification({ open: true, message: 'Échec de la mise à jour de l\'étudiant', severity: 'error' });
      }
    }
  };

  const handleDeleteStudent = async (apogee) => {
    try {
      console.log(`Suppression de l'étudiant avec l'apogée ${apogee}`);

      const response = await axios.delete(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/delete/${apogee}`);

      if (response.status === 200) {
        console.log('Étudiant supprimé avec succès:', response.data);

        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.apogee !== apogee)
        );

        setNotification({ open: true, message: 'Étudiant supprimé avec succès!', severity: 'success' });
      } else {
        throw new Error('Échec de la suppression de l\'étudiant');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'étudiant:', error);

      if (error.response && error.response.status === 404) {
        setNotification({ open: true, message: 'Étudiant non trouvé pour la suppression', severity: 'error' });
      } else {
        setNotification({ open: true, message: 'Échec de la suppression de l\'étudiant', severity: 'error' });
      }
    }
  };

  const handleFieldChange = (id, field, value) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, [field]: value } : student
      )
    );
  };

  const columns = [
    {
      field: 'photoURL',
      headerName: 'Avatar',
      width: 100,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Avatar sx={{ width: 50, height: 50 }} src={params.row.photoURL} />
        </div>
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: 'apogee',
      headerName: 'Apogee',
      flex: 0.2,
      renderCell: (params) =>
        editingStudentId === params.row.id ? (
          <Input
            value={params.row.apogee}
            onChange={(e) => handleFieldChange(params.row.id, 'apogee', e.target.value)}
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
      field: 'firstName',
      headerName: 'Prénom',
      flex: 0.2,
      renderCell: (params) =>
        editingStudentId === params.row.id ? (
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
        editingStudentId === params.row.id ? (
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
      flex: 0.5,
      renderCell: (params) =>
        editingStudentId === params.row.id ? (
          <Input
            value={params.row.email}
            onChange={(e) => handleFieldChange(params.row.id, 'email', e.target.value)}
            disableUnderline
            sx={{
              fontSize: 'inherit',
              padding: 0,
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
      field: 'groupName',
      headerName: 'Groupe',
      flex: 0.2,
      renderCell: (params) =>
        editingStudentId === params.row.id ? (
          <Input
            value={params.row.groupName}
            onChange={(e) => handleFieldChange(params.row.id, 'groupName', e.target.value)}
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
      flex: 0.2,
      renderCell: (params) =>
        editingStudentId === params.row.id ? (
          <>
            <IconButton
              color="primary"
              onClick={() => handleSaveChanges(params.row.apogee)}
              size="small"
              sx={{ marginRight: 1 }}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => setEditingStudentId(null)}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              color="primary"
              onClick={() => handleEditStudent(params.row.id)}
              size="small"
              sx={{ marginRight: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => handleDeleteStudent(params.row.apogee)}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Liste des Étudiants
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <FormControl  sx={{ marginBottom: 2 }}>
            <InputLabel>Niveau</InputLabel>
            <Select  value={selectedLevel} onChange={handleLevelChange} label="Niveau">
              {levels.map((level) => (
                <MenuItem key={level.levelId} value={level.levelName}>
                  {level.levelName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        

          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={students}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
              hideFooter
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" variant="contained">
            Fermer
          </Button>
        </DialogActions>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Dialog>
    </ThemeProvider>
  );
};

export default StudentListDialog;
