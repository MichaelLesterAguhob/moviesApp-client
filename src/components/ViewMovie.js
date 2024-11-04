
import { useState } from "react";
import { Card, Button, Col, Form, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function ViewMovie({movie, viewMovie}) {

    const [comment, setComment] = useState('');


    function cancelComment() {
        setComment('');
    }

    const commentToPost = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/addComment/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    comment: comment
                })
            })

            if(!response.ok) {
                let respo = await response.json();
                throw new Error(respo.message || respo.error || "Error on adding comment");
            }

            const data = await response.json();
            if(data) {
                Swal.fire({
                    title: data.message,
                    icon: 'success',
                    timer: 1000
                })
                viewMovie(movie._id);
                cancelComment();
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
    
    return(
        <Col xs={12} sm={11} md={11} lg={11} className="py-3">
            <Link to={'/login'} className="btn btn-warning mb-2">Back</Link>
            <Card className="viewMovieCard">
                <Card.Title className="d-lg-flex justify-content-lg-start justify-content-md-between m-0 p-0 px-2 mb-1">
                    <h4 className="title my-auto">{movie.title}</h4>
                    <h6 className="my-auto ms-lg-5">{movie.year}</h6>
                </Card.Title>
                <Card.Body className="p-0" onClick={() => {console.log("clicked")}}>
                    <Card.Text className="genreDirector mb-1 px-2">Genre: {movie.genre} <br></br> Directior: {movie.director}</Card.Text>
                    <Card.Text className="movieDescription px-2 d-flex rounded">{movie.description}</Card.Text>
                    <h6 className="ps-3">Comments:</h6>
                    <Container fluid className="comment-container">
                        {
                            movie.comments.map(comment => {
                                return (
                                    <div key={comment._id} className="comments p-2 m-2 rounded">
                                        <h6>UserId: {comment.userId}</h6>
                                        <p>{comment.comment}</p>
                                    </div>
                                )
                            })
                        }
                    </Container>
                </Card.Body>
                <Card.Footer>
                    <Form onSubmit={(e) => commentToPost(e, movie._id)}>
                        <Form.Group className="mb-1">
                            <textarea className={`comment-input-${movie._id} form-control text-area`} placeholder="Comment here..."
                                value={comment}
                                onChange={(e) => {setComment(e.target.value)}}
                            />
                        </Form.Group>
                        <Container className="card-btn d-flex justify-content-end">
                            <Button type='submit' className={`btn btn-primary me-2 `}>Submit</Button>
                            <Button className={`btn btn-warning`} onClick={() => cancelComment()} >Cancel</Button>
                        </Container>    
                    </Form>
                </Card.Footer>
            </Card>
        </Col>
    )
}
