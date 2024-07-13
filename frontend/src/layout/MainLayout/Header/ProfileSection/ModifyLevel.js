import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  createTheme,
  ThemeProvider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
      paper: '#fff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function ModifyLevel(props) {
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
      const response = await axios.get('/api/levels');
      setLevels(response.data);
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
        await axios.put(`/api/levels/${editingId}`, {
          sectorName: newSectorName
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
      await axios.delete(`/api/levels/${id}`);
      fetchLevels();
      setNotification({ open: true, message: 'Level deleted successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error deleting level:', error);
      setNotification({ open: true, message: 'Error deleting level.', severity: 'error' });
    }
  };

  const handleClose = () => {
    setEditingId(null);
    props.onClose();
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
      renderCell: (params) => (
        editingId === params.row.levelId ? (
          <TextField
            fullWidth
            value={newSectorName}
            onChange={(e) => setNewSectorName(e.target.value)}
            variant="standard"  // Utiliser variant="standard" pour supprimer les bordures
            size="small"
            InputProps={{
              disableUnderline: true,  // Désactiver la bordure
              sx: {
                height: '100%',  // Ajuster la hauteur
                '& input': {
                  height: '100%',  // Ajuster la hauteur du texte
                  padding: '8px',  // Ajouter un padding pour l'espace intérieur
                },
              },
            }}
          />
        ) : (
          params.value
        )
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: (params) => (
        <>
          {editingId === params.row.levelId ? (
            <IconButton onClick={handleSave} color="primary">
              <SaveIcon />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
              <EditIcon />
            </IconButton>
          )}
          <IconButton color="error" onClick={() => handleDelete(params.row.levelId)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={props.open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-container': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          '& .MuiPaper-root': {
            width: '40%',
            maxWidth: 'none',
          },
        }}
      >
        <DialogTitle>
          Liste des Filières
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
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
          <div style={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={filteredLevels}
              columns={columns}
              autoHeight
              rowsPerPageOptions={[]}
              getRowId={(row) => row.levelId}
              disableSelectionOnClick
              hideFooter
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Centrer le Snackbar en bas
        >
          <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Dialog>
    </ThemeProvider>
  );
}

export default ModifyLevel;
