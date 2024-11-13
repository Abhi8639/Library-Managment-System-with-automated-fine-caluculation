import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Bookings.css'; // Assuming you have a CSS file for styling

const ReturnedBookings = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReturnedLoans(); // Fetch returned loans on component mount
    }, []);

    const fetchReturnedLoans = () => {
        setLoading(true);
        axios.get(`http://localhost:8000/api/loans/returned_loans/`)
            .then(response => {
                setLoans(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('There was an error fetching returned bookings');
                setLoading(false);
            });
    };

    if (loading) return <p>Loading returned bookings...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="bookings-container">
            <h1>All Returned Bookings</h1>
            {loans.length === 0 ? (
                <p>No returned bookings found.</p>
            ) : (
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Book Title</th>
                            <th>Category</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                            <th>Return Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan.loan_id}>
                                <td>{loan.user_name}</td>
                                <td>{loan.book_title || 'Unknown Title'}</td>
                                <td>{loan.book_category || 'Unknown Category'}</td>
                                <td>{loan.issue_date}</td>
                                <td>{loan.due_date}</td>
                                <td>{loan.return_date || 'Not Returned'}</td>
                                <td>{loan.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReturnedBookings;
