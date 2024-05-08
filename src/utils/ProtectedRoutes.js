import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

export function ProtectedRoutes() {
    const { isAdmin } = useAuth();
    return (
        isAdmin ? <Outlet /> : <Navigate to="/" />
    );
}

export function ProtectedRoles({roleInput}) {
    const { isAdmin, role } = useAuth();
    console.log(isAdmin, role === '1' )
    return (
        isAdmin && role === String(roleInput) ? <Outlet /> : <Navigate to="/" />
    );
}
