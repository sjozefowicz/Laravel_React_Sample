import React from 'react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

import {selectUser} from "../../LoginPage/userSlice";

function Book({id, title, publisher, language, publication_date, description}) {

    const role = useSelector(selectUser).role

    return (
        <>
            <hr/>
            <li className="library_book">
                <div className="library_book_data">
                    <Link to={{
                        pathname: '/library/book/' + id
                    }}>
                        <h3>{title}</h3>
                    </Link>
                    <p>Publisher: {publisher}</p>
                    <p>Language: {language}</p>
                    <p>Publication date: {publication_date}</p>
                </div>
                <div className="library_book_desc">
                    <p>
                        {description}
                    </p>
                </div>
                <div className="library_book_request">
                    <Link  to={{
                        pathname: '/library/book/' + id
                    }}>
                        {(role === 'user')
                            ? <button className="defaultButton">
                                Set Request
                              </button>
                            : null
                        }
                    </Link>
                </div>
            </li>
        </>
    );
}

export default Book;