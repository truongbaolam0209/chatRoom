import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
// import ColorPanel from './colorPanel/ColorPanel';
import Messages from './messages/Messages';
import MetaPanel from './metalPanel/MetaPanel';
import SidePanel from './sidePanel/SidePanel';



const PageLanding = (props) => {

    const { currentUser, currentChannel, isPrivateChannel } = props;

    return (
        <Grid columns='equal' className='app' style={{ background: '#eee' }}>
            {/* <ColorPanel /> */}
            <SidePanel currentUser={currentUser} />

            <Grid.Column style={{ marginLeft: 320 }}>
                <Messages
                    key={currentChannel && currentChannel.id}
                    currentUser={currentUser}
                    currentChannel={currentChannel}
                    isPrivateChannel={isPrivateChannel}
                />
            </Grid.Column>

            <Grid.Column width={4}>
                <MetaPanel />
            </Grid.Column>
        </Grid>
    );
};

const mapStateToProps = state => ({
    currentUser: state.authReducer.currentUser,
    currentChannel: state.channelReducer.currentChannel,
    isPrivateChannel: state.channelReducer.isPrivateChannel
});

export default connect(mapStateToProps)(PageLanding);