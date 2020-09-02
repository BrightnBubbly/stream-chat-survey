import React, { useState } from "react";
import { StreamChat } from "stream-chat";
import {
    Chat,
    Channel,
    ChannelHeader,
    MessageInput,
    MessageList,
    Thread,
    Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import "./App.css";
import chaticon from "./chat-icon-white.png"
import closeicon from "./close-icon.png"

function ChatWidget() {
    const [chatState, setChatState] = useState("WAIT"); // WAIT, JOIN, CHAT, SURVEY
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);

    async function register(event) {
        event.preventDefault(); // stop processing of form submission
        const response = await fetch("http://localhost:8080/registrations", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName,
                lastName,
                email,
            }),
        });
        const { userId, token, channelId, apiKey } = await response.json();
        const chatClient = new StreamChat(apiKey);
        await chatClient.setUser(
            {
                id: userId,
                name: email,
                image: `https://getstream.io/random_svg/?id=${userId}`,
            },
            token
        );

        const channel = chatClient.channel("messaging", channelId);
        setChatClient(chatClient);
        setChannel(channel);
        setFirstName(""); //reset FirstName input
        setLastName(""); //reset LastName input
        setEmail(""); //reset Email input
        setChatState("CHAT"); //show the Chat window
    }

    function wait() {
        return (
            <div className="wait" onClick={() => setChatState("JOIN")}>
                <img src={chaticon} alt="shows integration between Stream and SurveyLegend"></img>
                <span className="tooltiptext">Click to chat</span>
            </div>
        );
    };

    function join() {
        return (
            <div className="modal">
                <div className="modal-header" onClick={() => setChatState("WAIT")}>
                    <img src={closeicon} alt="X"></img>
                    <span className="tooltiptext">Click to cancel chat</span>
                </div>
                <div className="modal-content">
                    <form className="card">
                        <label>First Name</label>
                        <p>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="first name"
                                required
                            />
                        </p>
                        <label>Last Name</label>
                        <p>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="last name"
                                required
                            />
                        </p>
                        <label>Email</label>
                        <p>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email"
                                required
                            />
                        </p>
                    </form>
                </div>
                <div className="modal-footer" onClick={register}>
                    <button className="close" type="submit">
                        Start chat
                </button>
                    <span className="tooltiptext">Click to Submit</span>
                </div>

            </div>
        );
    };

    function chat() {
        function startSurvey() {
            //this function resets the Chat when initiating Survey
            setChatState("SURVEY");
            setChannel(null); //reset Chat for another user if need be
            setChatClient(null); //reset Chat for another user if need be
        }

        return (
            <div id="myChat" class="chat">
                <div className="chat-header">
                    <img src={closeicon} alt="X" onClick={startSurvey}></img>
                    <span className="tooltiptext">Close chat to launch Survey</span>
                </div>
                <div className="chat-content">
                    <div>
                        <Chat client={chatClient} theme={"messaging light"}>
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
    };

    function survey() {
        return (
            <div className="survey">
                <div className="survey-header">
                    <img src={closeicon} alt="X" onClick={() => setChatState("WAIT")}></img>
                    <span className="tooltiptext">Click to return to Wait</span>
                </div>
                <div className="survey-content">
                    <iframe
                        id="surveylegend-survey"
                        title="my survey"
                        src={process.env.REACT_APP_SURVEY_SRC}
                        width="98%"
                        height="95%"
                        allowtransparency="true"
                        style={{
                            background: "transparent",
                            backgroundColor: "transparent",
                        }}
                    ></iframe>
                </div>
            </div>
        );
    };

    if (chatState === "WAIT") {
        return wait();
    }

    if (chatState === "JOIN") {
        return join();
    }

    if (chatState === "CHAT") {
        return chat();
    }

    if (chatState === "SURVEY") {
        return survey();
    }
}

export default ChatWidget;
