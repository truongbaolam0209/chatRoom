import React, { useEffect, useState } from 'react';
import { Comment, Segment } from 'semantic-ui-react';
import firebase from '../../firebase';
import Message from './Message';
import MessageForm from './MessageForm';
import MessagesHeader from './MessagesHeader';



const Messages = (props) => {

    const { currentChannel, currentUser, isPrivateChannel } = props;

    const [messages, setMessages] = useState([]);
    const [messagesSearch, setMessagesSearch] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [numUniqueUsers, setNumUniqueUsers] = useState([]);
    

    useEffect(() => {
        if (currentChannel && currentUser) {
            FetchMessages();
        };
    }, []);

    // CHECK IF PRIVATE OR PUBLIC DOC
    const getMessagesRef = () => {
        return isPrivateChannel
            ? firebase.database().ref('messagesPrivateDoc')
            : firebase.database().ref('messagesPublicDoc');
    };

    const FetchMessages = () => {
        let loadedMessages = [];
        getMessagesRef().child(currentChannel.id).on('child_added', res => {
            loadedMessages.push(res.val());
            setMessages([...loadedMessages]);
            countUniqueUsers([...loadedMessages]);
        });
    };

    const countUniqueUsers = messages => {
        // FIND UNIQUE USERS IN CHAT
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) acc.push(message.user.name);
            return acc;
        }, []);

        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;

        const num = `${uniqueUsers.length} user${plural ? 's' : ''}`;

        setNumUniqueUsers(num);
    };

    const handleSearchChange = e => {
        setSearchTerm(e.target.value);
        setSearchLoading(true);
        
        const channelMessages = [...messages];
        const regex = new RegExp(e.target.value, 'gi');
        console.log(regex);

        const searchText = channelMessages.reduce((acc, message) => {
            // if ((message.text && message.text.match(regex)) || message.user.name.match(regex)) {
            if (message.text && message.text.match(regex)) {
                acc.push(message);
            };
            return acc;
        }, []);

        setMessagesSearch(searchText);
        setTimeout(() => setSearchLoading(false), 500);
    };


    const displayMessages = messages => messages.length > 0 && messages.map(message => (
        <Message
            key={message.timestamp}
            message={message}
            currentUser={currentUser}
        />
    ));

    
    const displayChannelName = channel => {
        return channel ? `${isPrivateChannel ? '@' : '#'}${currentChannel.name}` : '';
    };


    return (
        <React.Fragment>

            <MessagesHeader
                channelName={displayChannelName(currentChannel)}
                numUniqueUsers={numUniqueUsers}
                handleSearchChange={handleSearchChange}
                searchLoading={searchLoading}
                isPrivateChannel={isPrivateChannel}
            />

            <Segment>
                <Comment.Group className='messages'>
                    {searchTerm
                        ? displayMessages(messagesSearch)
                        : displayMessages(messages)}
                </Comment.Group>
            </Segment>

            <MessageForm
                currentChannel={currentChannel}
                currentUser={currentUser}
                isPrivateChannel={isPrivateChannel}
                getMessagesRef={getMessagesRef}
            />
            
        </React.Fragment>
    );
};

export default Messages;
