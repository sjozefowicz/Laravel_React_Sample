import {configureStore} from "@reduxjs/toolkit";
import userReducer from '../pages/LoginPage/userSlice'
import booksReducer from '../pages/LibraryPage/booksSlice'
import booksStateReducer from "../pages/LibraryPage/booksStateSlice"
import filtrationReducer from "../pages/LibraryPage/parts/filtrationSlice";
import requestsReducer from "../pages/AccountPage/requestSlice"
import requestsToManageReducer from "../pages/RequestsPage/requestsSlice"
import singleBookReducer from "../pages/BookPage/SingleBookSlice"

export default configureStore({
    reducer: {
        user: userReducer,
        books: booksReducer,
        booksState: booksStateReducer,
        singleBook: singleBookReducer,
        filtration: filtrationReducer,
        requests: requestsReducer,
        requestsToManage: requestsToManageReducer
    },
});