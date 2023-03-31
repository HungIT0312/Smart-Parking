import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../../Components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
const Manager = () => {
    return (
        <div className='overflow-hidden'>
            <NavBar/>
            <Outlet />
        </div>
    );
};

export default Manager;