//Book class
class Book
{
    constructor(title, author, isbn) {
        this.title=title
        this.author=author
        this.isbn=isbn
    }
}
//Store class
class Store
{
    static getBooks()
    {
        let books
        if(localStorage.getItem('books') === null){
            books = [];
        }else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBooks(book)
    {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn)
    {
        const books = Store.getBooks();

        books.forEach((book,index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books))
    }
}
//UI class
class UI
{
    static displayBooks()
    {
        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book)
    {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row);
    }

    static deleteElement(el)
    {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className)
    {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //set vanish time
        setTimeout(()=>{
            document.querySelector('.alert').remove()
        }, 3000)
    }

    static clearFields()
    {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//display book event
document.addEventListener('DOMContentLoaded', UI.displayBooks())
//add Book event
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //validate fields
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields', 'danger');
    }else{
        //instantiate books
        const book = new Book(title, author, isbn)
        UI.addBookToList(book)

        //add book to store
        Store.addBooks(book)
        //success message
        UI.showAlert('Book added successfully', 'success')
        //clear all fields
        UI.clearFields();
    }



});
//remove event
document.querySelector('#book-list').addEventListener('click', (e) => {
    //remove from ui
    UI.deleteElement(e.target);
    //remove from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Book deleted successfully', 'primary');
})