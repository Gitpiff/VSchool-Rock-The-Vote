import React, { useState, useContext } from "react"
import AuthForm from "./AuthForm"
import { UserContext } from "../context/UserProvider"

const initInputs= { username: "", password: "" }

export default function Auth(){
    const [inputs, setInputs] = useState(initInputs)
    const [toogle, setToggle] = useState(false)

    const { signUp, login, errMsg, resetAuthErr } = useContext(UserContext)

    function handleChange(e){
        const {name, value} = e.target
        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: value
        }))
    }

    function handleSignup(e){
        e.preventDefault()
        signUp(inputs)
    }

    function handleLogin(e){
        e.preventDefault()
        login(inputs)
    }

    function toogleForm(){
        setToggle(prev => !prev)
        resetAuthErr()
    }

    return (
        <div className="auth-container">
            <h1>Rock The Vote App</h1>
            { !toogle ?
                <>
                    <AuthForm
                        handleChange={handleChange}
                        handleSubmit={handleSignup}
                        inputs={inputs}
                        btnText="Sign Up"
                        errMsg={errMsg}
                    />
                    <p onClick={toogleForm}>Already a Member?</p>
                </>
                :
                <>
                    <AuthForm
                        handleChange={handleChange}
                        handleSubmit={handleLogin}
                        inputs={inputs}
                        btnText="Login"
                        errMsg={errMsg}
                    />
                    <p onClick={toogleForm}>Not a Member?</p>
                </>
            }
        </div>
    )
}
