import React from 'react'
import './Auth.css'
import picture1 from '../images/picture1.png'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const [professorNotFound, setProfessorNotFound] = useState(false);
    const navigate=useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:8011/api/auth/login", { email, password }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            navigate(`/home/${response.data.professorId}`)
        } catch (error) {
            console.log(error); // Gérer les erreurs
            setProfessorNotFound(true);
        }
    }
    return (
        <div className='home'>
            <img src={picture1}height={350} alt=''/>
            <div className="form-box">
                <form onSubmit={handleSubmit}>
                    <h2>welcome!</h2>
                    {professorNotFound && <span className="error-msg">Invalid email or password</span>}
                    <div className="input-box">
                        <ion-icon name={"mail-outline"}></ion-icon>
                        <input type="email" name="email" required value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-box">
                        <ion-icon name="lock-closed-outline"></ion-icon>
                        <input type="password" name="password" required value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <label htmlFor="password">Password</label>
                    </div>
                    <input type="submit" name="submit" value="sign up" className="btn"/>
                </form>
            </div>
        </div>
    )
}

export default Auth
