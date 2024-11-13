import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentPage from './PaymentPage';
import './Bookings.css'
const stripePromise = loadStripe('pk_test_51QJIbLFFxitBtFz7XBQODYdS2xQnO6UJKwLk2cHaaELqF4Ry9lVH3y9dHPsfS4ThzuIRpIGyK6Qw0LplfDtydKFP00oRXe2ynx'); 
const Bookings = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [currentLoanId, setCurrentLoanId] = useState(null);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = () => {
        setLoading(true);
        axios.get('http://localhost:8000/api/loans/all_loans/')  
            .then(response => {
                setLoans(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError('There was an error fetching the loan details');
                setLoading(false);
            });
    };

    const handleReturnBook = async (loanId, fine) => {
        if (fine > 0) {
            axios.post('http://localhost:8000/api/loans/return/', { loan_id: loanId })
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
        axios.post('http://localhost:8000/api/loans/confirm_return/', { loan_id: loanId, payment_successful: paymentSuccessful })
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

    if (loading) return <p>Loading loan details...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="bookings-container">
            <h1>All Bookings</h1>

            {clientSecret ? (
                <PaymentPage
                    clientSecret={clientSecret}
                    loanId={currentLoanId}
                    onPaymentSuccess={handlePaymentSuccess}
                    onCancel={handleCancelPayment}
                />
            ) : (
                <>
                    {loans.length === 0 ? (
                        <p>No active bookings found.</p>
                    ) : (
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>Book Title</th>
                                    <th>Category</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th>Fine</th>
                                    <th>Status</th>
                                    <th>Action</th>
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
        <Bookings />
    </Elements>
);

export default App;