import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function StudentCard({ Apogee }) {
    const [studentData, setStudentData] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        // Fetch student data
        fetch(`http://localhost:8080/api/students/student/${Apogee}`)
            .then(response => response.json())
            .then(data => {
                setStudentData(data);
            })
            .catch(error => console.error('Error fetching student data:', error));

        // Fetch image data
        fetch(`http://localhost:8080/api/import-files/image/${Apogee}`)
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
        <List justifyContent="space-around" sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {studentData && (
                <ListItem >
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

    );
}
