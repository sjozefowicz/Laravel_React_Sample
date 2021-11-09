import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import UserFormRequest from "./parts/UserFormRequest";
import {selectUser} from "../LoginPage/userSlice";
import {fetchBook, selectSingleBook} from "./SingleBookSlice";

import './BookPage.scss'

const today = new Date();
today.setDate(today.getDate() + 1);
const minStartDate = new Date(today).toISOString().slice(0, 10);

function BookPage() {
    const location = useLocation();
    const role = useSelector(selectUser).role
    const id = location.pathname.match(/(\d+)/)[0];
    const book = useSelector(selectSingleBook)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBook(id))
    }, [dispatch, id])

    const [isRequested, setIsRequested] = useState(false);
    const [startDate, setStartDate] = useState(minStartDate);
    const [endDate, setEndDate] = useState('');

    const handleRequestClick = () => {
        setIsRequested(!isRequested);
    }

    return (
        <>
            <div className="book">
                <div className="book_data">
                    <h1>{book.title}</h1>
                    <p>Publisher: {book.publisher}</p>
                    <p>ISBN: {book.isbn}</p>
                    <p>Branch: Branch nr {book.branch_slug}</p>
                    <p>Language: {book.language}</p>
                    <p>Publication date: {book.publication_date}</p>
                    <p>Number of pages: {book.pages_num}</p>
                </div>
                <div className="book_desc">
                    <p>
                        {book.description}
                    </p>
                </div>
                {(role === 'user')
                    ? <button className="defaultButton" onClick={handleRequestClick}>
                        Set Request
                      </button>
                    : null
                }
                <div className="book_request">
                    {isRequested
                        ? <UserFormRequest
                            bookId={id}
                            startDate={startDate}
                            endDate={endDate}
                            handleStartDate={setStartDate}
                            handleEndDate={setEndDate}
                        />
                        : null}
                </div>
            </div>
        </>
    );
}

export default BookPage;