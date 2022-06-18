import React from "react"
import { Navigate } from "react-router-dom"
import authenticationService from "./../Services/auth.service.js"

export default function PrivateRoute({children}) {
    const currentUser = authenticationService.getCurrentUser();

    return currentUser ? children : <Navigate to="/login" />
}