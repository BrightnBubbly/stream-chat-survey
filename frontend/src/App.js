import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window, } from 'stream-chat-react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          This is the landing page, add appropriate content
        </p>
        <ChatWidget></ChatWidget>
      </header>
    </div>
  );
}

export default App;


function ChatWidget() {
  const [chatState, setChatState] = useState('WAIT'); // WAIT, LOAD, CHAT, SURVEY
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);

  // const register = () => {
    function Join() {
      setChatState('SURVEY');
    }

    const register = async (e) => {
      try {
        e.preventDefault();
        console.log('got here')
        const response = await fetch('http://localhost:8080/customer-login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
          }),
        });
  
        const { customerId, customerToken, channelId, streamApiKey } = await response.json();
        const chatClient = new StreamChat(streamApiKey);
  
        await chatClient.setUser(
          {
            id: customerId,
            name: firstName,
          },
          customerToken,
        );
  
        const channel = chatClient.channel('messaging', channelId);
  
        setChatClient(chatClient);
        setChannel(channel);
        setChatState("CHAT");

      } catch (e) {
        console.error(e);
      }
    };
  
    if (chatState === "SURVEY") {
      return (    
        /*-- The Modal --*/
        <div id="myModal" class="modal">
        
          {/* Modal content */}
          <div class="modal-content">
            <span class="close">&times;</span>
            <p>Some text in the Modal..</p>
            <iframe
              id="surveylegend-survey"
              src="https://www.surveylegend.com/survey/#/d29yZHByZXNzMTE2NTky~-MF6VEjI4FTDLM06jlT4"
              width="100%"
              height="1000px"
              allowtransparency="true"
              style="frameborder: 0; border: 0; margin: 0 auto; background: transparent; background-color: transparent;">
          	</iframe>
          </div>
        </div>
      )      
    }
    
    if (chatState === 'CHAT') {
      return (
        <div id="myModal" class="modal">
        
        {/* Modal content */}
        <div class="modal-content">
          <span class="close">&times;</span>

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
        </div>
         </div>
    );

    }

    if (chatState === "JOIN") {
      return (
        <div id="myModal" class="modal">
        
        {/* Modal content */}
        <div class="modal-content">
          <span class="close">&times;</span>

        <div className="App container">
         <form className="card" onSubmit={register}>
           <label>First Name</label>
           <input
             type="text"
             value={firstName}
             onChange={(e) => setFirstName(e.target.value)}
             placeholder="first name"
            required
          />
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="last name"
            required
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            required
          />
          <button type="submit">
            Start chat
          </button>
        </form>
        </div>
       </div>
         </div>

      );
    }

    if (chatState === "WAIT") {
      return (
            <div style={{position: 'absolute', right: 30, bottom: 30}}>
              <button style={{width: '60px', height: '60px'}}onClick ={Join}>^</button>
            </div>
      );
    }
 
  // }
}

