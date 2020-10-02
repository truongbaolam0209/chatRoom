import _ from 'lodash';
import mime from 'mime-types';
import React, { useState } from 'react';
import { Button, Input, Loader, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import firebase from '../../firebase';
import ImagePreview from '../ui/ImagePreview';



const MessageForm = (props) => {

    const { currentChannel, currentUser, getMessagesRef } = props;

    const [text, setText] = useState('');
    const [filesSelected, setFilesSelected] = useState({});

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);


    const sendMessage = async () => {
        if (text === '' && Object.values(filesSelected).length === 0) return;
        setLoading(true);

        try {
            const filesURL = await uploadFiles(Object.values(filesSelected));
            
            await getMessagesRef()
                .child(currentChannel.id)
                .push()
                .set({
                    timestamp: firebase.database.ServerValue.TIMESTAMP,
                    user: {
                        id: currentUser.uid,
                        name: currentUser.displayName,
                        avatar: currentUser.photoURL
                    },
                    text,
                    filesURL
                });

            setText('');
            setFilesSelected({});

            setLoading(false);
            setErrors([]);
        } catch (err) {
            console.error(err);
            setLoading(false);
            setErrors([...errors, { message: 'Add a message ERRORR' }]);
        };
    };

    const uploadFiles = async (files) => {
        const filesURL = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const metadata = { contentType: mime.lookup(file.name) };
            const filePath = `chat/${uuidv4()}_${file.name}`;

            const uploadTaskSnapshot = await firebase.storage()
                .ref()
                .child(filePath)
                .put(file, metadata);

            const fileURL = await uploadTaskSnapshot.ref.getDownloadURL();
            filesURL.push(fileURL);
        };
        return filesURL;
    };

    const selectFileHandle = (e) => {
        const files = e.target.files;
        const imgObj = {};
        for (let i = 0; i < files.length; i++) {
            const imgURL = URL.createObjectURL(files[i]);
            imgObj[imgURL] = files[i];
        };
        setFilesSelected(imgObj);
    };

    const renderThumbnailImages = (files) => {
        return (
            <div className='preview-container'>
                {Object.entries(files).map(([key, value]) => (
                    <ImagePreview
                        key={key}
                        src={key}
                        size='small'
                        onClick={() => setFilesSelected(_.omit(filesSelected, [key]))}
                        disabled={loading}
                    />
                ))}
            </div>
        );
    };



    return (
        <Container>
            <Segment className='message__form'>
                <Input
                    fluid
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition='left'
                    placeholder='Write your message'
                />

                {renderThumbnailImages(filesSelected)}

                <Button.Group icon widths='2'>
                    <Button
                        onClick={sendMessage}
                        disabled={loading}
                        color='orange'
                        content={loading ? <Loader active inline='centered' size='tiny' /> : 'Sent'}
                        labelPosition='left'
                        icon='edit'
                    />
                </Button.Group>

                <Input
                    onChange={selectFileHandle}
                    fluid
                    name='file'
                    type='file'
                    multiple
                />

            </Segment>
        </Container>
    );
};


export default MessageForm;


const Container = styled.div`
    .preview-container {
        display: flex;
        /* overflow: hidden; */
        overflow-x: auto;
        white-space: nowrap;
    };
`;







// const uploadFiles = async (files) => {
//     const filesURL = [];

//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];

//         const metadata = { contentType: mime.lookup(file.name) };
//         const filePath = `chat/${uuidv4()}_${file.name}`;
//         setUploadState('uploading');

//         storageRef.child(filePath).put(file, metadata)
//             .on('state_changed', res => {
//                 SetPercentUploaded(Math.round((res.bytesTransferred / res.totalBytes) * 100));
//             }, err => {
//                 console.log(err);
//                 setErrors([...errors, { message: 'Add a message TTTBBBBBB' }]);
//                 setUploadState('error');
//                 setUploadTask(null);
//             }, async () => {
//                 try {
//                     const fileURL = await storageRef.child(filePath).getDownloadURL();
//                     filesURL.push(fileURL);
//                 } catch (err) {
//                     console.log(err);
//                     setErrors([...errors, { message: 'Add a message TTTBBBBBB' }]);
//                     setUploadState('error');
//                     setUploadTask(null);
//                 };
//             });
//         console.log(filesURL);
//         setText({ ...message, filesURL });
//         setFilesSelected({});
//     };
// };
