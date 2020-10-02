import md5 from 'md5';
import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate';
import { Button, Form, Grid, Header, Icon, Label, Message, Segment } from 'semantic-ui-react';
import firebase from '../firebase';
import TextInput from './ui/TextInput';


const validate = combineValidators({
    username: isRequired('username'),
    email: isRequired('email'),
    password: composeValidators(
        isRequired('password'),
        hasLengthGreaterThan(6)({ message: 'Must be 6 characters or more' })
    )()
});

const PageRegister = (props) => {

    const { handleSubmit, error, invalid, submitting } = props;

    const registerUser = async (data) => {
        try {
            const createdUser = await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
            await firebase.auth().currentUser.updateProfile({
                displayName: data.username,
                photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            });

            firebase.database().ref('usersDoc').child(createdUser.user.uid).set({
                name: createdUser.user.displayName,
                avatar: createdUser.user.photoURL
            });
            
        } catch (err) {
            console.error(err);
            throw new SubmissionError({ _error: err.message });
        };
    };

    
    return (
        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' icon color='orange' textAlign='center'>
                    <Icon name='puzzle piece' color='orange' />Register for DevChat
                </Header>
                <Form onSubmit={handleSubmit(registerUser)} size='large' autoComplete='off'>
                    <Segment stacked>
                        <Field
                            name='username'
                            type='text'
                            component={TextInput}
                            placeholder='username ...'
                        />
                        <Field
                            name='email'
                            type='text'
                            component={TextInput}
                            placeholder='email ...'
                        />
                        <Field
                            name='password'
                            type='password'
                            component={TextInput}
                            placeholder='password ...'
                        />
                        {error && <Label basic color='red'>{error}</Label>}

                        <Button
                            disabled={invalid || submitting}
                            fluid
                            color='orange'
                            size='large'
                        >Submit</Button>

                    </Segment>
                </Form>
                <Message>Already a user?<Link to='/login'>Login</Link></Message>
            </Grid.Column>
        </Grid>
    );
};

export default reduxForm({ form: 'formRegister', validate })(PageRegister);
