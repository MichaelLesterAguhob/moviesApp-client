
import { Card, Button, Col } from "react-bootstrap";

export default function MoviesCard({moviesData}) {

    return(
        <Col xs={12} sm={10} md={8} lg={4}>
            <Card>
                <Card.Header>
                    <Card.Title>{moviesData.title}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text>{moviesData.description}</Card.Text>
                </Card.Body>
            </Card>
        </Col>
    )
}

