
import { Card, Button, Col, Form } from "react-bootstrap";

export default function MoviesCard({movie}) {

    return(
        <Col xs={12} sm={10} md={4} lg={3} className="py-3">
            <Card className="moviesCard">
                <Card.Title className="d-lg-flex justify-content-between m-0 p-0 px-2 mb-1">
                    <h4 className="title my-auto">{movie.title}</h4>
                    <h6 className="my-auto">{movie.year}</h6>
                </Card.Title>
                <Card.Body className="p-0">
                    <Card.Text className="genreDirector mb-1 px-2">Genre: {movie.genre} <br></br> Directior: {movie.director}</Card.Text>
                    <Card.Text className="movieDescription px-2 d-flex rounded">{movie.description}</Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Form>
                        <Form.Group className="mb-1">
                            <textarea className="comment-input form-control" placeholder="Comment here..."></textarea>
                        </Form.Group>
                        <Button className="btn btn-primary me-2">Submit</Button>
                        <Button className="btn btn-warning">Cancel</Button>
                    </Form>
                </Card.Footer>
            </Card>
        </Col>
    )
}

