import React, {useState} from 'react';
import {TablePagination} from "@material-ui/core";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

import Book from "./parts/Book";
import Filter from "./parts/Filter";
import {selectBooks, selectBooksData} from "./booksSlice";
import {useDispatchBooks} from "./hooks/useDispatchBooks";

import './LibraryPage.scss'

function LibraryPage(props) {
    const parameters = useLocation().search

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [filter, setFilter] = useState(false)

    const data = useSelector(selectBooksData)
    const books = useSelector(selectBooks)

    const actualPage = parseInt(parameters.substring(parameters.indexOf('page=') + 5, parameters.indexOf('&')))
    const actualPer = parseInt(parameters.substring(parameters.indexOf('per=') + 4))

    useDispatchBooks(page, rowsPerPage, filter, actualPage, actualPer);

    const handleChangePage = (event, value) => {
        setPage(value + 1);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(event.target.value);
    }

    const booksList = (books !== []) ? books.map(book => (
        <Book key={book.id} {...book}/>
    )) : null

    return (
        <>
            <h1>Library Page</h1><br/>
            <Filter
                setPage={setPage}
                setFilter={setFilter}
            />
            <ul className="library">
                {booksList}
            </ul>
            <TablePagination
                component="div"
                count={data.total}
                page={page - 1}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
}

export default LibraryPage;