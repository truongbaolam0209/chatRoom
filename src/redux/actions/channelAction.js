import * as actionTypes from '../types';


export const setCurrentChannel = (channel) => {
    return {
        type: actionTypes.SET_CURRENT_CHANNEL,
        payload: channel
    };
};

export const setPrivateChannel = (isPrivateChannel) => {
    return {
        type: actionTypes.SET_PRIVATE_CHANNEL,
        payload: isPrivateChannel
    };
};
