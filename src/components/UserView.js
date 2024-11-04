
import { useState, useEffect } from "react";
import { Container, Row, Button, Modal } from "react-bootstrap";
import MoviesCard from "./MoviesCard";
import ViewMovie from "./ViewMovie";

export default function UserView() {
    
    const [movies, setMovies] = useState([]);

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
                setMovies(data.movies.map((movie) => {
                    return (
                        <MoviesCard key={movie._id} movie={movie} viewMovie={viewMovie}/>
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


    const viewMovie = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/getMovie/${id}`, {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            });
            
            if(!response.ok) {
                let respo = await response.json();
                throw new Error(respo.message || respo.error || 'Error on getting a movie')
            }
            
            const data = await response.json();
            if(data) {
                setMovies(() => {
                    return (
                        <ViewMovie key={data._id} movie={data} viewMovie={viewMovie}/>
                    )
                }) 
            }
        } catch(error) {
            console.error(error)
        }       
    }

    return (
        <Container className="mt-5" fluid> 
            <h1 className="text-light">Movies</h1>

            <Row className="moviesCardRow d-flex justify-content-center">
                 {movies}
            </Row>
        </Container>
    )
}