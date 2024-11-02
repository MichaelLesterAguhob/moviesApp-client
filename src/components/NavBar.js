import { useContext, useRef } from "react";
import UserContext from "../UserContext";

import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
    const {user, setUser} = useContext(UserContext);
    const toggler = new useRef(null);
    function closeNavbar() {
        if(toggler.current && window.innerWidth <= 991){
            toggler.current.click();
        }
    }
    window.addEventListener('resize', () => {
        const viewportWidth = window.innerWidth;
        // console.log(`Viewport width: ${viewportWidth}px`);
    });
    return (
        <Navbar bg="primary" expand="lg" fixed="top" className="text-light">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className='text-light'>Movies</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" ref={toggler}/>
                <Navbar.Collapse id="basic-navbar-nav">
                   

                    {
                        user.id !== null ?
                        <>
                            <Nav className="mx-auto" >
                                <Nav.Link onClick={() => closeNavbar()} className='text-light' as={NavLink} to="/workouts" exact="true">Workout</Nav.Link>
                                <Nav.Link onClick={() => closeNavbar()} className='text-light' as={NavLink} to="/completed" exact="true">Completed</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={() => closeNavbar()} className='text-light text-center bg-danger rounded' as={NavLink} to="/logout" exact="true">Logout</Nav.Link>
                            </Nav>
                        </>
                        :
                        <>
                            <Nav className="ms-auto">
                                <Nav.Link onClick={() => closeNavbar()} className='text-light' as={NavLink} to="/login" exact="true">Login</Nav.Link>
                            </Nav>
                            <Nav>
                                <Nav.Link onClick={() => closeNavbar()} className='text-light' as={NavLink} to="/register" exact="true">Register</Nav.Link>
                            </Nav>
                        </>
                    }
                   
                  
                </Navbar.Collapse>
            </Container>
        </Navbar>
  );
}
