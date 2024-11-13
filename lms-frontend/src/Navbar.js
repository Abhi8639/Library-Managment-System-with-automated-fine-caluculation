import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const isAuthenticated = !!localStorage.getItem('token'); 

    const userRole = localStorage.getItem('role'); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('user_id', 0);
        navigate('/login');  
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">Library Management</div>
            <ul className="navbar-links">
                <li><Link to="/booklist">Home</Link></li>
                <li><Link to="/booklist">Books</Link></li>

                {isAuthenticated ? (
                    <>
                        
                        <li><Link to="/my-bookings">My Bookings</Link></li>

                        <li><Link to="/my-reservations">My Reservations</Link></li>
                        {userRole === 'Admin' && (
                            <li><Link to="/bookings">All Bookings</Link></li>
 
                        )}
{userRole === 'Admin' && (
                             <li><Link to="/returnedbookings">Returned Bookings</Link></li>
 
                        )}
                        {userRole === 'Admin' && (
                             <li><Link to="/reservations">All Reservations</Link></li>
 
                        )}
                           {userRole === 'Admin' && (
                             <li><Link to="/booktable">Manage Books</Link></li>
 
                        )}

                        <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
