import {createStore} from 'redux';

const INITIAL_STATE = {'isAuthenticated':false,'user':null};

function userReducer(state=INITIAL_STATE,action) {
   
    switch (action.type) {
        case 'SET_USER':
            return {...state,'isAuthenticated':true,'user':action.payload.user};
        case 'RESET_USER':
            return {...state,'isAuthenticated':false,'user':null};
        default:
            return state;
    }
}

const store = createStore(userReducer);

export default store;