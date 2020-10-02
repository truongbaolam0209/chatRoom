import * as actionTypes from '../types';


const initState = {
    currentUser: null,
    isLoading: true
};

export default (state = initState, { type, payload }) => {
    switch (type) {

        case actionTypes.SET_USER:
            return {
                ...initState,
                currentUser: payload,
                isLoading: false
            };

        case actionTypes.CLEAR_USER:
            return {
                ...initState,
                currentUser: null,
                isLoading: false
            };

        default:
            return state;
    };
};
