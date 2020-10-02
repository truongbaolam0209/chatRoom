import * as actionTypes from '../types';


const initState = {
    currentChannel: null,
    isPrivateChannel: false
};


export default (state = initState, { type, payload }) => {
    switch (type) {

        case actionTypes.SET_CURRENT_CHANNEL:
            return {
                ...state,
                currentChannel: payload
            };

        case actionTypes.SET_PRIVATE_CHANNEL:
            return {
                ...state,
                isPrivateChannel: payload
            };

        default:
            return state;
    };
};