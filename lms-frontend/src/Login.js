import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();  

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Attempting login with", email, password);

        axios.post('http://localhost:8000/api/users/login/', {
            email: email,
            password: password
        }, { withCredentials: true })  
        .then((response) => {
            console.log('Logged in:', response.data);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('user_id', response.data.user_id);
            
            localStorage.setItem('token', response.data.token);


            navigate('/booklist');  
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            setError('Invalid login credentials');  
        });
    };
    
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
