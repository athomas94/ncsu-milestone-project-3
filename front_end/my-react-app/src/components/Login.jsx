import React from "react";
import { useState } from "react";
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../index.scss';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission, validation, and API call here
        try {
            const response = await fetch('https://ncsu-milestone-project-3-i5wf.onrender.com/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.error){
                console.log('Error: ', data.error);
                alert('Error:', data.error);
            } else {
                localStorage.setItem('jwt_token', data.access_token);
                console.log('Success: Login successfully');
                navigate('/dashboard');
            }
        } catch (error) {
            alert('Error: ', error);
            console.log('Error:', error);
        }
       
    }

    return (
        <Container className="login-page">
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2>Login</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label className="form-label">Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label className="form-label">Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Login