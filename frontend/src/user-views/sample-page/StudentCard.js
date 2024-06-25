import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';

export default function StudentCard({ Apogee }) {
    const [studentData, setStudentData] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        // Fetch student data
        fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/student/${Apogee}`)
            .then(response => response.json())
            .then(data => {
                setStudentData(data);
            })
            .catch(error => console.error('Error fetching student data:', error));

        // Fetch image data
        fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/image/${Apogee}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Image not found');
                }
                return response.blob();
            })
            .then(imageBlob => {
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageUrl);
            })
            .catch(error => {
                console.error('Error fetching image data:', error);
                // Si une erreur se produit lors du chargement de l'image, définissez l'image par défaut
                setImageUrl(null); // Réinitialiser imageUrl à null
            });

    }, [Apogee]);

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper', border: '1px solid #ccc', borderRadius: '4px' }}>
            {studentData && (
                <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <ListItemAvatar>
                        {imageUrl ? (
                            <Avatar alt="Student" src={imageUrl} sx={{ width: 100, height: 100, marginRight: '40px', border: '1px solid #ccc' }} />
                        ) : (
                            <Avatar sx={{ width: 100, height: 100, marginRight: '40px', border: '1px solid #ccc' }}>
                                <PersonIcon />
                            </Avatar>
                        )}
                    </ListItemAvatar>
                    <ListItemText
                        primary={`${studentData.firstName} ${studentData.lastName}`}
                        secondary={
                            <React.Fragment>
                                <Typography
                                    sx={{ display: 'inline' }}
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                >
                                    Filière : {studentData.level.levelName}
                                    <br />
                                    Apogée : {Apogee}
                                </Typography>
                                <br />
                                {studentData.email}
                            </React.Fragment>
                        }
                    />
                </ListItem>
            )}
        </List>
    );
}


//  export default function StudentCard({ Apogee }) {
//      const [studentData, setStudentData] = useState(null);
//      const [imageUrl, setImageUrl] = useState(null);

//      useEffect(() => {
//          // Fetch student data
//          fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/students/student/${Apogee}`)
//              .then(response => response.json())
//              .then(data => {
//                  setStudentData(data);
//              })
//              .catch(error => console.error('Error fetching student data:', error));

//          // Fetch image data
//          fetch(`${process.env.REACT_APP_SPRING_BASE_URL}/api/import-files/image/${Apogee}`)
//              .then(response => {
//                  if (!response.ok) {
//                      throw new Error('Image not found');
//                  }
//                  return response.blob();
//              })
//              .then(imageBlob => {
//                  const imageUrl = URL.createObjectURL(imageBlob);
//                  setImageUrl(imageUrl);
//              })
//              .catch(error => console.error('Error fetching image data:', error));

//      }, [Apogee]);

//      return (
//          <List sx={{ width: '100%', bgcolor: 'background.paper', border: '1px solid #ccc', borderRadius: '4px' }}>
//              {studentData && (
//                  <ListItem style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
//                      <ListItemAvatar>
//                          {imageUrl && <Avatar alt="Student" src={imageUrl} sx={{ width: 100, height: 100, marginRight: '40px', border: '1px solid #ccc' }} />}
//                      </ListItemAvatar>
//                      <ListItemText
//                          primary={`${studentData.firstName} ${studentData.lastName}`}
//                          secondary={
//                              <React.Fragment>
//                                  <Typography
//                                      sx={{ display: 'inline' }}
//                                     component="span"
//                                      variant="body2"
//                                      color="text.primary"
//                                  >
//                                      Filière : {studentData.level.levelName}
//                                      <br />
//                                      Apogée : {Apogee}
//                                  </Typography>
//                                  <br />
//                                  {studentData.email}
//                              </React.Fragment>
//                          }
//                      />
//                  </ListItem>
//              )}
//          </List>


//      );
//  }
