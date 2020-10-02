import React from 'react';
import { Icon, Image } from 'semantic-ui-react';
import styled from 'styled-components';



const ImagePreview = (props) => {

    const { src, size, onClick, disabled } = props;

    return (
        <Container>
            <Icon
                className='btn-remove'
                name='times circle outline'
                size='large'
                onClick={onClick}
            />
            <div className='img-container'>
                <Image
                    className='img-preview'
                    src={src}
                    size={size}
                    disabled={disabled}
                />
            </div>
            
        </Container>
    );
};

export default ImagePreview;



const Container = styled.div`
    position: relative;

    .btn-remove {
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 10;
        color: #bdc3c7;
    };
    .btn-remove:hover {
        cursor: pointer;
    };


    .img-container {
        width: 150px;
        height: 150px;
        overflow: hidden;
        background-color: #bdc3c7;
        margin: 5px;
        padding: 5px;
        border-radius: 5px;
    };

    .img-preview {
        /* margin: 5px; */
        /* padding: 5px; */
    };

`;
