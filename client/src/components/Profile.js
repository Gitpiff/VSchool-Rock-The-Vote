import React, { useContext } from "react"
import IssueForm from "./IssueForm"
import IssueList from "./IssueList"
import { UserContext } from "../context/UserProvider"

export default function Profile(){
    const {
        user:{
            username
        },
        addIssue,
        issues
    } = useContext(UserContext)

    return(
        <div className="profile">
            <h1>Welcome {username}</h1>
            <h3>Add a Political Issue</h3>
            <IssueForm addIssue={addIssue} />
            <h3>Your Posts</h3>
            <IssueList issues={issues} />
        </div>
    )
}
