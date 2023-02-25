import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const ProtectedRoutes = ({children}) => {
    const userAuth = useAuth();

    return !userAuth.profileId? <Navigate to="/Login" /> : children;
}

export default ProtectedRoutes;