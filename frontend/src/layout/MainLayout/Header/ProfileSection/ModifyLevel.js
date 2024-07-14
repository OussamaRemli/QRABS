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
  TextField,
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

const ModifyLevel = ({ open, onClose }) => {
  const [levels, setLevels] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newSectorName, setNewSectorName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels`);
      const levelsWithId = response.data.map((level) => ({
        ...level,
        id: level.levelId,
      }));
      setLevels(levelsWithId);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const handleEditClick = (level) => {
    setEditingId(level.levelId);
    setNewSectorName(level.sectorName);
  };

  const handleSave = async () => {
    if (editingId) {
      try {
        await axios.put(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels/${editingId}`, {
          sectorName: newSectorName,
        });
        fetchLevels();
        setEditingId(null);
        setNewSectorName('');
        setNotification({ open: true, message: 'Level updated successfully!', severity: 'success' });
      } catch (error) {
        console.error('Error updating level:', error);
        setNotification({ open: true, message: 'Error updating level.', severity: 'error' });
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SPRING_BASE_URL}/api/levels/${id}`);
      fetchLevels();
      setNotification({ open: true, message: 'Level deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting level:', error);
      setNotification({ open: true, message: 'Error deleting level.', severity: 'error' });
    }
  };

  const handleClose = () => {
    setEditingId(null);
    onClose();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredLevels = levels.filter((level) =>
    level.sectorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      field: 'sectorName',
      headerName: 'Sector Name',
      flex: 1,
      renderCell: (params) =>
        editingId === params.row.levelId ? (
          <Input
            value={newSectorName}
            onChange={(e) => setNewSectorName(e.target.value)}
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
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <>
          {editingId === params.row.levelId ? (
            <IconButton
              color="primary"
              onClick={handleSave}
              size="small"
              sx={{ marginRight: 1 }}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              color="primary"
              onClick={() => handleEditClick(params.row)}
              size="small"
              sx={{ marginRight: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row.levelId)}
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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Liste des Filières
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            placeholder="Rechercher..."
            fullWidth
            margin="dense"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ marginBottom: 2 }}
          />
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={filteredLevels}
              columns={columns}
              autoHeight
              disableSelectionOnClick
              hideFooter
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
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

export default ModifyLevel;
