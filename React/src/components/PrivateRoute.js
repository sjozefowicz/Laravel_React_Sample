import React from "react";
import {Redirect, Route, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectUser} from "../pages/LoginPage/userSlice";

export const PrivateRoute = (props) => {
    const rolesPermitted = props.rolesPermitted;
    const authUser = useSelector(selectUser);
    const havePermission = rolesPermitted.find(role => role === authUser.role)
    const location = useLocation();

    return havePermission ? (
        <Route {...props} />
    ) : (
        <Redirect
            to={{
                pathname: "/login",
                state: { from: location }
            }}
        />
    );
};