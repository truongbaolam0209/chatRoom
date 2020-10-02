import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
// import 'semantic-ui-css/semantic.min.css';
import App from './App';
import './index.css';
import rootReducer from './redux/reducers';


const store = createStore(
    rootReducer,
    composeWithDevTools()
);



ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
);
