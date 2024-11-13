import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import BookList from './BookList';
import Navbar from './Navbar';
import Login from './Login';
import Register from './Register';
import MyBookings from './MyBookings';
import Bookings from './Bookings';
import Reservations from './reservations';
import MyReservations from './MyReservations';
import BookTable from './BookTable';
import ReturnedBookings from './ReturnedBookings';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/booklist" element={<BookList />} />
                    <Route path="/my-bookings" element={<MyBookings/>} />
                    <Route path="/bookings" element={<Bookings/>} />
                    <Route path="/my-reservations" element={<MyReservations/>} />
                    <Route path="/reservations" element={<Reservations/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/booktable" element={<BookTable />} />
                    <Route path="/returnedbookings" element={<ReturnedBookings />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
