import { createContext, useEffect, useState } from "react"
import AuthContext from "./AuthContext"
import { jwtDecode } from "jwt-decode"
import { useNavigate, json } from "react-router-dom"
import { Refresh } from "@mui/icons-material"


export default function AuthProvider({children}){
    let [errorMessage,seterrorMessage] = useState(null)
    let [loading,setloading] = useState(true)
    let [authTokens,setauthTokens] = useState(() => localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null)
    let [user,setuser] = useState(() => localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null)
    // let [authTokens,setauthTokens] = useState(localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null)
    // let [user,setuser] = useState(localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null)

    const navigate = useNavigate() 

    let logout = () => { 
        console.log("LOGOUT FUNCTION IS RUNNING")
        setauthTokens(null)
        setuser(null)
        localStorage.removeItem("authTokens")
        navigate("/login")
    }

    let loginuser = async (e) => {
        e.preventDefault()
        const username = e.target.username.value.toLowerCase();
        const password = e.target.password.value;
        try {
            let response = await fetch("http://localhost:8000/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            })
            let data = await response.json()
            if (response.status === 200) {
                setauthTokens(data)
                setuser(jwtDecode(data.access))
                localStorage.setItem("authTokens", JSON.stringify(data))
                seterrorMessage(null)
                navigate("/center")
            } else {
                let errordata = await response.json
                console.error("Login failed:", data)
                seterrorMessage("FAILED TO LOGIN, PLEASE CHECK YOUR CREDENTIALS!")
            }
        } catch (error) {
            console.error("An error occurred:", error);
            seterrorMessage('An unexpected error occurred');
        }
    }

    let createUser = async (username, password) => {
        console.log("TRYING TO CREATE A USER ......");
        username = username.toLowerCase();
    
        try {
            let res = await fetch("http://localhost:8000/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            });
    
            if (res.status === 201) {
                console.log(`PROCESS WAS SUCCESSFUL, ${username} IS CREATED AT BACKEND`);
                seterrorMessage(null)
                navigate("login/");
            } else {
                let data = await res.json();
                if (res.status === 400 && data.error === "USER ALREADY EXISTS") {
                    seterrorMessage(`${username} ALREADY EXISTS, USE ANOTHER NAME :)`);
                } else {
                    seterrorMessage(data.error || "Registration failed.");
                }
            }
        } catch (error) {
            console.error("REGISTRATION FAILED", error);
            seterrorMessage("An error occurred. Please try again.");
        }
    }
    

    let updateToken = async() => {
        console.log("UPDATING TOKEN FUNCTION IS RUNNING")
        let response = await fetch("http://localhost:8000/token/refresh/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({"refresh":authTokens?.refresh})})
        let data = await response.json()
        if(response.status === 200){
            setauthTokens(data)
            setuser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
        }else{
            logout()
        }
        if(loading){
            setloading(false)
        }
    }
    

    let contextData = {
        user:user,
        authTokens:authTokens,
        errorMessage:errorMessage,
        seterrorMessage:seterrorMessage,
        loginuser : loginuser,
        logout:logout,
        createUser:createUser,
        // generateImage:generateImage,
    }

    useEffect(()=>{
        if(loading){
            updateToken()
            // setloading(false)
        }

        let fourMinutes = 1000 * 60 * 4

        let interval = setInterval(() => {
            if(authTokens){
                updateToken()
            }
        }, fourMinutes);

        return () => {
            clearInterval(interval)
        }
    },[authTokens,loading])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
}







// const generateImage = async (prompt) => {
    //     try {
    //         console.log('Generating image with prompt:', prompt);
    //         const response = await fetch("http://localhost:8000/generate-image/", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ prompt }),
    //         });
    
    //         console.log('Response status:', response.status);
    //         console.log('Response headers:', response.headers);
    
    //         const text = await response.text();
    //         console.log('Response text:', text);
    
    //         let data;
    //         try {
    //             data = JSON.parse(text);
    //         } catch (e) {
    //             console.error('Error parsing JSON:', e);
    //             throw new Error('Invalid JSON response from server');
    //         }
    
    //         console.log('Parsed data:', data);
    
    //         if (!response.ok) {
    //             throw new Error(data.error || `HTTP error! status: ${response.status}`);
    //         }
    
    //         if (data.image_data) {
    //             setImageData(data.image_data);
    //             console.log('Image data set successfully');
    //         } else {
    //             throw new Error("No image data received");
    //         }
    //     } catch (error) {
    //         console.error("Error in generateImage:", error);
    //         setError(error.message);
    //     }
    // };
    

    // let generateImage = async (prompt) => {
    //     try {
    //         let response = await fetch("https://7db6-3-20-229-229.ngrok-free.app/", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 // "Authorization": `Bearer ${authTokens.access}`
    //             },
    //             body: JSON.stringify({ prompt })
    //         });
    
    //         let data = await response.json();
    
    //         if (response.status === 200) {
    //             console.log("Image generated successfully:", data.image_data);
    //         } else {
    //             seterrorMessage("Failed to generate image");
    //             console.error("Error:", data.error);
    //         }
    //     } catch (error) {
    //         console.error("An error occurred:", error);
    //         seterrorMessage('An unexpected error occurred');
    //     }
    // };
    // let loginuser = async (e) => {
    //     console.log("LOGIN USER FUNCTION IS RUNNING")
    //     e.preventDefault()
    //     let response = await fetch("http://localhost:8000/token/",{
    //         method:"POST",
    //         headers:{
    //             "Content-Type":"application/json"
    //         },
    //         body:JSON.stringify({"username":e.target.username.value,"password":e.target.password.value})
    //     })
    //     let data = await response.json()
    //     if(response.status === 200){
    //         console.log("DATA IS: ", data)
    //         console.log("RESPONSE IS: ", response)
    //         setauthTokens(data)
    //         setuser(jwtDecode(data.access))
    //         localStorage.setItem("authTokens",JSON.stringify(data))
    //         navigate("/center")
    //     }
    //     else
    //     {
    //         console.log("ERROR")
    //     }
    // }