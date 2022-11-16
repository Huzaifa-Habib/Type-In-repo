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
 import DeleteIcon from '@mui/icons-material/Delete';
 import Login from "../student-profile/student"
 import ModeEditIcon from '@mui/icons-material/ModeEdit';





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
    const [classes, setClasses] = useState([])
    const [editing, setEditing] = useState({
        editingId : null,
        editingClass: "",
        editingBatch: "",
        editingSchedule: "",
        editingTeacher: "",
        editingSec: "",
        editingTiming: "",

      }) 

      const [studentProfile, setStudentProfile] = useState(null)


    

    




    const logoutHandler = () =>{

        
        const auth = getAuth();

        signOut(auth).then( () => {
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
              Class: classCourse.toLowerCase(),
              section : classSec.toLowerCase(),
              Schedule : classSchedule.toLowerCase(),
              Teacher : classTeacher.toLowerCase(),
              Batch :batch.toLowerCase(),
              ClassTiming : classTiming.toLowerCase(),
              date: serverTimestamp()
              

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

    const deletePost = async (postId) => {
        await deleteDoc(doc(db, "classes", postId))
    
      }

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
          const q = query(collection(db, "classes") ,orderBy("date", "desc"));
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

    //   Student Profile data===================================================
     useEffect(() =>{
            
        
            const getData = async () => {
              const querySnapshot = await getDocs(collection(db, "Students Profile"));
              querySnapshot.forEach((doc) => {
              console.log(`${doc.id} => `,doc.data());
              setStudentProfile((prev) =>{
                let newArray = [...prev,doc.data()  ]
                return(newArray)
          
              })
            });
          
            }
            // getData();
            let unsubscribe = null
            const realTimeData = async () =>{
              const q = query(collection(db, "Students Profile"),);
              unsubscribe = onSnapshot(q, (querySnapshot) => {
              const posts = [];
              querySnapshot.forEach((doc) => {
                posts.push({id:doc.id, ...doc.data()});
                console.log(posts)
            });
          
            // if (posts.length !== 0 ) {
                console.log("Post", posts); 
                setStudentProfile(posts)
          
          
              
            // }
            });
    
            }
          
            realTimeData();
            return () =>{
              console.log("Clean up")
              unsubscribe();
            }
            
          },[])
    




      const updatedPost = async (e) =>{
        e.preventDefault();
    
        await updateDoc(doc(db, "classes", editing.editingId), {
            Class: editing.editingClass,
            section: editing.editingSec,
            Schedule: editing.editingSchedule,
            Teacher: editing.editingTeacher,
            Batch: editing.editingBatch,
            ClassTiming: editing.editingTiming,
          
        });
    
        setEditing({
            editingId : null,
            editingClass: "",
            editingBatch: "",
            editingSchedule: "",
            editingTeacher: "",
            editingSec: "",
            editingTiming: "",
          
        }) 
      }


      const pageHandler = ()=>{
        navigate("/student-profile/student")

      }




          






    return(
        <div className="main-div">
            <div className="nav-bar">
                <Box sx={{ flexGrow: 1 }}>
                     <AppBar position="static">
                        <Toolbar>
                            <Typography className='logo' variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Attendence Portal
                            </Typography>
                            {/* { studentProfile?.map((eachProfile,i) => ( */}
                                <>
                                  <Button color="inherit" className='app-btn-one' onClick={logoutHandler}>Log Out</Button>
                                
                                </>
                               
                            {/* ))} */}
                          
                            <Button variant="outlined" className='modal-opener' onClick={handleOpen}>Add Class</Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box className='modal'>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Add Class details
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
                                       <Button variant="contained" className = "add-btn" type='submit' onClick={submitHandler} startIcon={<AddIcon />}>Add</Button>

                                        
                                </Typography>
                                </Box>
                        </Modal>

 
                            <Button  onClick={pageHandler} className = "app-btn-three" >Add Student</Button>



                        </Toolbar>
                    </AppBar>
                </Box>
            </div>


                {
                         classes.map((eachPost,i) => (
                         <div className='displayClassDetails' key={i}>
                            <div className='heading'>
                                <h1>{(eachPost.id === editing.editingId)?
                                    <>
                                        <input type="text" value={editing.editingClass} 
                                        onChange = {(e) =>{
                                        setEditing({...editing, editingClass: e.target.value})

                                        }}/>
                                        {/* <button type='submit' onClick={updatedPost}>Update</button> */}

                                    </>

                                        : eachPost?.Class}</h1> 

                            </div>

                            <div className='schedule'>
                            <p>Class Schedule : {(eachPost.id === editing.editingId)?
                                <>
                                    <input type="text" value={editing.editingSchedule} 
                                    onChange = {(e) =>{
                                    setEditing({...editing, editingSchedule: e.target.value})

                                    }}/>
                                    {/* <button type='submit' onClick={updatedPost}>Update</button> */}

                                </>

                                    : eachPost?.Schedule}</p> 
                            
                            </div>

                            <div className='classTiming'>
                            <p>Class Timing : {(eachPost.id === editing.editingId)?
                                <>
                                    <input type="text" value={editing.editingTiming} 
                                    onChange = {(e) =>{
                                    setEditing({...editing, editingTiming: e.target.value})

                                    }}/>
                                    {/* <button type='submit' onClick={updatedPost}>Update</button> */}

                                </>

                                    : eachPost?.ClassTiming}</p> 
                            
                            </div>

                            <div className='teacher'>
                            <p>Teacher : {(eachPost.id === editing.editingId)?
                                <>
                                    <input type="text" value={editing.editingTeacher} 
                                    onChange = {(e) =>{
                                    setEditing({...editing, editingTeacher: e.target.value})

                                    }}/>

                                </>

                                    : eachPost?.Teacher}</p> 



                               
                            
                            </div>


                            <div className='batch'>
                            <p>Batch No. : {(eachPost.id === editing.editingId)?
                                <>
                                    <input type="text" value={editing.editingBatch} 
                                    onChange = {(e) =>{
                                    setEditing({...editing, editingBatch: e.target.value})

                                    }}/>

                                </>

                                    : eachPost?.Batch}</p> 
                            
                            </div>


                            <div className='sec'>
                            <p>Section : {(eachPost.id === editing.editingId)?
                                <>
                                    <input type="text" value={editing.editingSec} 
                                    onChange = {(e) =>{
                                    setEditing({...editing, editingSec: e.target.value})

                                    }}/>
                                    <button type='submit' onClick={updatedPost}>Update</button>


                                </>

                                    : eachPost?.section}</p> 
                            </div>


                       


                            <div className='btns'>
                                <Button variant="outlined" startIcon={<DeleteIcon />}
                                onClick={() =>{
                                    deletePost(eachPost?.id)
                                }}>
                                    Delete Class</Button>

                                {(editing.editingId === eachPost?.id)? null 
                                    :
                                    <Button variant="outlined"  startIcon={<ModeEditIcon />} onClick={() => {
                                        setEditing({
                                            editingId : eachPost?.id,
                                            editingClass: eachPost?.Class,
                                            editingBatch: eachPost?.Batch,
                                            editingSchedule: eachPost?.Schedule,
                                            editingTeacher: eachPost?.Teacher,
                                            editingSec: eachPost?.section,
                                            editingTiming: eachPost?.ClassTiming,
                                       
                                    
                                        })
                                    }}>
                                        Update Fields

                                     </Button>}


                            </div>

                           



                         </div>

            
                         ))}
                
                

                
           


      


           

        </div>


    )


  
}

export default Home