import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {getAuth,createUserWithEmailAndPassword,onAuthStateChanged, signOut  } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';

import "./home.css"



function Home (){
    const navigate = useNavigate()
    const logoutHandler = () =>{
        const auth = getAuth();

        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("signout successful");
            alert("You are successfully logout")
            navigate("/login")
        
        }).catch((error) => {
            // An error happened.
            console.log("signout failed");
        });

    }

    const modalHandler = () =>{

        

    }



    return(
        <div className="main-div">
            <div className="nav-bar">
                <Box sx={{ flexGrow: 1 }}>
                     <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Attendence Portal
                            </Typography>
                            <Button color="inherit" onClick={logoutHandler}>Log Out</Button>
                            <Button variant="outlined" className='modal-opener'>Add Class</Button>
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>


           

        </div>


    )


  
}

export default Home