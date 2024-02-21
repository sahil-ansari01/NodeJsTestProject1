
window.onload = async function () {
  fetchBooks();

  const addBookForm = document.getElementById('add-book-form');
  addBookForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const title = document.getElementById('title').value;
      const author = document.getElementById('author').value;
      try {
          const response = await fetch('/books', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ title, author })
          });
          if (!response.ok) {
              throw new Error('Failed to add book');
          }
          fetchBooks(); // Refresh book list after adding a new book
          addBookForm.reset();
      } catch (error) {
          console.error('Error adding book:', error);
      }
  });
};

async function fetchBooks() {
  try {
      const response = await fetch('/books');
      if (!response.ok) {
          throw new Error('Failed to fetch books');
      }
      const books = await response.json();
      displayBooks(books);
  } catch (error) {
      console.error('Error fetching books:', error);
  }
}

function displayBooks(books) {
    const borrowedBooksList = document.getElementById('borrowed-books-list');
    const returnedBooksList = document.getElementById('returned-books-list');
    borrowedBooksList.innerHTML = ''; 
    returnedBooksList.innerHTML = ''; 

    books.forEach(book => {
        const li = document.createElement('li');
        li.innerHTML = `
            <p>Title: ${book.title}</p>
            <p>Borrowed Date: ${new Date(book.borrowedDate).toLocaleString()}</p>
            <p>Return Date: ${new Date(book.returnDate).toLocaleString()}</p>
            <p>Fine: ${book.fine}</p>
            ${!book.returned && book.fine > 0 && !book.finePaid ? '<button onclick="payFine(' + book.id + ')">Pay Fine</button>' : ''}
            <button onclick="returnBook(${book.id})">Return Book</button>
        `;

        if (book.returned) {
            returnedBooksList.appendChild(li);
        } else {
            borrowedBooksList.appendChild(li);
        }
    });
}

async function returnBook(bookId) {
    try {
        const response = await fetch(`/return-book/${bookId}`, { method: 'POST' });
        if (!response.ok) {
            throw new Error('Failed to return book');
        }
        fetchBooks(); // Refresh book list after returning a book
    } catch (error) {
        console.error('Error returning book:', error);
    }
}

async function payFine(bookId) {
    try {
        const response = await fetch(`/pay-fine/${bookId}`, { method: 'POST' });
        if (!response.ok) {
            throw new Error('Failed to pay fine');
        }
        fetchBooks(); // Refresh book list after paying fine
    } catch (error) {
        console.error('Error paying fine:', error);
    }
}

