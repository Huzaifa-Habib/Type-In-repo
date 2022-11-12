import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {getAuth} from "firebase/auth"
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import "./student.css"
import { async } from '@firebase/util';
import { initializeApp } from "firebase/app";
import { getFirestore, where } from "firebase/firestore";
import { collection, addDoc,getDocs,doc, onSnapshot,query,serverTimestamp
        , orderBy, limit, deleteDoc,updateDoc,getDoc
      } 
 from "firebase/firestore"; 
 import DeleteIcon from '@mui/icons-material/Delete';
 import Login from "../student-profile/student"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import {  CardActionArea, CardActions } from '@mui/material';

 
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






function Student(){
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate()
    const [studentName, setStudentName] = useState(null)
    const [father, setfather] = useState(null)
    const [roll, setroll] = useState(null)
    const [contact, setContact] = useState(null)
    const [cnic, setCnic] = useState(null)
    const [courseName, setCourseName] = useState(null)
    const [studentClass, setStudentClass] = useState(null)
    const [attendenceClass, setAttendenceClass] = useState(null)
    const [studentProfile, setStudentProfile] = useState(null)
    const [queryRoll, setQueryRoll] = useState(null)





    
    const studentProfileHandler = async () =>{

        try {
            const docRef = await addDoc(collection(db, "Students Profile"),{
                studentName : studentName,
                studentFather : father,
                rollNumber : roll,
                contact : contact,
                CNIC : cnic,
                Course : courseName,
                Class : studentClass


             
              

            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }

    const pageHandler = () =>{
        navigate("/")

    }

    let input =  document.getElementById("input")
    const attendenceHandler = () =>{

        if(input.value !== null){
            let any = document.getElementById("class-div")
            any.style.display = "none"
            setAttendenceClass(input.value)
        }

    }


    // Get Real-Time Data====================================================
    useEffect(() =>{

        const getData = async () => {
          const querySnapshot = await getDocs(collection(db, "Students Profile"), where("rollNumber", "==",input.value));
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
          const q = query(collection(db, "Students Profile"));
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



    


    return(
        <div className='main-div'>
            <div className='nav'>
       
                <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Attendence Portal
                    </Typography>
                    <Button variant="outlined" className='modal-opener' onClick={handleOpen}>Click Me</Button>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box className='modal'>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Add Student details
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            
                                <input type="text" placeholder='Enter Name'
                                onChange={(e) =>{
                                    setStudentName(e.target.value)
                                    
                                }}/> <br />

                                <input type="text" placeholder='Enter Father Name'
                                onChange={(e) =>{
                                    setfather(e.target.value)
                                    
                                }}/> <br />


                                <input type="text" placeholder="Ente Roll Number" onChange={(e) =>{
                                    setroll(e.target.value)
                                    
                                }} />  <br />
                                <input type="text" placeholder="Enter Contact Number"onChange={(e) =>{
                                    setContact(e.target.value)
                                    
                                }}  />  <br />
                                <input type="text" placeholder="Enter CNIC Number"onChange={(e) =>{
                                    setCnic(e.target.value)
                                    
                                }}  />  <br />
                                <input type="text" placeholder="Enter Course Name" onChange={(e) =>{
                                    setCourseName(e.target.value)
                                    
                                }} />  <br />

                                <input type="text" placeholder="Enter Class Name" onChange={(e) =>{
                                    setStudentClass(e.target.value)
                                    
                                }} />  <br />

                            <Button variant="contained" type='submit' onClick={studentProfileHandler} startIcon={<AddIcon />}>Add</Button>

                                
                        </Typography>
                        </Box>
                </Modal>
                <Button variant="contained" type='submit' onClick={pageHandler}>Check Classes</Button>

                    </Toolbar>
                </AppBar>
            </Box>
         </div>

         <div className='body-div'>
            <div className='class' id='class-div'>
                <h3>Enter Class Name For Attendence </h3>
                <input type="text" id='input'
                  />

                <button onClick={attendenceHandler}>Submit</button>

            </div>
            
            <div className='show-div'>
                
                <div className='course-heading'>
                    <h1>{attendenceClass}</h1>

                </div>
                <div className='roll-input'>
                    <input type="text" placeholder='Enter Your roll Number'
                    onChange={(e) =>{
                        setQueryRoll(e.target.value)


                    }}
                     />

                </div>

                <div className='student-card'>
                <Card sx={{ maxWidth: 345 }}>
                    <CardActionArea>
                        <CardMedia
                        component="img"
                        height="140"
                        image="/static/images/cards/contemplative-reptile.jpg"
                        alt="green iguana"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Lizard
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Lizards are a widespread group of squamate reptiles, with over 6,000
                            species, ranging across all continents except Antarctica
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                    
            </Card>

                </div>


            </div>


         </div>

    </div>
    )
    
        
    

    

}

export default Student;