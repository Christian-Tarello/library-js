/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */

class Book {
	constructor(title, subtitle, author, pages, filePath, read) {
		this._id = Book.counter;
		this.title = title;
		this.subtitle = subtitle;
		this.author = author;
		this.pages = pages;
		this.filePath = filePath;
		this.read = read;
	}

	get id() {
		return this._id;
	}

	static get counter() {
		Book._counter = (Book._counter || 0) + 1;
		return Book._counter;
	}
}

class BookUtils {
	static toDomElement(bookObj) {
		const template = `
		<div class="bookCard-tags">
			<button type="button" class="bookCard-tag" data-action="read">
				<img src="./images/read.svg" title="Mark book as read">
			</button>
			<button type="button" class="bookCard-tag" data-action="delete">
				<img src="./images/delete.svg" title="Delete book">
			</button>
		</div>
		<div class="bookCard-shape">
			<div class="bookCard-readMarker">✔</div>
			<div class="bookCard-spine"></div>
			<div class="bookCard-content">
				<a class="bookCard-name" href="${bookObj.filePath}" target="_blank" rel="noopener noreferrer">
					<div class="bookCard-title">${bookObj.title}</div>
					<div class="bookCard-subtitle">${bookObj.subtitle}</div>
				</a>
				<div class="bookCard-author">By ${bookObj.author}</div>
			</div>
			<div class="bookCard-edge">
				<div class="bookCard-edgeCover"></div>
				<div class="bookCard-edgePages">
					<div class="bookCard-pages">${bookObj.pages} pages</div>
				</div>
				<div class="bookCard-edgeCover"></div>
			</div>
		</div>
	`;
	const element = document.createElement('div');
	element.classList.add('bookCard');
	element.dataset.id = bookObj.id;
	if (bookObj.read) {
		element.classList.add('bookCard--read');
	}
	element.innerHTML = template;
	return element;
	}

	static formToBookObj(formData) {
		const newBook = new Book(
			formData.get("title"),
			formData.get("subtitle"),
			formData.get("author"),
			formData.get("pages"),
			formData.get("path"),
			(formData.get("isRead") != null)
			);
		return newBook;
	}
}

class BookCollection {
	constructor(books) {
		this.books = books;
	}

	addBook(book) {
		this.books.push(book);
	}

	findBookById(id) {
		return this.books.find(book => book.id === id);
	}

	deleteBookById(id) {
		const index = this.books.findIndex(book => book.id === id);
		return this.books.splice(index, 1)[0];
	}
}

const libraryContainer = document.querySelector(".cardsGrid");
const addBookForm = document.querySelector(".popUpForm");
const formWrapper = document.querySelector(".popUpForm-wrapper");
const addBookButton = document.querySelector(".primaryHeader-navButton--addBook");

const myLibrary = new BookCollection([]);

// Button Callbacks
function readBook(e) {
	const element = e.target.closest(".bookCard");
	const id = Number(element.dataset.id);
	const bookObj = myLibrary.findBookById(id);
	bookObj.read = !bookObj.read;
	if (bookObj.read) {
		element.classList.add("bookCard--read");
	} else {
		element.classList.remove("bookCard--read");
	}
}

function deleteBook(e) {
	const element = e.target.closest(".bookCard");
	const id = Number(element.dataset.id);
	myLibrary.deleteBookById(id);
	element.remove();
}

function bindBookCardButtons(element) {
	const readButton = element.querySelector('.bookCard-tag[data-action = "read"]');
	if (readButton) {
		readButton.addEventListener("click", readBook);
	}
	const deleteButton = element.querySelector('.bookCard-tag[data-action = "delete"]');
	if (deleteButton) {
		deleteButton.addEventListener("click", deleteBook);
	}
}

function renderBookCard(bookObject, container) {
	const domElement = BookUtils.toDomElement(bookObject);
	bindBookCardButtons(domElement);
	container.appendChild(domElement);
}

function removeChildren(container) {
	while (container.firstChild) {
		container.removeChild(container.lastChild);
	}
}

function displayBooks(bookList, container) {
	removeChildren(container);
	bookList.forEach(bookObject => {
		renderBookCard(bookObject, container);
	});
}

// Event Listeners
// Add book form Event Listeners

// Form Submission logic
addBookForm.addEventListener('submit', (e) => {
	const formData = new FormData(e.target);
	const newBook = BookUtils.formToBookObj(formData);
	myLibrary.addBook(newBook);
	renderBookCard(newBook, libraryContainer);
	e.preventDefault();
});

// Hide Form After Submission
addBookForm.addEventListener('submit', () => {
	formWrapper.classList.toggle("popUpForm-wrapper--hidden");
	addBookForm.reset();
})

// Prevent propagation on click with form
addBookForm.addEventListener('click', (e) => {
	e.stopPropagation();
});

// Add Book Button Event Listeners

// Toggle form button
addBookButton.addEventListener('click', () => {
	formWrapper.classList.toggle("popUpForm-wrapper--hidden");
	addBookForm.reset();
})

// Form Wrapper Event Listeners

// Toggle off form if clicked outside of it
formWrapper.addEventListener('click', () => {
	formWrapper.classList.add("popUpForm-wrapper--hidden")
})

// On load Event Listeners

// Render all books into the DOM (No persistent storage implemented yet)
window.addEventListener("load", (e) => {
	displayBooks(myLibrary.books, libraryContainer);
	console.log("Loaded all stored books");
})