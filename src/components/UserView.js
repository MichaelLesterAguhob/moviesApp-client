
import { useState, useEffect } from "react";
import { Container, Row, Button } from "react-bootstrap";
import MoviesCard from "./MoviesCard";

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
                setMovies(data.movies.map((movie, index) => {
                    return (
                        <MoviesCard moviesData={movies} />
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

    return (
        <Container className="mt-5">
            <h1 className="text-light">Movies</h1>

            <Row className="bg-primary h-50">
                 <h1 className="text-light">Movies</h1>
                 {movies}
            </Row>
        </Container>
    )
}