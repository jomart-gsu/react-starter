import { useState, useRef, useEffect } from 'react';

const BASE_URL = '/api/v1/books';

function App() {
  // For storing info fetched from server
  const [books, setBooks] = useState([]);
  const [createStatus, setCreateStatus] = useState(false);

  // Store reference to input elements to access typed in values
  const idRef = useRef(null);
  const titleRef = useRef(null);
  const authorRef = useRef(null);

  // Fetch all books when you first load the page without clicking button (optional)
  // useEffect(() => {
  //   fetch('/api/v1/books/all', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //     })
  //     .then(response => {
  //       return response.json(); // Convert to json
  //     }).then(responseData => {
  //       // Whatever you want to do with the data returned by server
  //       setBooks(responseData);
  //     });
  // }, []);

  function fetchAllBooks() {
    fetch('/api/v1/books/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => {
        return response.json(); // Convert to json
      }).then(responseData => {
        // Whatever you want to do with the data returned by server
        setBooks(responseData);
      });
  }

  function fetchBookByID() {
    const idValue = idRef.current.value;
    const url = BASE_URL + '?book_id=' + idValue; // Add query parameter id, can add multiple with &
    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => {
        return response.json();
      }).then(responseData => {
        // Whatever you want to do with the data returned by server
        setBooks(responseData);
      });
  }

  function createBook() {
    setCreateStatus(false);
    const titleValue = titleRef.current.value;
    const authorValue = authorRef.current.value;

    const data = JSON.stringify({
      'title': titleValue,
      'author': authorValue,
    });
    fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data, // No query parameter, for POST we put in body
      })
      .then(response => {
        return response.json();
      }).then(responseData => {
        // Whatever you want to do with the data returned by server
        setCreateStatus(responseData.success);
      });
  }

  return (
    <div>
      <h1>Book API Demo</h1>
      <div>
        <button onClick={fetchAllBooks}>Fetch All Books</button>
      </div>
      <div>
        <input ref={idRef} type="text" placeholder="Enter book ID" />
        <button onClick={fetchBookByID}>Fetch Specific Book</button>
      </div>
      <div>
        <input ref={titleRef} type="text" placeholder="Enter book title" />
        <input ref={authorRef} type="text" placeholder="Enter book author" />
        <button onClick={createBook}>Create New Book</button>
        {createStatus ? "Successfully created book!" : null}
      </div>
      <ul>
        {books.map(book => <li><b>{book.title}</b> by {book.author} (id {book.id})</li>)}
      </ul>
    </div>
  );
}

export default App;
