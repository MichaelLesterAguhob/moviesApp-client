import { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'

import UserView from '../components/UserView';
import AdminDashboard from "../components/AdminDashboard";
import { Navigate } from "react-router-dom";

export default function Movie() {
    const {user} = useContext(UserContext)
    return (
        
            (user._id !== null) ?
                (user.isAdmin === true) ?
                <AdminDashboard />
                :
                <UserView />
            : 
                <Navigate to='/login' />
    )
}