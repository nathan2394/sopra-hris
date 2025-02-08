import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    const navigate = useNavigate();
    const userToken = localStorage.getItem('userToken');
    
    // if (!userToken) {
    //     navigate('/login')
    // }

    return userToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;