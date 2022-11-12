import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {getAuth,createUserWithEmailAndPassword,onAuthStateChanged, signOut  } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';



import "./home.css"
import { async } from '@firebase/util';



function Home (){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate()
    const [classTiming, setClassTiming] = useState(null)
    const [classSchedule, setClassSchedule] = useState(null)
    const [classTeacher, setClassTeacher] = useState(null)
    const [classSec, setClassSec] = useState(null)
    const [classCourse, setClassCourse] = useState(null)
    const [batch, setBatch] = useState(null)



    





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

    const submitHandler = async (e) =>{
        e.preventDefault()
        try {
            const docRef = await addDoc(collection(db, "classes"), {
              text: values.text,
              img : res?.data?.url,
              userProfileImg : auth?.currentUser?.photoURL,
              user:auth?.currentUser?.displayName,
              date: serverTimestamp()

            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }


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
                            <Button variant="outlined" className='modal-opener' onClick={handleOpen}>Add Class</Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box className='modal'>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Add Class
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    <form onAbort={submitHandler}>
                                        <input type="text" placeholder='Enter Class Timing'/> <br />
                                                                                
                                        <select class="form-select form-select-sm" aria-label=".form-select-sm example">
                                            <option selected>Select Class Schedule</option>
                                            <option value="1">Monday, Wednesday, Friday(M.W.S)</option>
                                            <option value="2">Tuesday, Thursday, Saturday(T.T.S)</option>
                                        </select> <br />
                                        <input type="text" placeholder="Enter Teacher Name" onChange={(e) =>{
                                            setClassTeacher(e.target.value)
                                            
                                        }} />  <br />
                                        <input type="text" placeholder="Enter Section Name"onChange={(e) =>{
                                            setClassSec(e.target.value)
                                            
                                        }}  />  <br />
                                        <input type="text" placeholder="Enter Course Name"onChange={(e) =>{
                                            setClassCourse(e.target.value)
                                            
                                        }}  />  <br />
                                        <input type="text" placeholder="Enter Batch Number" onChange={(e) =>{
                                            setBatch(e.target.value)
                                            
                                        }} />  <br />
                                        <Button variant="contained" type='submit' onClick={handleClose} startIcon={<AddIcon />}>Add</Button>




                                        
                                    </form>
                                </Typography>
                                </Box>
                        </Modal>
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>

      


           

        </div>


    )


  
}

export default Home