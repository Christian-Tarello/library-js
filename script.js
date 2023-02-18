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
		<div class="bookCard-shape">
			<div class="bookCard-spine">
				<div class="bookCard-buttons">
					<button type="button" class="bookCard-button">R</button>
					<button type="button" class="bookCard-button">D</button>
				</div>
			</div>
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

function addBookToLibrary() {

}