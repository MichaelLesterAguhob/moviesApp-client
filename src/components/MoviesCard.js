
import { useEffect, useState } from "react";
import { Card, Button, Col, Form, Container } from "react-bootstrap";
import Swal from "sweetalert2";

export default function MoviesCard({movie, viewMovie}) {

    const [comment, setComment] = useState('');
    const [onCommentMode, setOnCommentMode] = useState(false);

    function showBtn(btnToShow, showInput){
        if(comment !== "") {
            document.querySelectorAll(`.${btnToShow}`).forEach(btn => {
                btn.style.display = 'flex';
            });

            if(!onCommentMode) {
                document.querySelectorAll(`.text-area`).forEach(textArea => {
                    textArea.setAttribute('disabled', 'true');
                });
                document.querySelectorAll(`.${showInput}`).forEach(textArea => {
                    textArea.removeAttribute('disabled');
                    textArea.focus();
                });
            }

            setOnCommentMode(true);
        } else {
            document.querySelectorAll(`.${btnToShow}`).forEach(btn => {
                btn.style.display = 'none';
            });
            document.querySelectorAll(`.text-area`).forEach(textArea => {
                textArea.removeAttribute('disabled');
            });
            
            setOnCommentMode(false);
        }
    }

    function cancelComment() {
        setComment('');
        document.querySelectorAll('.card-btn .btn').forEach(btn => {
            btn.style.display = 'none';
        });

        document.querySelectorAll(`.text-area`).forEach(textArea => {
            textArea.removeAttribute('disabled');
        });
        setOnCommentMode(false);
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
        <Col xs={12} sm={10} md={4} lg={3} className="py-3">
            <Card className="moviesCard">
                <Card.Title className="d-lg-flex justify-content-between m-0 p-0 px-2 mb-1">
                    <h4 className="title my-auto">{movie.title}</h4>
                    <h6 className="my-auto">{movie.year}</h6>
                </Card.Title>
                <Card.Body className="p-0 cards-body" onClick={() => {viewMovie(movie._id)}}>
                    <Card.Text className="genreDirector mb-1 px-2">Genre: {movie.genre} <br></br> Directior: {movie.director}</Card.Text>
                    <Card.Text className="movieDescription px-2 d-flex rounded">{movie.description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Form onSubmit={(e) => commentToPost(e, movie._id)}>
                        <Form.Group className="mb-1">
                            <textarea className={`comment-input-${movie._id} form-control text-area`} placeholder="Comment here..."
                                value={comment}
                                onChange={(e) => {setComment(e.target.value)}}
                                onKeyUp={() => showBtn(`btn-cont-${movie._id}`, `comment-input-${movie._id}`)}
                            />
                        </Form.Group>
                        <Container className="card-btn d-flex justify-content-end">
                            <Button type="submit" style={{display: 'none'}} className={`btn btn-primary me-2 btn-cont-${movie._id}`}>Submit</Button>
                            <Button style={{display: 'none'}} className={`btn btn-warning btn-cont-${movie._id}`} onClick={() => cancelComment()} >Cancel</Button>
                        </Container>    
                    </Form>
                </Card.Footer>
            </Card>
        </Col>
    )
}
