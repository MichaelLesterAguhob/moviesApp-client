
import { useState } from "react";
import { Button, Card, Col, Container, Modal, Form } from "react-bootstrap";
import editIcon from '../images/edit-icon.png'
import delIcon from '../images/delete-icon.png'
import Swal from "sweetalert2";


export default function WorkoutCard({workoutData, fetchData}) {

    const {name, status, duration, dateAdded, _id} = workoutData;     
    const [showHideModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [newDuration, setDuration] = useState('');
    const [toEdit, setToEdit] = useState('');

    const deleteWorkout = async(id) => {
        if(id === null  || !id) {
            return (
                Swal.fire({
                    title: 'Something went wrong.',
                    icon: 'error',
                    timer: 1000
                })
            )
        }

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/deleteWorkout/${id}`, {
            method: "DELETE",
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })

        if(!response.ok) {
            let respo = await response.json();
            throw new Error(respo.message || respo.error || "Failed on deleting workout");
        }

        const data = await response.json();
        if(data) {
            Swal.fire({
                title: 'Deleted successfully',
                icon: 'success',
                timer: 1000
            })
            fetchData();
        }
        
    }

    const showModal = (toEdit) => {
        setShowModal(true);
        setToEdit(toEdit)
        setTitle(name);
        setDuration(duration);
    }
    
    function hideModal() {
        setShowModal(false);
    }

    const updateWorkout = async (e, toEdit) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/updateWorkout/${toEdit}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: title,
                    duration: newDuration
                })
            })
            if(!response.ok) {
                let respo = await response.json();
                throw new Error(respo.message || respo.error || 'Update Failed');
            }    

            const data = await response.json();
            if(data) {
                // console.log(data);
                hideModal();
                fetchData();
                Swal.fire({
                    title: data.message,
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

        } catch(error) {
            console.error(error);
        }
    }

    const markAsCompleted = async (id) => {
        try {
            let response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/completeWorkoutStatus/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }) 
            if(!response.ok) {
                let respo = await response.json();
                throw new Error(respo.message || respo.error || 'Failed on updating workout status')
            }
            const data = await response.json();
            if(data) {
                fetchData();
                Swal.fire({
                    title: data.message,
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

        } catch(error) {
            console.error(error)
        }
    
    } 

    return (
        <>
        <Col xs={12} sm={10} md={6} xl={4} className="py-2">
            <Card>
                <Card.Body className="d-flex flex-column ">
                    <Container className="d-flex gap-2">
                        {
                            status === 'pending' ?
                            <>
                                <Button className="btn btn-light ms-auto p-0" onClick={() => showModal(_id)}><img src={editIcon} alt="edit"/></Button>
                                <Button className="btn btn-light p-0" onClick={() => deleteWorkout(_id)}><img src={delIcon} alt="del"/></Button>
                            </>
                            : 
                            <Button className="btn btn-light ms-auto p-0" onClick={() => deleteWorkout(_id)}><img src={delIcon} alt="del"/></Button>
                        }
                    </Container>
                    <Card.Title><h3>{name}</h3></Card.Title>
                    <Card.Text>Duration: {duration}</Card.Text>
                    <Card.Text className={status === "pending" ? 'text-danger' : 'text-success'}>Status: {status}</Card.Text>
                    {/* <Card.Text>{dateAdded}</Card.Text> */}
                </Card.Body>
                {
                    status === "pending" ?
                        <Card.Footer className="d-flex justify-content-center">
                            <Button className="btn btn-primary" onClick={() => {markAsCompleted(_id)}}>Mark as Done</Button>
                        </Card.Footer>
                    :
                        null
                }
            </Card>
        </Col>

         <Modal show={showHideModal} onHide={hideModal} > 
            <Modal.Header closeButton>
                <Modal.Title>Edit Workout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter title" required value={title} onChange={(e) => setTitle(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mt-2">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control type="text" placeholder="Enter duration" required value={newDuration} onChange={(e) => setDuration(e.target.value)}/>
                    </Form.Group>
                    <Container className="d-flex justify-content-end p-2 pt-3 gap-2">
                        <Button type="submit" onClick={(e) => {updateWorkout(e, toEdit)}}>Update</Button>
                        <Button className="btn btn-warning" onClick={hideModal}>Close</Button>
                    </Container>
                </Form>
            </Modal.Body>
        </Modal>

        </>
    )
}