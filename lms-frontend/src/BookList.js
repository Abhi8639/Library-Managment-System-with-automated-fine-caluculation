import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookList.css';  

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); 

    useEffect(() => {
        axios.get('http://localhost:8000/api/books/')
            .then(response => {
                setBooks(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the books data!', error);
            });

        const userIdFromStorage = localStorage.getItem('user_id');
        const role = localStorage.getItem('role');
        setUserId(userIdFromStorage);
        if (role === 'Admin') {
            setIsAdmin(true);
        }
    }, []);

    const handleBookLoan = (bookId) => {
        if (localStorage.getItem('user_id')==0) {
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
            window.location.reload();
        })
        .catch(error => {
            console.error('There was an error creating the loan!', error);
        });
    };

    const handleReserveBook = (bookId) => {
        if (localStorage.getItem('user_id')==0) {
            alert('Please log in to reserve a book.');
            return;
        }

        const reserveData = {
            user_id: userId,
            book_id: bookId
        };

        axios.post('http://localhost:8000/api/reservations/add/', reserveData, {
            withCredentials: true, 
        })
        .then(response => {
            alert('Book successfully reserved!');
        })
        .catch(error => {
            console.error('There was an error creating the reservation!', error);
        });
    };

    return (
        <div className="book-list-container">
            <h1 className="book-list-title">Available Books</h1>

            <table className="book-list-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Available Copies</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => (
                        <tr key={book.book_id}>
                            <td>{book.title}</td>
                            <td>{book.category}</td>
                            <td>{book.author}</td>
                            <td>{book.available_copies}</td>
                            <td>
                                {book.available_copies > 0 ? (
                                    <button className="action-button" onClick={() => handleBookLoan(book.book_id)}>
                                        Book
                                    </button>
                                ) : (
                                    <button className="action-button" onClick={() => handleReserveBook(book.book_id)}>
                                        Reserve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookList;
