import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import PageLanding from './components/PageLanding';
import PageLogin from './components/PageLogin';
import PageRegister from './components/PageRegister';
import Spinner from './components/ui/Spinner';
import firebase from './firebase';
import { clearUser, setUser } from './redux/actions/authAction';


const App = (props) => {

    const { setUser, isLoading, history, clearUser } = props;

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                history.push('/');
            } else {
                history.push('/login');
                clearUser();
            };
        });
    }, []);

    return isLoading ? <Spinner /> : (
        <Switch>
            <Route exact path='/' component={PageLanding} />
            <Route path='/login' component={PageLogin} />
            <Route path='/register' component={PageRegister} />
        </Switch>
    );
};

const mapStateToProps = (state) => ({
    isLoading: state.authReducer.isLoading,
});


export default withRouter(connect(mapStateToProps, {
    setUser,
    clearUser
})(App));
