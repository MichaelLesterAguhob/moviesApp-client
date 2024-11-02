import { useState, useEffect, useContext } from "react";
import { Container, Row } from "react-bootstrap";
import WorkoutCard from "../components/WorkoutCard"
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CompletedWorkout() {
    const {user} = useContext(UserContext);
    const token = localStorage.getItem('token');
    const [workouts, setWorkouts] = useState([]); 

    const fetchData = async () => {
        try {
            if( token !== null) { 
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/getMyWorkouts`, {
                    headers: {Authorization: `Bearer ${token}`}
                })
                
                if(!response.ok) {
                    let respo = await response.json();
                    throw new Error(respo.message || respo.error || "Get Workout Failed");
                }
                
                const data = await response.json();
                if(data.workouts) {
                    let hasPending = false;
                    setWorkouts(data.workouts.map(workout => {
                        if(workout.status === 'completed') {
                            hasPending = true;
                            return(
                                <WorkoutCard key={workout._id} workoutData={workout} fetchData={fetchData}/>
                            )
                        } 
                    }))
                    if(!hasPending) {
                        setWorkouts(() => {
                            return(
                                <h1 className="text-warning">Oops! You don&apos;nt have workout(s) completed yet.</h1>
                            )
                        })
                    }
                } else {
                    setWorkouts(() =>{
                        return(
                            <h1 className="text-warning">Oops! You don&apos;nt have workout(s) completed yet.</h1>
                        )
                    })
                }
            } else {
                setWorkouts( () => {
                    return(
                        <h1 className="text-light">No workout yet. Add one now.</h1>
                    )
                })
            }
        } catch (error) {
            Swal.fire({
                title: error,
                icon: 'error',
                timer: 1500
            })
       }
    } 

    useEffect(() => {
        fetchData();
    }, [])

    

    return (
        (user.id === null) ?
        <Navigate to={'/login'}/>
        :
        <Container className="h-100 overflow-auto workoutCardContainer mt-5 pt-5">
            <h1 className="mt-5 p-2 rounded bg-light text-dark">Completed Workouts</h1>
            <Row className="d-flex justify-content-center mt-3 mb-5">
                 {workouts}
            </Row>
        </Container>
    )
}
