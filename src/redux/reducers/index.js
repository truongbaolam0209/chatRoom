import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import channelReducer from './channelReducer';


export default combineReducers({
    form: formReducer,
    authReducer,
    channelReducer
});