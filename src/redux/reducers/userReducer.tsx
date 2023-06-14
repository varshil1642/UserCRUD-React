import { SET_USER_LIST, SET_USER, SET_TOKEN, LOGOUT_USER } from "../actionTypes";

const initialState = {
    userList: [],
    user: {},
    token: null
}

const userReducer = (state = initialState, action: { type: string, payload?: any }) => {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                user: action.payload
            }
        case SET_TOKEN:
            return {
                ...state,
                token: action.payload
            }
        case SET_USER_LIST:
            return {
                ...state,
                userList: action.payload
            }
        case LOGOUT_USER:
            return {
                ...initialState
            }
        default:
            return state
    }
}

export default userReducer