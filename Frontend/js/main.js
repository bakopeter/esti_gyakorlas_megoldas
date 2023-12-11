document.addEventListener('DOMContentLoaded', () => {
    let tableBody = document.getElementById('tableBody');
    let addNewBook = document.getElementById('addNewBook');
    let updateBook = document.getElementById('updateBook');
    let deleteBook = document.getElementById('deleteBook');
    const handlError = (error) => {
        console.log('Hiba: ', error);
    }

    const renderTableRow = (element) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td><strong>${element.id}</strong></td><td>${element.title}</td><td>${element.author}</td><td>${element.year}</td><td>${element.price} Ft</td>`;
        tableBody.appendChild(row);
    }

    const updateBooksData = () => {
        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(data => {
                tableBody.innerHTML = "";
                data.forEach(renderTableRow);
            })
            .catch(handlError);
    }
    addNewBook.addEventListener('submit', (event) => {
        event.preventDefault();
        let formData = new FormData(addNewBook);
        let newBookData = Object.fromEntries(formData.entries());
        fetch('http://localhost:3000/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBookData)
        })
            .then(response => response.json())
            .then(updateBooksData())
            .catch(handlError)
        addNewBook.reset();
    })
    updateBook.addEventListener('submit', (event) => {
        event.preventDefault();
        let formData = new FormData(updateBook);
        let updatedBookData = Object.fromEntries(formData.entries());
        fetch(`http://localhost:3000/books/${updatedBookData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedBookData)
        })
            .then(response => response.json())
            .then(updateBooksData())
            .catch(handlError)
        updateBook.reset();
    })
    deleteBook.addEventListener('submit', (event) => {
        event.preventDefault();
        let formData = new FormData(deleteBook);
        let deletedBook = Object.fromEntries(formData.entries());
        fetch(`http://localhost:3000/books/${deletedBook.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deletedBook)
        })
            .then(response => response.json())
            .then(updateBooksData())
            .catch(handlError)
        deleteBook.reset();
    })
    updateBooksData();
})