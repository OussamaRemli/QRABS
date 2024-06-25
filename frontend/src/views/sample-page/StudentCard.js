import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';

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
            .catch(error => console.error('Error fetching image data:', error));

    }, [Apogee]);

    return (
        <Box sx={{ borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
  <List sx={{ justifyContent: 'space-around' }}>
    {studentData && (
      <ListItem>
        <ListItemAvatar>
          {imageUrl && <Avatar alt="Student" src={imageUrl} sx={{ width: 100, height: 100 }} />}
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
                Apogee: {Apogee}
              </Typography>
              <br />
              {studentData.email}
            </React.Fragment>
          }
        />
      </ListItem>
    )}
  </List>
</Box>

    );
}
