import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentPage.css';

const PaymentPage = ({ clientSecret, loanId, onPaymentSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handlePayment = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.log("Stripe or elements not initialized.");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (result.error) {
            alert("Payment failed: " + result.error.message);
        } else {
            alert("Payment successful! Book returned.");
            onPaymentSuccess(loanId);  
        }
    };

    return (
        <div className="payment-page">
            <h2>Complete Payment</h2>
            <form onSubmit={handlePayment}>
                <CardElement />
                <button type="submit" disabled={!stripe}>Pay and Return Book</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default PaymentPage;
