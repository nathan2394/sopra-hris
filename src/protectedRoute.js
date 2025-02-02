import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated }) => {
    // console.log(isAuthenticated)
    return children;
};

export default ProtectedRoute;