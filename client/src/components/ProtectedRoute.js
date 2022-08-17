import React from "react"
import { Navigate } from "react-router-dom"

function ProtectedRoute(props){
    //only bring the necessary props
    const { token, children, redirectTo } = props
    //if there's a token, then render whatever component is being passed as children, else navigate to the other designated route
    return token ? children : <Navigate to={redirectTo} />
}

export default ProtectedRoute
