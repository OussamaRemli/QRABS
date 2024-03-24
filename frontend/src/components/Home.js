import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const[firstName,setFirstName]=useState('');
    const[lastName,setLastName]=useState('');
    const[email,setEmail]=useState('');
    const { id:professorIdFromUrl } = useParams();
    useEffect(()=>{
        axios.get(`http://localhost:8011/api/auth/${professorIdFromUrl}`)
        .then(res => {
            const professor = res.data;
            setFirstName(professor.firstName);
            setLastName(professor.lastName);
            setEmail(professor.email);
        })
        .catch(err => console.error("Error fetching professor: ", err));
    },);
    return (
        <div>
            <p>Bonjour mr. {firstName} {lastName}</p>
            <p>votre email: {email}</p>
        </div>
    )
}

export default Home
