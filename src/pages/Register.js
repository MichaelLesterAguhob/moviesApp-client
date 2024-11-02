
import { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitBtn, setSubmitBtn] = useState(false);

    const register = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
    
            if(!response.ok) {
                let responseData = await response.json();
                console.log(responseData)
                throw new Error(responseData.error || "Registration Failed.")
            }
    
            const data = await response.json();
            if(data) {
                if(data.message === "Registered Successfully") {
                    Swal.fire({
                        title: data.message,
                        icon: 'success',
                        timer: 1500,
                    })
                    setEmail('');
                    setPassword('');
                } else if(data.error === "Password must be atleast 8 characters") {
                    Swal.fire({
                        title: data.error,
                        icon: 'error',
                        timer: 1500,
                    })
                }
            } else {
                Swal.fire({
                    title: 'Something went wrong',
                    icon: 'error',
                    timer: 1500,
                })
            }
        } catch (error) {
            Swal.fire({
                title: error,
                icon: 'error',
                timer: 1500,
            })
        }
    }

    useEffect(() => {
        if(email !== "" && password !== "") {
            setSubmitBtn(true);
        } else {
            setSubmitBtn(false);
        }
    }, [email, password])

    return (
        <Container className="mt-5 mb-5 h-75 d-flex flex-column">
            <h1 className="tagline mt-5 mb-5 mx-auto text-light fw-bolder text-center">Unleash Your Potential: Fitness Starts Here!</h1>
            <Row className="my-auto pb-5">
                <Col className="mx-auto" xs={12} sm={9} md={7} lg={5}>
                    <Form onSubmit={(e) => register(e)} className="rounded p-4 shadow bg-light">
                        <h1 className="text-center mb-4">Register</h1>
                        
                        <Form.Group className="mb-4">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required placeholder="Enter valid email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span className="text-danger">Password must be atleast 8 characters</span>
                        </Form.Group>

                        {
                            submitBtn === true ?
                            <Button type="submmit" className="btn btn-primary w-100 mb-4">Register!</Button>
                            :
                            <Button type="submmit" className="btn btn-primary w-100 mb-4" disabled>Register!</Button>
                        }

                        <span className="">Already have an account? <Link to={'/login'}>Login</Link></span>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}