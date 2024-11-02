
import { useState, useEffect} from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {UserProvider} from './UserContext';

import './App.css';
import NavBar from './components/NavBar';
import Register from './pages/Register';
import Login from './pages/Login';
import Workout from './pages/Workout';
import CompleteWorkout from './pages/CompletedWorkout';
import Logout from './components/Logout';
import Footer from './components/Footer';

function App() {
  
    const [user, setUser] = useState({
        id: null
    })

    function unsetUser() {
        localStorage.clear();
    }

    
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             if(localStorage.getItem('token') !== null) {
    //                const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/users/details`, {
    //                     headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
    //                 })
                    
    //                 if(!response.ok) {
    //                     let respo = await response.json();
    //                     throw new Error(respo.message || respo.error || "Getting user details failed")
    //                 }
                    
    //                 const data = await response.json();
    //                 if(data) {
    //                     setUser({
    //                         id: data.user._id
    //                     })
    //                 }
    //             } else {
    //                 setUser({
    //                     id: null
    //                 })
    //             }
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    //     fetchData();
    // }, [])
   
  
    return (
        <UserProvider value={{user, unsetUser, setUser}}>
            <Router>
                <NavBar />
                <Container className='bg-secondary main-container' fluid>
                    <Routes>
                        <Route path='/' element={<Workout />}/>
                        <Route path='/register' element={<Register />}/>
                        <Route path='/login' element={<Login />}/>
                        <Route path='/logout' element={<Logout />}/>
                        {/* <Route path='/workouts' element={<Workout />}/>
                        <Route path='/completed' element={<CompleteWorkout />}/> */}
                    </Routes>
                </Container>
                <Footer />
            </Router>
        </UserProvider>
  );
}

export default App;
