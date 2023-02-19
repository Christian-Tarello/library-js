const libraryContainer = document.querySelector(".cardsGrid");
const addBookForm = document.querySelector(".popUpForm");
const formWrapper = document.querySelector(".popUpForm-wrapper");
const addBookButton = document.querySelector(".primaryHeader-navButton--addBook");

let myLibrary = [];

function Book(title, subtitle, author, pages, read) {
	this.title = title;
	this.subtitle = subtitle;
	this.author = author;
	this.pages = pages;
	this.read = read;
}

Book.prototype.toDomElement = function () {
	const template = `
		<div class="bookCard-tags">
			<button type="button" class="bookCard-tag">R</button>
			<button type="button" class="bookCard-tag">D</button>
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
	element.innerHTML = template;
	return element;
}


function removeChildren(container) {
	while (container.firstChild) {
		container.removeChild(container.lastChild);
	}
}

function displayBooks(bookList, container) {
	removeChildren(container);
	bookList.forEach(bookObject => {
		const domElement = bookObject.toDomElement();
		container.appendChild(domElement);
	});
}

function addBookToLibrary(formData) {
	const newBook = new Book(
		formData.get("title"),
		formData.get("subtitle"),
		formData.get("author"),
		formData.get("pages"),
		(formData.get("isRead") != null)
		);
	myLibrary.push(newBook);
}

addBookForm.addEventListener('submit', (e) => {
	const formData = new FormData(e.target);
	formWrapper.classList.toggle("popUpForm-wrapper--hidden");
	addBookToLibrary(formData);
	displayBooks(myLibrary, libraryContainer);
	e.preventDefault();
});

addBookForm.addEventListener('click', (e) => {
	e.stopPropagation();
});

addBookButton.addEventListener('click', () => {
	addBookForm.reset();
	formWrapper.classList.toggle("popUpForm-wrapper--hidden");
})

formWrapper.addEventListener('click', () => {
	formWrapper.classList.add("popUpForm-wrapper--hidden")
})