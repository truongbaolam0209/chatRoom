import moment from 'moment';
import React from 'react';
import { Comment, Image } from 'semantic-ui-react';


const Message = (props) => {

    const { message, currentUser } = props;

    const isOwnMessage = (message, user) => {
        return message.user.id === user.uid ? 'message__self' : '';
    };

    const isImage = message => {
        return message.hasOwnProperty('filesURL') && !message.hasOwnProperty('text');
    };

    return (
        <Comment>
            <Comment.Avatar src={message.user.avatar} />
            <Comment.Content className={isOwnMessage(message, currentUser)}>
                <Comment.Author as='a'>{message.user.name}</Comment.Author>

                <Comment.Metadata>{moment(message.timestamp).fromNow()}</Comment.Metadata>

                {isImage(message)
                    ? <Image src={message.filesURL} className='message__image' />
                    : <Comment.Text>{message.text}</Comment.Text>
                }
            </Comment.Content>
        </Comment>
    );
};

export default Message;
