const libraryContainer = document.querySelector(".cardsGrid");
const addBookForm = document.querySelector(".popUpForm");
const formWrapper = document.querySelector(".popUpForm-wrapper");
const addBookButton = document.querySelector(".primaryHeader-navButton--addBook");

let myLibrary = [];
let idCount = 0;

function Book(id, title, subtitle, author, pages, read) {
	this.id = id;
	this.title = title;
	this.subtitle = subtitle;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

Book.prototype.toDomElement = function () {
	const template = `
		<div class="bookCard-tags">
			<button type="button" class="bookCard-tag" data-action="read">R</button>
			<button type="button" class="bookCard-tag" data-action="delete">D</button>
		</div>
		<div class="bookCard-shape">
			<div class="bookCard-readMarker">✔</div>
			<div class="bookCard-spine"></div>
			<div class="bookCard-content">
				<div class="bookCard-name">
					<div class="bookCard-title">${this.title}</div>
					<div class="bookCard-subtitle">${this.subtitle}</div>
				</div>
				<div class="bookCard-author">By ${this.author}</div>
			</div>
			<div class="bookCard-edge">
				<div class="bookCard-edgeCover"></div>
				<div class="bookCard-edgePages">
					<div class="bookCard-pages">${this.pages} pages</div>
				</div>
				<div class="bookCard-edgeCover"></div>
			</div>
		</div>
	`;
	const element = document.createElement('div');
	element.classList.add('bookCard');
	element.dataset.id = this.id;
	if (this.read) {
		element.classList.add('bookCard--read');
	}
	element.innerHTML = template;
	return element;
}

// Helper Function
function removeChildren(container) {
	while (container.firstChild) {
		container.removeChild(container.lastChild);
	}
}


// Button Callbacks
function readBook(e) {
	const bookElement = e.target.closest(".bookCard");
	const id = Number(bookElement.dataset.id);
	const bookObj = myLibrary.find(book => book.id === id);
	bookObj.read = !bookObj.read;
	if (bookObj.read) {
		bookElement.classList.add("bookCard--read");
	} else {
		bookElement.classList.remove("bookCard--read");
	}
}

function deleteBook(e) {
	const bookElement = e.target.closest(".bookCard");
	const id = Number(bookElement.dataset.id);
	const bookObjIndex = myLibrary.findIndex(book => book.id === id);
	myLibrary.splice(bookObjIndex, 1);
	bookElement.remove();
}

function bindBookCardButtons(bookCardElement) {
	const readButton = bookCardElement.querySelector('.bookCard-tag[data-action = "read"]');
	if (readButton) {
		readButton.addEventListener("click", readBook);
	}
	const deleteButton = bookCardElement.querySelector('.bookCard-tag[data-action = "delete"]');
	if (deleteButton) {
		deleteButton.addEventListener("click", deleteBook);
	}
}

function renderBookCard(bookObject, container) {
	const domElement = bookObject.toDomElement();
	bindBookCardButtons(domElement);
	container.appendChild(domElement);
}

function displayBooks(bookList, container) {
	removeChildren(container);
	bookList.forEach(bookObject => {
		renderBookCard(bookObject, container);
	});
}

function getNewBookId() {
	const id = idCount;
	idCount += 1;
	return id;
}

function formDataToBookObj(formData, id) {
	const newBook = new Book(
		id,
		formData.get("title"),
		formData.get("subtitle"),
		formData.get("author"),
		formData.get("pages"),
		(formData.get("isRead") != null)
		);
	return newBook;
}

function addBookToLibrary(newBook) {
	myLibrary.push(newBook);
}

// Event Listeners
// Add book form Event Listeners

// Form Submission logic
addBookForm.addEventListener('submit', (e) => {
	const formData = new FormData(e.target);
	const id = getNewBookId();
	const newBook = formDataToBookObj(formData, id);
	addBookToLibrary(newBook);
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