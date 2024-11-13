import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reservations.css';


const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('user_id');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchReservations = async () => {
            const userIdForApi = role === 'Admin' ? 0 : userId;
            try {
                const response = await axios.get(`http://localhost:8000/api/reservations/my_reservations/${userIdForApi}/`);
                setReservations(response.data);
                setLoading(false);
            } catch (err) {
                setError('There was an error fetching your reservations');
                setLoading(false);
            }
        };

        if (userId) {
            fetchReservations();
        } else {
            setError('User is not logged in');
            setLoading(false);
        }
    }, [userId, role]);

    const handleCancelReservation = (reservationId) => {
        axios.post(`http://localhost:8000/api/reservations/cancel/${reservationId}/`, { withCredentials: true })
            .then(response => {
                alert('Reservation cancelled successfully!');
                setReservations(reservations.filter(res => res.reservation_id !== reservationId));
            })
            .catch(error => {
                console.error('There was an error cancelling the reservation!', error);
            });
    };

    if (loading) return <p>Loading your reservations...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="my-reservations-container">
            <h1>All Reservations</h1>
            {reservations.length === 0 ? (
                <p>You have no active reservations.</p>
            ) : (
                <table className="my-reservations-table">
                    <thead>
                        <tr>
                        <th>User Name</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Reservation Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.reservation_id}>
                                                                <td>{reservation.user_name}</td>
                                <td>{reservation.book_title || 'Unknown Title'}</td> 
                                <td>{reservation.book_category || 'Unknown Category'}</td>
                                <td>{reservation.reservation_date}</td>
                                <td>{reservation.status}</td>
                                <td>
                                    {reservation.status === 'Pending' && (
                                        <button onClick={() => handleCancelReservation(reservation.reservation_id)}>
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Reservations;
