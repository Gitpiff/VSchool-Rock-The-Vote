import React, { useState } from "react";
import axios from "axios";
export const UserContext = React.createContext()

//create a new configurable version of axios
const userAxios = axios.create()

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

export default function UserProvider(props){
    const initState = {
        //before setting the user to an empty object, let's check if the user already exists in the local storage, since we stringify it before we need to parse it back to an object, if it's not found in local storage, then we can set it as an empty object
        user: JSON.parse(localStorage.getItem("user") || {}),
        //before setting the token to an empty string, let's check if the token already exists in the local storage, otherwise set it as an empty string
        token: localStorage.getItem("token") || "",
        issues: [],
        errMsg: ""
    }
    const [userState, setUserState] = useState(initState)

    //Signup function, it takes the credentials as arguments
    function signUp(credentials){
        axios.post("/auth/signup", credentials)
            .then(res => {
                const { user, token } = res.data    //gets user and token from response
                //to prevent losing data when we refresh the page, we need to save the user and token into local storage, when storing complex data types like objects or arrays we need to turn them into JSON strings
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                setUserState(prevUserState => ({
                    ...prevUserState,
                    user,
                    token
                }))
            })
            .catch(err => handleAuthErr(err.response.data.errMsg))
    }

    //Login function, also takes the credentials as arguments
    function login(credentials){
        axios.post("/auth/login", credentials)
            .then(res => {
                const { user, token } = res.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                getUserPosts() //gets the user posts immediately after login
                setUserState(prevUserState => ({
                    ...prevUserState,
                    user,
                    token
                }))
            })
            .catch(err => handleAuthErr(err.response.data.errMsg))
    }

    //Logout function -it does not need any arguments-, simply removes the user and token from local storage, and resets the user state to an empty collection
    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUserState({
            user: {},
            token: "",
            issues: []
        })
    }

    //Displays the error message in the page -takes in the errMSg as an argument-
    function handleAuthErr(errMsg){
        setUserState(prevState => ({
            ...prevState,
            errMsg
        }))
    }

    //Once the error message appears, it should only be displayed until the next refresh of the page
    function resetAuthErr(){
        setUserState(prevState => ({
            ...prevState,
            errMsg: ""
        }))
    }

    //Get User Posts
    function getUserPosts(){
        userAxios.get("/api/issue/user")
            .then(res => {
                setUserState(prevState => ({
                    ...prevState,
                    issues: res.data
                }))
            })
            .catch(err => console.log(err.response.data.errMsg))
    }

    //Add Issue
    function addIssue(newIssue){
        userAxios.post("/api/issue", newIssue)
            .then(res => {
                setUserState(prevState => ({
                    ...prevState,
                    issues: [res.data]
                }))
            })
            .catch(err => console.log(err.response.data.errMsg))
    }

    return(
        <UserContext.Provider
            value={{
                ...userState,
                signUp,
                login,
                logout,
                addIssue,
                resetAuthErr
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
}
