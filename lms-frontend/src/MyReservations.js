import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './reservations.css';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [books, setBooks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/reservations/my_reservations/${userId}/`);
                console.log("Reservations Data:", response.data);
                setReservations(response.data);

                const bookIds = response.data.map(reservation => reservation.book_id);
                const bookResponses = await Promise.all(
                    bookIds.map(bookId => axios.get(`http://localhost:8000/api/books/${bookId}/`))
                );

                const booksData = {};
                bookResponses.forEach(bookResponse => {
                    const book = bookResponse.data;
                    booksData[book.book_id] = book;
                });
                setBooks(booksData);

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
    }, [userId]);

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

    const handleBookLoan = (bookId, reservationId) => {
        console.log("Booking attempt for book ID:", bookId);

        if (!userId) {
            alert('Please log in to book a book.');
            return;
        }

        const loanData = {
            user_id: userId,
            book_id: bookId
        };

        axios.post('http://localhost:8000/api/loans/add/', loanData, {
            withCredentials: true,
        })
        .then(response => {
            alert('Book successfully loaned!');

            axios.post(`http://localhost:8000/api/reservations/loan/${reservationId}/`, { withCredentials: true })
                .then(() => {
                    console.log('Status successfully updated to Loaned in the database');
                    setReservations(reservations.map(res => 
                        res.reservation_id === reservationId ? { ...res, status: 'Loaned' } : res
                    ));
                })
                .catch(error => {
                    console.error('Error updating reservation to Loaned in the database:', error);
                });
        })
        .catch(error => {
            console.error('Error during loan creation:', error);
            alert('An error occurred while attempting to book the loan.');
        });
    };

    const statusOrder = { 'Pending': 1, 'Loaned': 2, 'Cancelled': 3 };

    const sortedReservations = [...reservations].sort((a, b) => {
        return statusOrder[a.status] - statusOrder[b.status];
    });

    if (loading) return <p>Loading your reservations...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="my-reservations-container">
            <h1>All Reservations</h1>
            {sortedReservations.length === 0 ? (
                <p>You have no active reservations.</p>
            ) : (
                <table className="my-reservations-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Reservation Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReservations.map((reservation) => {
                            const book = books[reservation.book_id];
                            const availableCopies = book ? book.available_copies : 0;
                            console.log(`Reservation ID: ${reservation.reservation_id}, Status: ${reservation.status}, Available Copies: ${availableCopies}`);
                            
                            return (
                                <tr key={reservation.reservation_id}>
                                    <td>{reservation.book_title || 'Unknown Title'}</td>
                                    <td>{reservation.book_category || 'Unknown Category'}</td>
                                    <td>{reservation.reservation_date}</td>
                                    <td>{reservation.status}</td>
                                    <td>
                                        {reservation.status === 'Pending' && (
                                            <>
                                                <button 
                                                    onClick={() => handleBookLoan(reservation.book_id, reservation.reservation_id)}
                                                    disabled={availableCopies <= 0} 
                                                    className="book-btn"
                                                >
                                                    Book
                                                </button>
                                                <button 
                                                    onClick={() => handleCancelReservation(reservation.reservation_id)}
                                                    className="cancel-btn"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                      
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyReservations;
