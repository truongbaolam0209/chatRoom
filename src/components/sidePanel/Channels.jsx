import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Form, Icon, Label, Menu, Segment } from 'semantic-ui-react';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../redux/actions/channelAction';
import TextInput from '../ui/TextInput';


const Channels = (props) => {

    const { setCurrentChannel, currentUser, setPrivateChannel } = props;
    const { error, handleSubmit } = props;


    const [activeChannelId, setActiveChannelId] = useState('');
    const [channel, setChannel] = useState(null);
    const [channels, setChannels] = useState([]);
    const [firstLoad, setFirstLoad] = useState(true);
    const [notifications, setNotifications] = useState([]);



    const changeChannel = (channel) => {
        setActiveChannelId(channel.id);
        setCurrentChannel(channel);
        setPrivateChannel(false);
        setChannel(channel);
    };

    const addChannel = async (dataSubmit) => {
        const id = uuidv4();
        try {
            await firebase.database().ref('channelsDoc').child(id).set({
                id,
                name: dataSubmit.channelName,
                details: dataSubmit.channelDetails,
                createdBy: { name: currentUser.displayName, avatar: currentUser.photoURL }
            });
        } catch (err) {
            console.error(err);
        };
    };

    const fetchAllChannels = () => {
        let loadedChannels = [];
        firebase.database().ref('channelsDoc').on('child_added', res => {
            loadedChannels.push(res.val());
            setChannels(loadedChannels);

            // console.log(firstLoad, channels);
            if (firstLoad && channels.length > 0) {
                console.log('CHECK FIRST LOAD ...');
                setCurrentChannel(channels[0]);
                setActiveChannelId(channels[0].id);
            };
            setFirstLoad(false);
            handleNotifications(res.key);
        });
    };

    const handleNotifications = (channelId) => {

        firebase.database().ref('messagesPublicDoc').child(channelId).on('value', res => {
            if (channel) {
                let lastTotal = 0;
                let index = notifications.findIndex(noti => noti.id === channelId);

                if (index !== -1) {
                    if (channelId !== channel.id) {
                        lastTotal = notifications[index].total;

                        if (res.numChildren() - lastTotal > 0) notifications[index].count = res.numChildren() - lastTotal;
                    };
                    notifications[index].lastKnownTotal = res.numChildren();
                } else {
                    notifications.push({
                        id: channelId,
                        total: res.numChildren(),
                        lastKnownTotal: res.numChildren(),
                        count: 0
                    });
                };
                setNotifications([...notifications]);
            };
        });
    };



    useEffect(() => {
        fetchAllChannels();
        return () => firebase.database().ref('channelsDoc').off();
    }, []);


    
    return (
        <Fragment>
            <Menu.Menu style={{ paddingBottom: '2em' }}>
                <Menu.Item>
                    <span><Icon name='exchange' />CHANNELS</span>
                    {' '}({channels.length})
                    <Icon name='add' />
                </Menu.Item>

                {channels.map(channel => (
                    <Menu.Item
                        key={channel.id}
                        onClick={() => changeChannel(channel)}
                        name={channel.name}
                        style={{ opacity: 0.7 }}
                        active={channel.id === activeChannelId}
                    >
                        # {channel.name}
                    </Menu.Item>
                ))}

            </Menu.Menu>

            <Form size='large' onSubmit={handleSubmit(addChannel)} autoComplete='off'>
                <Segment>
                    <Field
                        fluid
                        name='channelName'
                        component={TextInput}
                        label='Name of Channel'
                    />
                    <Field
                        fluid
                        name='channelDetails'
                        component={TextInput}
                        label='About the Channel'
                    />
                    {error && <Label basic color='red'>{error}</Label>}
                    <Button fluid size='large' color='teal'><Icon name='checkmark' />Add</Button>
                </Segment>
            </Form>

        </Fragment>
    );
};

export default connect(null, {
    setCurrentChannel,
    setPrivateChannel
})(reduxForm({ form: 'formAddChannel' })(Channels));



