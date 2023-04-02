import { Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from "react";
import MainLayout from '../layout/MainLayout'

export default function PrivateRoute({ children }) {
    let token = localStorage.getItem('token');
    return (
        token ? <MainLayout>{children}</MainLayout> : <Navigate to="/" />
    )

}
