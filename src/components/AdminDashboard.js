
import { useEffect, useState } from "react";
import { Table, Form, Modal, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import AddMovie from "./AddMovie";

export default function AdminDashboard() {

    const [movies, setMovies] = useState([]);
    const [toEdit, setToEdit] = useState('');
    const [enableUpdate, setEnableUpdate] = useState(false);
    const [editTitle, setTitle] = useState('');
    const [editDirector, setDirector] = useState('');
    const [editYear, setYear] = useState('');
    const [editDescription, setDescription] = useState('');
    const [editGenre, setGenre] = useState('');
    const [showModal, setShowModal] = useState(false)


    const fetchMovies = async () => {
        try {
            const responseData = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovies`, {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            });
            
            if(!responseData.ok) {
                let respo = await responseData.json();
                throw new Error(respo.message || respo.error || 'Error on getting all movies')
            }
            
            const data = await responseData.json();
            if(data) {
                setMovies(data.movies.map((movie, index) => {
                    return (
                        <tr key={movie._id}>
                            <td>{index + 1}</td>
                            <td>{movie.title}</td>
                            <td>{movie.director}</td>
                            <td>{movie.year}</td>
                            <td className="p-0"><p className="movieDescription">{movie.description}</p></td>
                            <td>{movie.genre}</td>
                            <td className="buttons">
                                <Button className="btn btn-primary" 
                                onClick={() => showEditModal(movie._id, movie.title, movie.director, movie.year, movie.description, movie.genre)}>Edit</Button>
                                <Button className="btn btn-danger mt-2" onClick={() => deleteMovie(movie._id)}>Delete</Button>
                            </td>
                        </tr>
                    )
                }))
            }
        } catch(error) {
            console.error(error)
        }
        
    }

    useEffect(() => {
        fetchMovies();
    }, [])


    function showEditModal(id, title, director, year, desc, genre) {
        setToEdit(id);
        setTitle(title);
        setDirector(director);
        setYear(year);
        setDescription(desc);
        setGenre(genre);

        setShowModal(true);
    }

    function hideModal() {
        setShowModal(false);
    }

    useEffect(() => {
        if(editTitle !== "" && editDirector !== "" && editDescription !== "" && editYear !== "" && editGenre !== "") {
            setEnableUpdate(true)
        } else {
            setEnableUpdate(false)
        }
    }, [editTitle, editDirector, editDescription, editYear, editGenre])


    const updateMovie = async (e) => {
        e.preventDefault()
        try {       
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/updateMovie/${toEdit}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: editTitle,
                    director: editDirector,
                    year: editYear,
                    description: editDescription,
                    genre: editGenre
                })
            })

            if(!response.ok) {
                let respo = await response.json();
                throw new Error(respo.message || respo.error || 'Failed to update movie details')
            }

            const data = await response.json();
            if(data) {
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    timer: 1000
                })
                fetchMovies();
                hideModal();
            } else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: 'erro',
                    timer: 1000
                })
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    
    const deleteMovie = async(id) => {
        if(id === null  || !id) {
            return (
                Swal.fire({
                    title: 'Something went wrong.',
                    icon: 'error',
                    timer: 1000
                })
            )
        }

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/deleteMovie/${id}`, {
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
            fetchMovies();
        }
        
    }

    return (
        <Container bg='primary' className="mt-5">
  
            <Container className="d-flex justify-content-between" fluid>
                <h1 className="text-light w-100">Welcome Admin!</h1>
                <AddMovie fetchMovies={fetchMovies}/>
            </Container>

            <Table bordered striped hover>
                <thead>
                    <tr className="fs-5">
                        <td>#</td>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Year</th>
                        <th>Description</th>
                        <th>Genre</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {movies}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={hideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Movie Details</Modal.Title>
                </Modal.Header> 
                <Modal.Body>
                    <Form onSubmit={(e) => updateMovie(e)}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" required
                                value={editTitle}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Director</Form.Label>
                            <Form.Control type="text" placeholder="Enter director" required
                                value={editDirector}
                                onChange={e => setDirector(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control type="text" placeholder="Enter year" required
                                value={editYear}
                                onChange={e => setYear(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter year" required
                                value={editDescription}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Genre</Form.Label>
                            <Form.Control type="text" placeholder="Enter year" required
                                value={editGenre}
                                onChange={e => setGenre(e.target.value)}
                            />
                        </Form.Group>
                        <Container className="mt-3 d-flex justify-content-between">
                            {
                                enableUpdate === true ?
                                <Button className="btn btn-success" type="submit">Update</Button>
                                :
                                <Button className="btn btn-success" disabled>Updates</Button>
                            }
                            <Button className="btn btn-warning" onClick={() => hideModal()}>Cancel</Button>
                        </Container>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )

}






