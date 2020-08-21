import React, { useEffect } from 'react';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window, } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

function CustomerChat({ channel, firstName, lastName, email, chatClient }) {
    return (
        <div className="App">
            <Chat client={chatClient} theme={'messaging light'}>
                <Channel channel={channel}>
                    <Window>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput />
                    </Window>
                    <Thread />
                </Channel>
            </Chat>
        </div>
    );
}
export default CustomerChat;