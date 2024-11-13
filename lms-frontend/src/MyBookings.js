import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentPage from './PaymentPage'; 
import './MyBookings.css';

const stripePromise = loadStripe('pk_test_51QJIbLFFxitBtFz7XBQODYdS2xQnO6UJKwLk2cHaaELqF4Ry9lVH3y9dHPsfS4ThzuIRpIGyK6Qw0LplfDtydKFP00oRXe2ynx');

const MyBookings = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [currentLoanId, setCurrentLoanId] = useState(null);

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = () => {
        setLoading(true);
        axios.get(`http://localhost:8000/api/loans/my_bookings/${userId}`)
            .then(response => {
                setLoans(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('There was an error fetching your bookings');
                setLoading(false);
            });
    };

    const handleReturnBook = async (loanId, fine) => {
        if (fine > 0) {
            axios.post(`http://localhost:8000/api/loans/return/`, { loan_id: loanId })
                .then(async (response) => {
                    setClientSecret(response.data.client_secret);
                    setCurrentLoanId(loanId);
                })
                .catch(error => {
                    console.error('Error with payment initiation:', error);
                    alert('Payment initiation failed, please try again.');
                });
        } else {
            confirmReturn(loanId, true);
        }
    };

    const confirmReturn = (loanId, paymentSuccessful) => {
        axios.post(`http://localhost:8000/api/loans/confirm_return/`, { loan_id: loanId, payment_successful: paymentSuccessful })
            .then(() => {
                alert('Book returned successfully!');
                fetchLoans();
                setClientSecret('');
                setCurrentLoanId(null);
            })
            .catch(error => {
                console.error('Error confirming return:', error);
                alert('There was an error confirming the return.');
            });
    };

    const handlePaymentSuccess = () => {
        confirmReturn(currentLoanId, true);
    };

    const handleCancelPayment = () => {
        setClientSecret('');
        setCurrentLoanId(null);
    };

    const sortedLoans = [...loans].sort((a, b) => {
        return a.status === 'Borrowed' ? -1 : 1;
    });

    if (loading) return <p>Loading your bookings...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="my-bookings-container">
            <h1>My Bookings</h1>

            {clientSecret ? (
                <PaymentPage
                    clientSecret={clientSecret}
                    loanId={currentLoanId}
                    onPaymentSuccess={handlePaymentSuccess}
                    onCancel={handleCancelPayment}
                />
            ) : (
                <>
                    {sortedLoans.length === 0 ? (
                        <p>You have no active bookings.</p>
                    ) : (
                        <table className="my-bookings-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th>Fine</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedLoans.map((loan) => (
                                    <tr key={loan.loan_id}>
                                        <td>{loan.book_title || 'Unknown Title'}</td>
                                        <td>{loan.book_category || 'Unknown Category'}</td>
                                        <td>{loan.issue_date}</td>
                                        <td>{loan.due_date}</td>
                                        <td>{loan.fine}</td>
                                        <td>{loan.status}</td>
                                        <td>
                                            {loan.status === 'Borrowed' && (
                                                <button onClick={() => handleReturnBook(loan.loan_id, loan.fine)}>
                                                    Return Book
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

const App = () => (
    <Elements stripe={stripePromise}>
        <MyBookings />
    </Elements>
);

export default App;
