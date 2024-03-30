import React from 'react';
import { Route, NavLink } from 'react-router-dom';
import './Admin.css';
import AjoutDepartement from './AjoutDepartement';
import AjoutProfesseur from './AjoutProfesseur';

const Admin = () => {
    return (
        <div className="admin-container">
            <div className="sidebar">
                <NavLink to="/admin/ajouter/departement" activeclassname="active-link">Ajouter Département</NavLink>
                <NavLink to="/admin/ajouter/professeur" activeclassname="active-link">Ajouter Professeur</NavLink>
            </div>
            <div className="main-content">
                <Route path="/admin/ajouter/departement" element={<AjoutDepartement />} />
                <Route path="/admin/ajouter/professeur" element={<AjoutProfesseur />} />
            </div>
        </div>
    );
}

export default Admin;
