import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Icon, Menu } from 'semantic-ui-react';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../redux/actions/channelAction';


const DirectMessages = (props) => {

    const { currentUser, setCurrentChannel, setPrivateChannel } = props;
    const [activeChannel, setActiveChannel] = useState('');
    const [users, setUsers] = useState([]);



    useEffect(() => {
        if (currentUser) {
            console.log('OK ...');
            
            let loadedUsers = [];

            // CHILD_ADD RUN ANYTIME DB CHANGED
            firebase.database().ref('usersDoc').on('child_added', res => {
                if (currentUser.uid !== res.key) {
                    let user = res.val();
                    user['uid'] = res.key;
                    user['status'] = 'offline';
                    loadedUsers.push(user);
                    setUsers([...loadedUsers]);
                };
            });

            // SHOW ALL ONLINE USER
            firebase.database().ref('.info/connected').on('value', res => {
                console.log('INFO CONNECTED ...', res.val());
                if (res.val() === true) {
                    const ref = firebase.database().ref('onlineUsersDoc').child(currentUser.uid);
                    ref.set(true);
                    ref.onDisconnect().remove(err => {
                        if (err !== null) console.error(err);
                    });
                };
            });
        
            firebase.database().ref('onlineUsersDoc').on('child_added', res => {
                console.log('onlineUsersDoc_ADDED', res.key + ' JUST SIGN IN');
                // if (currentUser.uid !== res.key) {
                //     addStatusToUser(res.key);
                // };
            });

            firebase.database().ref('onlineUsersDoc').on('child_removed', res => {
                console.log('onlineUsersDoc_REMOVED', res.key + ' JUST SIGN OUT');
                // if (currentUser.uid !== res.key) {
                //     addStatusToUser(res.key, false);
                // };
            });
        };
    }, []);


    const addStatusToUser = (userId, connected = true) => {
        const updatedUsers = users.reduce((acc, user) => {
            if (user.uid === userId) {
                user['status'] = `${connected ? 'online' : 'offline'}`;
            };
            console.log('ADD STATUS TO USERS', acc.concat(user));
            return acc.concat(user);
        }, []);

        setUsers(updatedUsers);
    };

    const changeChannel = user => {

        const channelId = user.uid < currentUser.uid
            ? `${user.uid}/${currentUser.uid}`
            : `${currentUser.uid}/${user.uid}`;

        setCurrentChannel({
            id: channelId,
            name: user.name
        });

        setPrivateChannel(true);
        setActiveChannel(user.uid);
    };



    return (
        <Menu.Menu className='menu'>
            <Menu.Item>
                <span><Icon name='mail' />DIRECT MESSAGES</span>
                {' '}
                ({users.length})
            </Menu.Item>

            {users.map(user => (
                <Menu.Item
                    key={user.uid}
                    active={user.uid === activeChannel}
                    onClick={() => changeChannel(user)}
                    style={{ opacity: 0.7, fontStyle: 'italic' }}
                >
                    <Icon name='circle' color={user.status === 'online' ? 'green' : 'yellow'} />
                    @{user.name}
                </Menu.Item>
            ))}

        </Menu.Menu>
    );
};


export default connect(null, {
    setCurrentChannel,
    setPrivateChannel
})(DirectMessages);





