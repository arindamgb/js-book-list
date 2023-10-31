// Get UI Elements
let form = document.querySelector('#book-form');
let booklist = document.querySelector('#book-list');

// Book Class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


// Define UI Class
class UI {
    static addToBookList(book) {
        // console.log(book);
        let list = document.querySelector('#book-list');
        let row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href='#' class='delete'>X</td>
        `
        list.appendChild(row);
    }

    static clearFiels() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static showAlert(message, className) {
        let div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        let container = document.querySelector('.container');
        let form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout( () => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    static deleteFromBook(target) {
        if(target.hasAttribute('href')) {
            //console.log(target.parentElement.parentElement);
            // delete from DOM
            target.parentElement.parentElement.remove();
            // delete from local storage
            // console.log(target.parentElement.previousElementSibling.textContent.trim());
            let isbn = target.parentElement.previousElementSibling.textContent.trim()
            Store.removeBook(isbn);

            UI.showAlert('Book Deleted!', 'success');
        }
    }

}


// Define Functions
function newBook(e) {
    let title = document.querySelector('#title').value;
    let author = document.querySelector('#author').value;
    let isbn = document.querySelector('#isbn').value;

    // no need to create an object as we made the functions static, can be called directly with Class
    // let ui = new UI();

    if(title === '' || author === '' || isbn === '') {
        // console.log('All Fields');
        UI.showAlert('Please fill up all the fields!', 'error');
    } else {
        // console.log(title, author, isbn);

        let book = new Book(title, author, isbn);
        // console.log(book);

        UI.addToBookList(book);

        UI.clearFiels();

        UI.showAlert('Book Added Successfully!', 'success');

        Store.addBook(book);
    }

    e.preventDefault();
}

function removeBook(e) {
    // let ui = new UI();
    UI.deleteFromBook(e.target);
    e.preventDefault();
}


// Local Storage Class
class Store {

    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        let books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks() {
        let books = Store.getBooks();
        //  console.log(localStorage.getItem('books'));
        books.forEach(book => {
            UI.addToBookList(book);
            
        });
    }

    static removeBook(isbn) {
        let books = Store.getBooks();
        books.forEach((book, index) => {
        //books.forEach(book => {
            if(book.isbn == isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
    

}


// Add Event Listener
form.addEventListener('submit', newBook);
booklist.addEventListener('click', removeBook);
// on reload
document.addEventListener('DOMContentLoaded', Store.displayBooks());