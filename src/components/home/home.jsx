import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {getAuth,createUserWithEmailAndPassword,onAuthStateChanged, signOut  } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { FormControl } from '@mui/material';
import "./home.css"
import { async } from '@firebase/util';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc,getDocs,doc, onSnapshot,query,serverTimestamp
        , orderBy, limit, deleteDoc,updateDoc,getDoc
      } 
 from "firebase/firestore"; 
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

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
    const [classes, setClasses] = useState()




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
        if(classCourse && classSec && classSchedule && classTeacher && batch && classTiming  !== null) {
        try {
            const docRef = await addDoc(collection(db, "classes"),{
              Class: classCourse,
              section : classSec,
              Schedule : classSchedule,
              Teacher : classTeacher,
              Batch :batch,
              ClassTiming : classTiming

            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
        else{
            alert("Fill out All fields First")
      
          
        }
    }

    // const deletePost = async (postId) => {
    //     await deleteDoc(doc(db, "classes", postId))
    
    //   }

    useEffect(() =>{

        const getData = async () => {
          const querySnapshot = await getDocs(collection(db, "classes"));
          querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => `,doc.data());
          setClasses((prev) =>{
            let newArray = [...prev,doc.data()  ]
            return(newArray)
      
          })
        });
      
        }
        // getData();
        let unsubscribe = null
        const realTimeData = async () =>{
          const q = query(collection(db, "classes"), orderBy("desc"));
          unsubscribe = onSnapshot(q, (querySnapshot) => {
          const posts = [];
          querySnapshot.forEach((doc) => {
            posts.push({id:doc.id, ...doc.data()});
            console.log(posts)
        });
      
        // if (posts.length !== 0 ) {
            console.log("Post", posts); 
            setClasses(posts)
      
      
          
        // }
        });
        }
      
        realTimeData();
        return () =>{
          console.log("Clean up")
          unsubscribe();
        }
        
      },[])

          






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
                                    
                                        <input type="text" placeholder='Enter Class Timing'
                                        onChange={(e) =>{
                                            setClassTiming(e.target.value)
                                            
                                        }}/> <br />

                                        <input type="text" placeholder='Enter Class Days'
                                        onChange={(e) =>{
                                            setClassSchedule(e.target.value)
                                            
                                        }}/> <br />
        

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
                                        <Button variant="contained" type='submit' onClick={submitHandler} startIcon={<AddIcon />}>Add</Button>
                                        
                                </Typography>
                                </Box>
                        </Modal>
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>

            <div className='displayClass'>
                {
                         classes.map((eachPost,i) => (
                         <div>
                            <p>{eachPost.Batch}</p>

                         </div>

                         ))
                }
                

                
            </div>


      


           

        </div>


    )


  
}

export default Home