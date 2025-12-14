// bookManager.js
export class BookManager {
    constructor() {
        this.books = [];
    }
    
    addBook(book) {
        this.books.push(book);
    }
    
    getBooks() {
        return this.books;
    }
}