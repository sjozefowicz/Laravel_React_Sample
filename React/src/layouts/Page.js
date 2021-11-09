import React from 'react';
import {Route, Switch} from "react-router-dom";

import AccountPage from "../pages/AccountPage";
import AccountBooksPage from "../pages/AccountPage/subpages/AccountBooksPage";
import AccountDataPage from "../pages/AccountPage/subpages/AccountDataPage";
import AccountRequestsPage from "../pages/AccountPage/subpages/AccountRequestsPage";
import BookPage from "../pages/BookPage";
import BookToManagePage from "../pages/BooksManagePage/subpages/BookToManagePage";
import BooksManagePage from "../pages/BooksManagePage";
import BranchContactPage from "../pages/ContactPage/subpages/BranchContactPage";
import BranchesPage from "../pages/BranchesPage";
import ContactPage from "../pages/ContactPage";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import ImportPage from "../pages/ImportPage";
import LibraryPage from "../pages/LibraryPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import RequestsPage from "../pages/RequestsPage";
import UsersManagePage from "../pages/UserManagePage";
import UserToManagePage from "../pages/UserManagePage/subpages/UserToManagePage";
import {PrivateRoute} from "../components/PrivateRoute";

function Page(props) {
    return (
        <section className="page">
            <Switch>
                <Route path="/" exact component={HomePage}/>
                <Route path="/library" exact component={LibraryPage}/>
                <Route path="/library/book/:id" component={BookPage}/>
                <PrivateRoute rolesPermitted={['user', 'librarian', 'admin']} path="/account/" exact component={AccountPage}/>
                <PrivateRoute rolesPermitted={['user', 'librarian', 'admin']} path="/account/data" exact component={AccountDataPage}/>
                <PrivateRoute rolesPermitted={['user', 'librarian']} path="/account/requests" exact component={AccountRequestsPage}/>
                <PrivateRoute rolesPermitted={['user', 'librarian']} path="/account/books" exact component={AccountBooksPage}/>
                <Route path="/contact" exact component={ContactPage}/>
                <Route path="/contact/branches" exact component={BranchContactPage}/>
                <Route path="/contact/form" exact component={ContactPage}/>
                <PrivateRoute rolesPermitted={['librarian', 'admin']} path="/import" exact component={ImportPage}/>
                <PrivateRoute rolesPermitted={['librarian', 'admin']} path="/books_manage" exact component={BooksManagePage}/>
                <PrivateRoute rolesPermitted={['librarian', 'admin']} path="/books_manage/book/:id" component={BookToManagePage}/>
                <PrivateRoute rolesPermitted={['librarian', 'admin']} path="/users_requests" exact component={RequestsPage}/>
                <PrivateRoute rolesPermitted={['admin']} path="/users" exact component={UsersManagePage}/>
                <PrivateRoute rolesPermitted={['admin']} path="/users/user/:id" component={UserToManagePage}/>
                <PrivateRoute rolesPermitted={['admin']} path="/branches" exact component={BranchesPage}/>
                <PrivateRoute rolesPermitted={['admin']} path="/librarians_requests" exact component={RequestsPage}/>
                <Route path="/login" component={LoginPage}/>
                <Route path="/register" component={RegisterPage}/>
                <Route component={ErrorPage}/>
            </Switch>
        </section>
    );
}

export default Page;