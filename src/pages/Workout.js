import { useState, useEffect, useContext } from "react";
import { Button, Container, Row, Modal, Form } from "react-bootstrap";
import WorkoutCard from "../components/WorkoutCard"
import UserContext from "../UserContext";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import plusIcon from '../images/plus-icon.png';

export default function Workout() {
    const {user} = useContext(UserContext);
    const token = localStorage.getItem('token');
    const [workouts, setWorkouts] = useState([]); 

    const [workoutName, setWorkoutName] = useState('');
    const [workoutDuration, setWorkoutDuration] = useState('');
    const [showHideModal, setShowModal] = useState(false);
    const [addBtnEnable, setAddBtnEnable] = useState(false);

    useEffect(() => {
        if(workoutName !== "" && workoutDuration !== "") {
            setAddBtnEnable(true);
        } else {
            setAddBtnEnable(false);
        }
    }, [workoutName, workoutDuration])

    const showModal = () => {
        setShowModal(true);
    }

    function hideModal() {
        setShowModal(false);
        setWorkoutName('');
        setWorkoutDuration('');
    }

    const addWorkout = async (e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/addWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: workoutName,
                duration: workoutDuration
            })
        })

        if(!response.ok) {
            let respo = await response.json()
            throw new Error(respo.message || respo.error || 'Adding new workout failed')
        }

        const data = await response.json();
        if(data) {
            // console.log(data)
            setWorkoutName('');
            setWorkoutDuration('');
            hideModal();
            fetchData();
            Swal.fire({
            title: "Added successfully",
                icon: 'success',
                timer: 1000
            })
        } else {
            Swal.fire({
                title: "Something went wrong",
                icon: 'error',
                timer: 1000
            })
        }

    }

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
                        if(workout.status === 'pending') {
                            hasPending = true;
                            return(
                                <WorkoutCard key={workout._id} workoutData={workout} fetchData={fetchData}/>
                            )
                        } 
                    }))
                    if(!hasPending) {
                        setWorkouts(() => {
                            return(
                                <h1 className="text-warning">Oops! You don&apos;nt have workout(s) added yet.</h1>
                            )
                        })
                    }
                } else {
                    setWorkouts(() =>{
                        return(
                            <h1 className="text-warning">Oops! You don&apos;nt have workout(s) added yet.</h1>
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

    const [showBtnText, setShowBtnText] = useState(true);
    window.addEventListener('resize', function(){
        if(window.innerWidth > 398) {
            setShowBtnText(true);
        } else {
            setShowBtnText(false);
        }
    })

    return (
        <>
            {
                (user.id === null) ?
                <Navigate to={'/login'}/>
                :
            
                <Container className="h-100 overflow-auto workoutCardContainer pt-5">
                    <Container className="bg-light rounded mt-5 d-flex justify-content-between align-items-center">
                        <h1 className="text-dark p-2">Your Workouts</h1>
                        <Button id='addWorkout' className="btn btn-success h-75" onClick={showModal}><img src={plusIcon} style={{width: '1.5rem'}}/> {(showBtnText === true) ? "NEW" : ""}</Button>
                    </Container>
                    <Row className="d-flex justify-content-center mt-3 mb-5">
                        {workouts}
                    </Row>
                </Container>
            }
            
            <Container>
            <Modal show={showHideModal} onHide={hideModal}> 
                <Modal.Header closeButton>
                    <Modal.Title>Add New</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" required value={workoutName} onChange={(e) => setWorkoutName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mt-2">
                            <Form.Label>Duration</Form.Label>
                            <Form.Control type="text" placeholder="Enter duration" required value={workoutDuration} onChange={(e) => setWorkoutDuration(e.target.value)}/>
                        </Form.Group>
                        <Container className="d-flex justify-content-end p-2 pt-3 gap-2">
                            {
                                addBtnEnable == true ?
                                <Button type="submit" onClick={(e) => addWorkout(e)}>Add</Button>
                                :
                                <Button type="submit" onClick={(e) => addWorkout(e)} disabled>Add</Button>
                            }
                            <Button className="btn btn-warning" onClick={hideModal}>Close</Button>
                        </Container>
                    </Form>
                </Modal.Body>
            </Modal>
            </Container>
        </>
    )
}
