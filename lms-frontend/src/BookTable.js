import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BookTable.css';  

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const BookTable = () => {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({ isbn: '', title: '', author: '', category: '', total_copies: 0, available_copies: 0 });
    const [editing, setEditing] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/books/');
            setBooks(response.data);
            setMessage(null);
        } catch (error) {
            console.error('Error fetching books:', error);
            setMessage('Error fetching books');
        }
    };

    const addBook = async () => {
        if (!newBook.isbn || !newBook.title || !newBook.author || !newBook.category) {
            setMessage('All fields are required!');
            return;
        }

        try {
            await axios.post('http://localhost:8000/api/books/', newBook);
            setMessage('Book added successfully');
            fetchBooks();
            setNewBook({ isbn: '', title: '', author: '', category: '', total_copies: 0, available_copies: 0 });
        } catch (error) {
            console.error('Error adding book:', error.response ? error.response.data : error.message);
            setMessage('Error adding book');
        }
    };

    const editBook = (book) => {
        setEditing(true);
        setEditingBook(book);
    };

    const saveEdit = async () => {
        if (!editingBook.isbn || !editingBook.title || !editingBook.author || !editingBook.category) {
            setMessage('All fields are required!');
            return;
        }
    
        try {
            await axios.put(`http://localhost:8000/api/books/${editingBook.book_id}/`, editingBook);
            setMessage('Book updated successfully');
            fetchBooks();
            setEditing(false);
            setEditingBook(null);
        } catch (error) {
            console.error('Error updating book:', error.response ? error.response.data : error.message);
            setMessage('Error updating book');
        }
    };
    

    const deleteBook = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await axios.delete(`http://localhost:8000/api/books/${bookId}/`);
                setMessage('Book deleted successfully');
                fetchBooks();
            } catch (error) {
                console.error("Error deleting book:", error.response ? error.response.data : error.message);
                setMessage('Error deleting book');
            }
        }
    };

    return (
        <div className="book-table-container">
            <h2>Book Management</h2>
            {message && <div className="message">{message}</div>}

            <h3>{editing ? "Edit Book" : "Add New Book"}</h3>
            <div className="form-container">
                <input type="text" placeholder="ISBN" value={editing ? editingBook.isbn : newBook.isbn}
                    onChange={(e) => editing ? setEditingBook({ ...editingBook, isbn: e.target.value }) : setNewBook({ ...newBook, isbn: e.target.value })}
                />
                <input type="text" placeholder="Title" value={editing ? editingBook.title : newBook.title}
                    onChange={(e) => editing ? setEditingBook({ ...editingBook, title: e.target.value }) : setNewBook({ ...newBook, title: e.target.value })}
                />
                <input type="text" placeholder="Author" value={editing ? editingBook.author : newBook.author}
                    onChange={(e) => editing ? setEditingBook({ ...editingBook, author: e.target.value }) : setNewBook({ ...newBook, author: e.target.value })}
                />
                <input type="text" placeholder="Category" value={editing ? editingBook.category : newBook.category}
                    onChange={(e) => editing ? setEditingBook({ ...editingBook, category: e.target.value }) : setNewBook({ ...newBook, category: e.target.value })}
                />
                <input type="number" placeholder="Total Copies" value={editing ? editingBook.total_copies : newBook.total_copies}
                    onChange={(e) => editing ? setEditingBook({ ...editingBook, total_copies: parseInt(e.target.value) }) : setNewBook({ ...newBook, total_copies: parseInt(e.target.value) })}
                />
                <input type="number" placeholder="Available Copies" value={editing ? editingBook.available_copies : newBook.available_copies}
                    onChange={(e) => editing ? setEditingBook({ ...editingBook, available_copies: parseInt(e.target.value) }) : setNewBook({ ...newBook, available_copies: parseInt(e.target.value) })}
                />
                <button onClick={editing ? saveEdit : addBook}>{editing ? "Save Changes" : "Add Book"}</button>
            </div>

            <table className="book-table">
                <thead>
                    <tr>
                        <th>ISBN</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Total Copies</th>
                        <th>Available Copies</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.book_id}>
                            <td>{book.isbn}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>{book.total_copies}</td>
                            <td>{book.available_copies}</td>
                            <td>
                                <button onClick={() => editBook(book)}>Edit</button>
                                <button onClick={() => deleteBook(book.book_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookTable;
