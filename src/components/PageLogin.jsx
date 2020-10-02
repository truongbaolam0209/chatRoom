import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Button, Form, Grid, Header, Icon, Label, Message, Segment } from 'semantic-ui-react';
import firebase from '../firebase';
import TextInput from './ui/TextInput';



const PageLogin = (props) => {

    const { handleSubmit, error, invalid, submitting } = props;

    const loginUser = async (data) => {
        try {
            const createdUser = await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
            console.log(createdUser);
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
                <Form onSubmit={handleSubmit(loginUser)} size='large' autoComplete='off'>
                    <Segment stacked>
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
                <Message>Have no account yet?<Link to='/register'>Register</Link></Message>
            </Grid.Column>
        </Grid>
    );
};

export default reduxForm({ form: 'formLogin' })(PageLogin);
