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


function removeChildren(container) {
	while (container.firstChild) {
		container.removeChild(container.lastChild);
	}
}

function readMarkerCallback(e) {
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



function displayBooks(bookList, container) {
	removeChildren(container);
	bookList.forEach(bookObject => {
		const domElement = bookObject.toDomElement();
		const readButton = domElement.querySelector('.bookCard-tag[data-action = "read"]');
		if (readButton) {
			readButton.addEventListener("click", readMarkerCallback);
		}
		container.appendChild(domElement);
	});
}

function addBookToLibrary(formData, id) {
	const newBook = new Book(
		id,
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
	addBookToLibrary(formData, idCount);
	idCount += 1;
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