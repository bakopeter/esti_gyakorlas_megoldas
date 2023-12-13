document.addEventListener('DOMContentLoaded', () => {
    let tableBody = document.getElementById('tableBody');
    let addNewBook = document.getElementById('addNewBook');
    let updateBook = document.getElementById('updateBook');
    let deleteBook = document.getElementById('deleteBook');
    let cartForm = document.getElementById('cartForm');
    let cartList = document.getElementById('cartList');
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
                data.forEach(row => { cart[row.id] = 0 });
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

    const cart = [];
    let piece = 0;
    let sumTotal = 0;

    const renderCartRow = (element) => {
        cart[element.id] += 1;
        piece = cart[element.id];
        if (piece > 1) {
            row = document.getElementById(element.id);
            row.outerHTML = "";
        }

        sumTotal += Number(element.price);
        row = document.createElement('li');
        row.className = "list-group-item d-flex justify-content-between align-items-center";
        row.id = element.id;
        row.innerHTML = `<span>${piece}</span><span>${element.title}</span><span>${element.price} Ft</span>`;
        cartList.appendChild(row);

    }

    const updateCartData = (id) => {
        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(data => {
                data.forEach(row => { if (row.id == id) renderCartRow(row) });
            })
            .catch(handlError);
    }

    tableBody.addEventListener('click', (event) => {
        event.preventDefault();
        updateCartData(event.target.innerHTML);
    })

    cartForm.addEventListener('click', (event) => {
        event.preventDefault();
        window.alert(`A kiválasztott könyvek értéke: ${sumTotal} Ft.`)
    })
})