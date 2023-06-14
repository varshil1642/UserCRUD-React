import { SET_USER, SET_TOKEN, SET_USER_LIST, LOGOUT_USER } from "./actionTypes";
import { registerModel } from './../models/registerModel';

export const setUser = (user: registerModel) => {
    return {
        type: SET_USER,
        payload: user
    }
}

export const setToken = (token: string) => {
    return {
        type: SET_TOKEN,
        payload: token
    }
}

export const setUserList = (userList: registerModel[]) => {
    return {
        type: SET_USER_LIST,
        payload: userList
    }
}

export const logoutUser = () => {
    return {
        type: LOGOUT_USER
    }
}