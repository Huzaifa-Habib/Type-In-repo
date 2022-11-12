import { useState, useEffect, } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {Link,useNavigate,Navigate} from "react-router-dom"
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "./login.css"

const firebaseConfig = {
        apiKey: "AIzaSyAdiCIB2HUruPfENbArNu0yaqBceTHPGbc",
        authDomain: "attendence-portal-24e5f.firebaseapp.com",
        projectId: "attendence-portal-24e5f",
        storageBucket: "attendence-portal-24e5f.appspot.com",
        messagingSenderId: "573317723957",
        appId: "1:573317723957:web:5c2f9594edad9c107abe7c",
        measurementId: "G-31M3TYD022"
      
     
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const auth = getAuth(app);

function Login(){
    const [logInEmail, setLogInEmail] = useState("");
    const [logInPassword, setLogInPassword] = useState("");
    const navigate = useNavigate();

    const loginHandler = (e) =>{
        e.preventDefault();

        const auth = getAuth();
        signInWithEmailAndPassword(auth, logInEmail, logInPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("login successful: ", user);
                let path = `newPath`; 
                navigate("/")
                // window.location.reload();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("firebase login error: ", errorCode, errorMessage);
            });

    }

    return(

        <div className="main-div">
            <div className="sub-div">
                <h1 className="main-head">Login To Continue</h1>

                <form onSubmit={loginHandler}>
                    <input type="email" name="email" placeholder="Enter Your Email"
                    onChange={(e) =>{
                        setLogInEmail(e.target.value)

                    }}
                    />
                    <input type="password"  placeholder="Enter Your Password"
                    onChange={(e) =>{
                        setLogInPassword(e.target.value)

                    }}
                    />
                    <button type="submit">Log In</button>
                </form>
            </div>

         </div>
    )

}

export default Login