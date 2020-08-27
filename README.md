# Improve your customer chat experience with information from your customers by a  post-chat survey
## Integrate surveys with Stream chat
You are providing a chat experience for your customers, but could you improve the experience? What's a great way to know if you could do better?  Ask your customers. Integrating your [Stream Chat](https://getstream.io/chat/docs) with your favorite Survey tool is a relatively painless endeavor. In this post I demonstrate how to launch a survey at the conclusion of a Chat session. I integrate with [SurveyLegend](https://www.surveylegend.com), but many of the major survey tools provide the same integration option that I demonstrate here.

## What the app does

This app presents a simple landing page and on the lower right corner of the page there is a button to iniciate a chat session.

![](images/landing-page.png)

When this button is clicked, the user is presented a form to enter some details and then they join a Chat session.

![](images/join-and-chat.png)

Once the chat is completed, the user simply closes the chat session by clicking on the large X in the upper right of the screen. *(Note: in a production app, you may want to add some confirmation dialog boxes between closing the chat and launching the survey; we have kept things simple for the purposes of this post.)*

![](images/close-chat.png)

The app then launches the survey as an `iFrame` in the same modal window. Clicking the close `X` in the upper right corner, returns to the initial starting point.

![](images/survey-screens.png)

## Technical Overview

The app in this post is composed of a `React` frontend and a `nodjs` backend. The frontend components were bootstrapped using `create-react-app`, and the backend server is an `Express` app running on `nodejs`. Both frontend and backend leverage Stream's [JavaScript library](https://github.com/GetStream/stream-js).

For SurveyLegend, I created a free account and then a simple survey. SurveyLegend automatically provides and iFrame code that I use to launch the survey. This is explained below.

All the code required for this tutorial is available in the github repository [github/stream-chat-survey](LOCATION).

## Prerequisites

To run the app in this post or build it out yourself, you will need a free Stream account (get it [here](https://getstream.io/get_started/?signup=#flat_feed)) and an account with a Survey tool (I use a free SurveyLegend account, sign up [here](https://www.surveylegend.com/register/)).

The code in this post is intended to run locally, and assumes a basic knowledge of [React Hooks](https://reactjs.org/docs/hooks-intro.html), [Express](https://expressjs.com/), and [Node.js](https://nodejs.org/en/ "node website").

## The Process
The steps we will take to configure the `backend` are:

1. [Registering and Configuring Stream](#registering-and-configuring-stream)
2. [Create a Stream Chat Session](#create-a-stream-chat-session)

The steps to build the `frontend app` are:
1. [Bootstrap the Frontend Application](#1---bootstrap-the-frontend-application)
2. []
2. [Authenticate Admin and Customer to the Chat](#2---authenticate-admin-and-custoemr-to-the-chat)
3. [Send messages to Zendesk](#3---send-messages-to-zendesk)
4. [Miscellaneous Backend Endpoints](#4---miscellaneous-backend-endpoints)

### Registering and Configuring Stream

If you choose to build out this app using the code snippets instead of copping the repository from `github`, you can run the following commands in the terminal:

```terminal
cd ~/[your local git folder]

mkdir stream-chat-survey

cd stream-chat-survey

mkdir backend

cd backend

npm init
```

Follow the onscreen instructions inititalize the `backend` app, you will then run the following commands to finish the build of the `backend`:

```terminal

```
This application uses two backend environment variables:

- STREAM_API_KEY
- STREAM_API_SECRET

You will find a file in the Backend folder, `.env.example`, that you can rename to create a `.env` file.

To lookup your `Stream` credentials, navigate to your [Stream.io Dashboard](https://getstream.io/dashboard/)

![](images/stream-dashboard-button.png)

Then click on "Create App"

![](images/stream-create-app-button.png)

Give your app a name and select `Development` and click `Submit`

![](images/stream-create-new-app-button.png)

`Stream` will generate a `Key` and `Secret` for your app. Copy these and update the corresponding environment variables.

![](images/stream-key-secret-copy.png)

When the .env file has been created, you can start the backend by `npm start` command from the backend folder.

## 1 - Bootstrap the Frontend Application

The `frontend` was bootstrapped using `create-react-app`. For example, inside of your application folder (in this post it is `stream-chat-survey`, from a terminal you would run:

```terminal
npx create-react-app frontend
```

Then you can update the scr/App.js files with the following code. You will note that this sets up a simple landing page.

```jsx
import React from "react";
import "./App.css";
import ChatWidget from "./chatWidget.js";

function App() {

  return (
      <div className="App">
        <div className="App-header">
          <p>Stream and SurveyLegend Integration</p>
          <div className="image"></div>
          <p>(This is an example landing page)</p>
          <ChatWidget></ChatWidget>
        </div>
      </div>
  );
}

export default App;
```

### Add library references

The `app` functionality is contained within the file, `chatWidget.js`, let's break down what goes on here.

Stream's convenient libraries power the front-end. Here is the list of libraries loaded:

```jsx
// frontend.../src/App.js:1-15
import React, { useState, useEffect } from "react";
import {
  Chat,
  Channel,
  Window,
  TypingIndicator,
  MessageList,
  MessageCommerce,
  MessageInput,
  MessageInputFlat,
  withChannelContext
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import axios from "axios";
import "stream-chat-react/dist/css/index.css";
```

### Frontend function

The `Admin` and `Customer` chat screens in this post utilize the same code with the following differences. The first is a different Constant to designate the different type of user - `Admin` versus `Customer` - as follows:
```jsx
// frontend-admin/scr/App.js:18
const username = "Admin";
```
and
```jsx
// frontend-customer/scr/App.js:18
const username = "Customer";
```
and a slight change in the `start` reference in the `package.json` file:

```jsx
// frontend-admin/package.json:17
    "start": "PORT=4000 react-scripts start",
```

Next, the frontend requests a `usertoken` from the backend and joins Stream Channel created by the `backend` (More on this in the next step). Once the token and connection to the channel are received, the code renders the chat screen and watches the channel for changes.

```jsx
// frontend-.../scr.App.js:20-107
function Frontend() {
  document.title = "CS Admin";
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const username = "Admin";
    async function getToken() {
      try {
        const response = await axios.post("http://localhost:7000/join", {
          username
        });
        console.log(response.data.token);
        const token = response.data.token;
        chatClient = new StreamChat(response.data.api_key);

        chatClient.setUser(
          {
            id: username,
            name: username
          },
          token
        );

        const channel = chatClient.channel("messaging", "livechat", {
          name: "CS Admin"
        });

        await channel.watch();
        setChannel(channel);
      } catch (err) {
        console.log(err);
        return;
      }
    }

    getToken();
  }, []);

  if (channel) {
    const CustomChannelHeader = withChannelContext(
      class CustomChannelHeader extends React.PureComponent {
        render() {
          return (
            <div className="str-chat__header-livestream">
              <div className="str-chat__header-livestream-left">
                <p className="str-chat__header-livestream-left--title">
                  Customer Support Chat
                </p>
              </div>
              <div className="str-chat__header-livestream-right">
                <div className="str-chat__header-livestream-right-button-wrapper">
                </div>
              </div>
            </div>
          );
        }
      }
    );
    
    async function handleMessage(channelId, message){
      let r1 = await axios.put("http://localhost:7000/updateDesc", {
          message,
          author: username
        });
      let r2 = await channel.sendMessage(message);
      return r2 + r1
    }

    return (
      <Chat client={chatClient} theme="commerce light">
        <Channel channel={channel} doSendMessageRequest={handleMessage}>
          <Window>
            <CustomChannelHeader />
            <MessageList
              typingIndicator={TypingIndicator}
              Message={MessageCommerce}
            />
            <MessageInput Input={MessageInputFlat} focus />
          </Window>
        </Channel>
      </Chat>
    );
  }

  return <div></div>;
}

export default Frontend;
```

## 2 - Authenticate Admin and Customer to the Chat

The express-based [backend](http://localhost:7000/) code for Stream Chat first creates a `StreamChat` object which is our client to communicate with the Stream Chat API.

```jsx
// backend/server.js:95-99
// initialize Stream Chat SDK
const serverSideClient = new StreamChat(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);
```
The specific express endpoint that is called by the front is, http://localhost:7000/join, which generates a chat [channel](https://getstream.io/chat/docs/initialize_channel/?language=js), and generate a Stream [frontend token](https://getstream.io/blog/integrating-with-stream-backend-frontend-options/), which is used by `Admin` and `Customer`. 

```javascript
// backend/server.js:101-122
app.post("/join", async (req, res) => {
  const { username } = req.body;
  const token = serverSideClient.createToken(username);
  try {
    await serverSideClient.updateUser(
      {
        id: username,
        name: username
      },
      token
    );
    const admin = { id: "admin" };
    const channel = serverSideClient.channel("messaging", "livechat", {
      name: "Customer support",
      created_by: admin
    });

    await channel.create();
    await channel.addMembers([username]);
  } catch (err) {
    console.log(err);
  }

  return res
    .status(200)
    .json({ user: { username }, token, api_key: process.env.STREAM_API_KEY });
});
```

## 3 - Send messages to Zendesk

Sending the message to Zendesk happens via a backend endpoint, http://localhost:7000/updateDesc, and function on the frontend, `handleMessage` to pass the message to this `backend endpoint`.

The first thing in this process is to set a Constant to hold the `Lead ID` (you need to create at least one Lead in Zendesk or you can use an existing Lead - see step 4 below to lookup your Lead ID):
```jsx
// backend/Server.js:40
const leadId = 'your-lead-id'
```

Next we code a backend function to retrieve the Lead Description from Zendesk, called `getLeadDesc`, as follows:

```jsx
// backend/Server.js:60-76
async function getLeadDesc(req, res) {
  try {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
    }        
    const response = await axios.get(
        'https://api.getbase.com/v2/leads/' + leadId,
        {headers: headers}
    );
    // console.log(response.data.data);
    return response.data.data.description;
  } catch (err) {
    console.log(err);
    res.status(500);
}};
```

The backend then has an endpoint, `/updateDesc`, which first calls the `getLeadDesc` function and then appends the new message to the Description and `puts` it back into Zendesk, as follows:

```jsx
// backend/Server.js:78-99
app.put('/updateDesc', async (req, res) => {
  try {
      let leadDesc = await getLeadDesc(leadId);
      const payload = {
          'description': leadDesc += `\n${req.body.author}: ${req.body.message.text}`
        }
      const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
      }        
      await axios.put(
          'https://api.getbase.com/v2/leads/' + leadId,
          {data: payload},
          {headers: headers}
      );
      res.send({});
  } catch (err) {
      console.log(err);
      res.status(500);
  }
});
```

The two frontends pass the message to `/updateDesc` with the following function, `handleMessage`:
```jsx
// frontend-.../src/App.js:78-85
    async function handleMessage(channelId, message){
      let r1 = await axios.put("http://localhost:7000/updateDesc", {
          message,
          author: username
        });
      let r2 = await channel.sendMessage(message);
      return r2 + r1
    }
```

As you send messages from either the `Admin` or `Customer` chat screens, you can immediately see the information being updated in Zendesk by either refreshing the Edit Lead screen in Zendesk, or by the helper backend page, http://localhost:7000/getLeadDesc, described below.

## 4 - Miscellaneous Backend Endpoints

The `backend` includes two additional endpoints that are included as helpers, to 1) lookup the Lead ID in Zendesk and, 2) to show the updated Lead Description without having to refresh the Lead Description screen in Zendesk.

Once you have manually created a Lead in Zendesk, you can navigate to this backend endpoint, http://localhost:7000/getLeads, to look up the Zendesk `LeadId`, which is not exposed in the Zendesk UI. The code for this endpoint follows:

```jsx
// backend/Server.js:22-38
app.get("/getleads", async (req, res) => {
  try {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
    }        
    const response = await axios.get(
        'https://api.getbase.com/v2/leads',
        {headers: headers}
    );
    // console.log(response.data.items);
    res.send(response.data.items);
  } catch (err) {
    console.log(err);
    res.status(500);
}});
```

We also provide a final `backend endpoint` to facilitate a quick check that the message text is being loaded correctly into your Lead Description. You can refresh, http://localhost:7000/getLeadDesc, when you send a message form either `Admin` or `Customer`. The code for this endpoint follows:

```jsx
// backend/Server.js:42-58
app.get("/getLeadDesc", async (req, res) => {
  try {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZENDESK_CRM_TOKEN}`
    }        
    const response = await axios.get(
        'https://api.getbase.com/v2/leads/' + leadId,
        {headers: headers}
    );
    // console.log(response.data.data);
    res.send(response.data.data.description);
  } catch (err) {
    console.log(err);
    res.status(500);
}});
```

And that does it! You now understand how to integrate Stream Chat with Zendesk Sell to update Lead Descriptions (or any other Zendesk component as needed) during your sales chat experience.
