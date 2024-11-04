import { useState, useEffect } from "react";
import { Container, Button, Form, Modal } from "react-bootstrap"
import Swal from "sweetalert2";

export default function AddMovie({fetchMovies}) {

    const [enableAdd, setEnableAdd] = useState(false);
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [year, setYear] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');
    const [modal, setModal] = useState(false)

    useEffect(() => {
        if(title !== "" && director !== "" && description !== "" && year !== "" && genre !== "") {
            setEnableAdd(true)
        } else {
            setEnableAdd(false)
        }
    }, [title, director, description, year, genre])

    function hideAddModal() {
        setModal(false);
        setTitle('');
        setDirector('');
        setDescription('');
        setYear('');
        setGenre('');
    }

    function showAddModal() {
        setModal(true);
    }

    const addMovie = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addMovie`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: title,
                    director: director,
                    year: year,
                    description: description,
                    genre: genre
                })
            });
     
            if(!response.ok) {
                let respo = await response.json();
                throw new Error(respo.message || respo.error || 'Failed adding movie');
            }
    
            const data = await response.json();
            if(data) {
                console.log(data)
                Swal.fire({
                    title: data.message || 'Added Successfully',
                    icon: 'success',
                    timer: 1000
                })
                fetchMovies();
                hideAddModal();
            }else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: 'error',
                    timer: 1000
                })
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container className="my-auto d-flex" style={{width: 'fit-content'}}>
        <Button className="btn btn-primary ms-auto" style={{height: '40px', width: '120px'}}  onClick={() => showAddModal()}>Add Movie</Button>
        
        <Modal show={modal} onHide={hideAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Movie</Modal.Title>
                </Modal.Header> 
                <Modal.Body>
                    <Form onSubmit={(e) => addMovie(e)}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Director</Form.Label>
                            <Form.Control type="text" placeholder="Enter director" required
                                value={director}
                                onChange={e => setDirector(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="text" placeholder="Enter year" required
                                value={year}
                                onChange={e => setYear(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter description" required
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Genre</Form.Label>
                            <Form.Control type="text" placeholder="Enter genre" required
                                value={genre}
                                onChange={e => setGenre(e.target.value)}
                            />
                        </Form.Group>
                        <Container className="mt-3 d-flex justify-content-between">
                            {
                                enableAdd === true ?
                                <Button className="btn btn-success" type="submit">Add</Button>
                                :
                                <Button className="btn btn-success" disabled>Add</Button>
                            }
                            <Button className="btn btn-warning" onClick={() => hideAddModal()}>Cancel</Button>
                        </Container>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}