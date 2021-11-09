import React from 'react';
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../pages/LoginPage/userSlice";

const list = [
    {id: 1, role: ['guest', 'user', 'librarian', 'admin'], name: "Main site", path: "/", exact: true},
    {id: 2, role: ['guest', 'user', 'librarian', 'admin'], name: "Library", path: "/library", exact: true},
    {id: 3, role: ['user', 'librarian', 'admin'], name: "Account", path: "/account", exact: true, children: [
        {id: 31, role: ['user', 'librarian', 'admin'], name: "My data", path: "/account/data"},
        {id: 32, role: ['user', 'librarian'], name: "My requests", path: "/account/requests"},
        {id: 33, role: ['user', 'librarian'], name: "My books", path: "/account/books"}
    ]},
    {id: 4, role: ['guest', 'user', 'librarian', 'admin'], name: "Contact", path: "/contact", exact: true, children: [
            {id: 41, role: ['guest', 'user', 'librarian', 'admin'], name: "Branches", path: "/contact/branches"}
    ]},
    {id: 5, role: ['librarian', 'admin'], name: "Books import", path: "/import", exact: true},
    {id: 6, role: ['librarian', 'admin'], name: "Books Manage", path: "/books_manage", exact: true},
    {id: 7, role: ['librarian', 'admin'], name: "Users Requests", path: "/users_requests", exact: true},
    {id: 8, role: ['admin'], name: "Users", path: "/users", exact: true},
    {id: 9, role: ['admin'], name: "Branches", path: "/branches", exact: true},
    {id: 10, role: ['admin'], name: "Librarians Requests", path: "/librarians_requests", exact: true},
];

function Navigation(props) {
    const user = useSelector(selectUser);
    const menu = list.map(item => {
        let children = null;
        const havePermission = item.role.find(role => role === user.role)

        if (!havePermission) {
            return null;
        }

        if (item.children) {
            const child = item.children.map(child => {
                const havePermission = child.role.find(role => role === user.role)
                if (!havePermission) {
                    return null;
                }
                return (<li key={child.id}>
                    <NavLink to={child.path}>{child.name}</NavLink>
                </li>)
            });
            children =
                <ul className="submenu">
                    {child}
                </ul>
        }

        return (
            <li key={item.id}>
                <NavLink to={item.path} exact={item.exact ?? false}>{item.name}</NavLink>
                {children}
            </li>)
        }
    )

    return (
        <aside>
            <nav className="main">
                <ul>
                    {menu}
                </ul>
            </nav>
        </aside>
    );
}

export default Navigation;