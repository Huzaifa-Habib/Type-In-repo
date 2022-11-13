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
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Axios from "axios"
import { Class } from '@mui/icons-material';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import{DropDown} from "bootstrap"





 
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

let date, TimeType, hour, minutes, seconds, fullTime;

// Creating Date() function object.
date = new Date();

// Getting current hour from Date object.
hour = date.getHours(); 

// Checking if the Hour is less than equals to 11 then Set the Time format as AM.
if(hour <= 11)
{

  TimeType = 'AM';

}
else{

  // If the Hour is Not less than equals to 11 then Set the Time format as PM.
  TimeType = 'PM';

}


// IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
if( hour > 12 )
{
  hour = hour - 12;
}

// If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format. 
if( hour == 0 )
{
    hour = 12;
} 
fullTime = hour.toString() + TimeType.toString()

console.log(fullTime)











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
    const [classes, setClasses] = useState([])
    const [className, setClassName] = useState([])
    const [preClassName, setPreClassName] = useState(null)

    const[file,setFile] = useState(null)
    const [editing, setEditing] = useState({
        editingId : null,
        editingClass : "",
     
    })
 
      
    





    





   




    
    const studentProfileHandler = async () =>{
              const formData = new FormData()
                formData.append("file",file)
                formData.append("upload_preset","profile")
                Axios.post("https://api.cloudinary.com/v1_1/dqiraxirr/image/upload",formData,{
                    headers:{"Content-Type" : "multipart/form-data"}

                })
                .then( async res => {
                    console.log(res?.data?.url)
                    try {
                        const docRef = await addDoc(collection(db, "Students Profile"),{
                            studentName : studentName.toLowerCase(),
                            studentFather : father.toLowerCase(),
                            rollNumber : roll.toLowerCase(),
                            contact : contact.toLowerCase(),
                            CNIC : cnic.toLowerCase(),
                            Course : courseName.toLowerCase(),
                            Class : studentClass.toLowerCase() ,
                            studentImg : res?.data?.url,
                            previousClass : ""
                           
            
                           
                          
                          
                        });
                        alert("Student Profile Added")
                        console.log("Document written with ID: ", docRef.id);
                      }
                    catch (e) {
                        console.error("Error adding document: ", e);
                    }

                    })
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
            });
                console.log("Post", posts); 
                setClasses(posts)
              
            });
            }
          
            realTimeData();
            return () =>{
              console.log("Clean up")
              unsubscribe();
            }

          
            
            
          },[])
    

    const pageHandler = () =>{
        navigate("/")

    }

    const input =  document.getElementById("inputt")

    const attendenceHandler = () =>{
        let showDiv = document.getElementById("show-div")


        if(input.value !== "" ){
            let any = document.getElementById("class-div")
            any.style.display = "none"
            showDiv.style.display = "block"
            setAttendenceClass(input.value.toLowerCase())
        }

        else{
            alert("Enter correct class name first")
        }


    }



      const getDataHandler = () =>{
        
    // Get Real-Time Data====================================================
    // useEffect(() =>{
        if (input.value !== null) {
            
        
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
          const q = query(collection(db, "Students Profile"), where("rollNumber", "==", queryRoll));
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
        console.log(attendenceClass)

        }
      
        realTimeData();
        return () =>{
          console.log("Clean up")
          unsubscribe();
        }
        
    //   },[])


      }
      else{
        alert("Enter Class First")
      }
    }

    const deleteProfileHandler = async (studentId) =>{
        await deleteDoc(doc(db, "Students Profile", studentId))


    }


    const markAttendenceHandler = () =>{
        let body = document.getElementById("bodyy")
        if( body.style.display = "none") {
            body.style.display = "block"

        }

    }

    const resetValueHandler = () =>{
        let rollInput = document.getElementById("rollinput")
        rollInput.value = ""



    }

    const updatedPost = async (e) =>{
        await updateDoc(doc(db, "Students Profile", editing.editingId), {
            previousClass :preClassName ,
            Class: editing.editingClass,
        })
        setEditing({
            editingId : null,
            editingClass: "",
          
        })
    }



    


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
                                    // setPreClassName(e.target.value)
                                    
                                }} />  <br />

                                Choose Student Profile
                                <input type="file" onChange={(e) => {
                                    // console.log(e.target.files[0].name)
                                    setFile(e.target.files[0])

                                }}/> <br />


                            <Button variant="contained" type='submit' onClick={studentProfileHandler} startIcon={<AddIcon />}>Add</Button>

                                
                        </Typography>
                        </Box>
                </Modal>
                <Button variant="contained" onClick={markAttendenceHandler}>Mark Attendence</Button>
                <Button variant="contained" type='submit' onClick={pageHandler}>Check Classes</Button>
                <Button variant="contained" onClick={markAttendenceHandler}>Mark Attendence</Button>


                    </Toolbar>
                </AppBar>
            </Box>
         </div>

         <div className='body-div' id='bodyy'>
            <div className='class' id='class-div'>
                <h3>Enter Class Name For Attendence </h3>

            
                <input type="text" id='inputt'
                  />

                <button onClick={attendenceHandler}>Submit</button>

            </div>
            
            <div id='show-div'>
                
                
                <div className='course-heading'>
                    <h1>{attendenceClass}</h1>

                </div>
                <div className='roll-input'>
                    <input type="text" placeholder='Enter Your roll Number' onClick={ resetValueHandler} id= "rollinput"
                    onChange={(e) =>{
                        setQueryRoll(e.target.value)


                    }}
                     />



                     <button onClick={getDataHandler}>Enter</button>

                </div>

                {
                  studentProfile?.map((eachProfile,i) => (
              

                    (eachProfile.Course == attendenceClass)?
                    <div className='student-card' key={i}>

                    <Card sx={{ maxWidth: 500 }} id = "card">
                        <CardActionArea>
                            <CardContent>
                            
                            <Typography variant="body2" color="text.secondary" className='card-body'>
                                <div className='stu-img'>
                                    <img src={eachProfile.studentImg} alt="" height="350" width = "350" />
                                </div>

                                <div className='stu-name'>
                                    <h1>{eachProfile?.studentName}</h1>  
                                    
                                    {
                                        classes.map((eachPost,i) => (
                                            <div key={i}>
                                                {(eachPost.Batch == "8")?
                                                    <>
                                                    <div class="dropdown">
                                                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                            Dropdown button
                                                        </button>
                                                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                            <li><a class="dropdown-item" href="#">Present</a></li>
                                                            <li><a class="dropdown-item" href="#">Absent</a></li>
                                                            <li><a class="dropdown-item" href="#">Leave</a></li>

                                                        </ul>
                                                    </div>
                   
                                                    </>
                                                    :
                                                    <h3>No</h3>
                                                }
                                            </div>

                                        ))
                                    }


                                </div>

                                <div className='first'>
                                    <p>Roll Number :{eachProfile?.rollNumber}</p>
                                    <p>Father Name :{eachProfile?.studentFather}</p>

                                </div>

                                <div className='second'>
                                    <p>CNIC :{eachProfile?.CNIC}</p>
                                    <p>Contact Number :{eachProfile?.contact}</p>

                                </div>

                                <div className='third'>
                                    <p>Course :{eachProfile?.Course}</p>
                                    {/* <p>Class :{eachProfile?.Class}</p> */}
                                  <p>Class :{(eachProfile.id === editing.editingId)?
                                <>
                                   <input type="text" id='preClass' value={editing.editingClass} 
                                    onChange = {(e) =>{
                                    setEditing({...editing, editingClass: e.target.value})
                                    setPreClassName(eachProfile?.Class)

                                    }}/>
                                    <button type='submit' onClick={updatedPost}>Transfer</button>
                                    

                                </>

                                    : eachProfile?.Class}</p>  
                            

                                </div>
                                {/* {console.log("asdadsdasadsds"+preClassName)} */}
                               
                                
                              

                            </Typography>
                            <Button variant="text" onClick={() =>{
                                deleteProfileHandler(eachProfile?.id)

                            }}>Eliminate Student</Button>
                                <Button variant="text" onClick={() =>{
                                      setEditing({
                                        editingId : eachProfile?.id,
                                        editingClass: eachProfile?.Class,

                                      })

                                }}
                                >
                                    Transfer Student</Button>
                            </CardContent>
                        </CardActionArea>
                        
                    </Card>

                </div>
                :
                <div key={i}>
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="error">This Student doesn't exist in this course</Alert>
                    </Stack>

                 

                </div>
                

                  ))
                
                 }

                



  

              


            </div>

        

         </div>

        



    </div>

    
    

    )
    
        
    


}


export default Student;