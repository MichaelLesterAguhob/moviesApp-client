
import { useEffect, useState } from "react";
import { Table, Form, Modal, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2";

export default function AdminDashboard() {

    const [movies, setMovies] = useState([]);

    const [toEdit, setToEdit] = useState('');
    const [editTitle, setTitle] = useState('');
    const [editDirector, setDirector] = useState('');
    const [editYear, setYear] = useState('');
    const [editDescription, setDescription] = useState('');
    const [editGenre, setGenre] = useState('');
    const [editComments, setComments] = useState('');

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
                        <tr key={movie._id} disabled>
                            <td>{index + 1}</td>
                            <td>{movie.title}</td>
                            <td>{movie.director}</td>
                            <td>{movie.year}</td>
                            <td>{movie.description}</td>
                            <td>{movie.genre}</td>
                            <td className="d-flex flex-column gap-2">
                                <Button className="btn btn-primary">Edit</Button>
                                <Button className="btn btn-danger" onClick={() => deleteMovie(movie._id)}>Delete</Button>
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
  
            <h1 className="text-light">Welcome Admin!</h1>
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
        </Container>
    )

}






