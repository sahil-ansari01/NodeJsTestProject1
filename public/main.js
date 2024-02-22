window.onload = async function () {
    fetchBooks();
  
    const addBookForm = document.getElementById("add-book-form");
    addBookForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const title = document.getElementById("title").value;
      const author = document.getElementById("author").value;
      try {
        const response = await fetch("/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, author }),
        });
        if (!response.ok) {
          throw new Error("Failed to add book");
        }
        fetchBooks(); // Refresh book list after adding a new book
        addBookForm.reset();
      } catch (error) {
        console.error("Error adding book:", error);
        fetchBooks();
      }
    });
  };
  
  async function fetchBooks() {
    try {
      const response = await fetch("/books");
      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }
      const books = await response.json();
      await displayBooks(books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }
  
  ////////////////////////////
  async function RETURNBOOK(event, fine) {
    const that_li = event.target.parentNode;
    event.preventDefault();
    console.log("BOOK RETURN !!", that_li);
    while (that_li.firstChild) {
      that_li.removeChild(that_li.firstChild);
    }
    const fine_ip = document.createElement("input");
    fine_ip.type = "number";
    fine_ip.style = "width : auto";
    // console.log(fine);
    fine_ip.value = fine;
    const fine_button = document.createElement("button");
    fine_button.onclick = function (event) {
      PAYFINE(event);
    };
    const fine_text = document.createTextNode("Pay Fine");
    fine_button.appendChild(fine_text);
    that_li.appendChild(fine_ip);
    that_li.appendChild(document.createElement("br"));
    that_li.appendChild(document.createElement("br"));
    that_li.appendChild(fine_button);
    // console.log(that_li);
    // let temp_res = await GETFINE(that_li.id);
    console.log(that_li.id);
    const TOTAL_FINE = await GETFINE(that_li.id);
    console.log("TOTAL FINE IS :", TOTAL_FINE);
  }
  
  async function PAYFINE(event) {
    event.preventDefault();
    console.log("This is the Parent Node", event.target.parentNode);
    const BOOKID = event.target.parentNode.id;
    // console.log("BOOK ID :", BOOKID);
    //PAYFINENRETURN(BOOKID);
    const fine = await GETFINE(BOOKID);
    const removeBook = await fetch(
      `http://localhost:3000/delete-book/${BOOKID}-${fine}`,
      { method: "POST" }
    );
    //console.log("Paying Fine", removeBook);
    event.target.parentNode.remove();
    await fetchBooks();
  }
  
  async function GETFINE(ID) {
    try {
      const response = await fetch(
        `http://localhost:3000/return-book-fine/${ID}`,
        { method: "POST" }
      );
      const json_res = await response.json();
      return json_res.fine;
    } catch (err) {
      console.log(err);
    }
  }
  
  async function PAYFINENRETURN(ID) {
    try {
      const response = await fetch(`/return-book/${ID}`, { method: "POST" });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
  
  //////////////////////////////////////////////////////////////////////////////////
  
  async function displayBooks(books) {
    const borrowedBooksList = document.getElementById("borrowed-books-list");
    const returnedBooksList = document.getElementById("returned-books-list");
    borrowedBooksList.innerHTML = "";
    returnedBooksList.innerHTML = "";
  
    books.forEach(async (book) => {
      const li = document.createElement("li");
  
      /////////////////////////////////////////////////////////////////////////////
      const newli = document.createElement("li");
      newli.id = book.id;
      const book_title = document.createTextNode(`Title : ${book.title}`);
      const borrow_date = document.createTextNode(
        `Borrow Date : ${new Date(book.borrowedDate).toLocaleString()}`
      );
      const return_date = document.createTextNode(
        `Return Date : ${new Date(book.returnDate).toLocaleString()} `
      );
      let fine = await GETFINE(book.id);
      const current_fine = document.createTextNode(`Current Fine : $${fine}`);
      newli.appendChild(book_title);
      newli.appendChild(document.createElement("br"));
      newli.appendChild(borrow_date);
      newli.appendChild(document.createElement("br"));
      newli.appendChild(return_date);
      newli.appendChild(document.createElement("br"));
      newli.appendChild(current_fine);
      newli.appendChild(document.createElement("br"));
  
      const return_button = document.createElement("button");
      return_button.id = book.id;
      return_button.onclick = async (event, fine) => {
        //console.log("Book id dekhna toh", book.id);
        fine = await GETFINE(book.id);
        RETURNBOOK(event, fine);
      };
  
      return_button.style =
        "color : black;background-color : orange ;font-weight:bold; margin-bottom: 10px";
      const pay_text = document.createTextNode("Return Book");
  
      return_button.appendChild(pay_text);
      newli.appendChild(return_button);

      ///////////////////////////////////////////////////
  
      li.innerHTML = `
              <p>Title: ${book.title}</p>
              <p>Borrowed Date: ${new Date(
                book.borrowedDate
              ).toLocaleString()}</p>
              <p>Return Date: ${new Date(book.returnDate).toLocaleString()}</p>
              <p>Fine: ${book.fine}</p>
              ${
                !book.returned && book.fine > 0 && !book.finePaid
                  ? '<button onclick="payFine(' + book.id + ')">Pay Fine</button>'
                  : ""
              }
              <button onclick="returnBook(${book.id})">Return Book</button>
          `;
      let paid = 0;
      if (book.returned) {
        paid = book.fine;
        newli.removeChild(return_button);
        newli.removeChild(current_fine);
        newli.appendChild(document.createTextNode(`Fine Paid :${paid}`));
        returnedBooksList.appendChild(newli);
      } else {
        borrowedBooksList.appendChild(newli);
      }
    });
  }
  
  async function returnBook(bookId) {
    try {
      const response = await fetch(`/return-book/${bookId}`, { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to return book");
      }
      fetchBooks(); // Refresh book list after returning a book
    } catch (error) {
      console.error("Error returning book:", error);
    }
  }
  
  async function payFine(bookId) {
    try {
      const response = await fetch(`/pay-fine/${bookId}`, { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to pay fine");
      }
      fetchBooks(); // Refresh book list after paying fine
    } catch (error) {
      console.error("Error paying fine:", error);
    }
  }