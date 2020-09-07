import React from "react";
import "stream-chat-react/dist/css/index.css";
import "./App.css";
import ChatWidget from "./ChatWidget.js";
import landimage from "./stream_and_surveylegend.png";

function App() {

  return (
    <div className="App">
      <div className="App-header">
        <p>Stream and SurveyLegend Integration</p>
        <div><img src={landimage} alt="shows integration between Stream and SurveyLegend"></img></div>
        <p>(This is an example landing page)</p>
        <ChatWidget></ChatWidget>
      </div>
    </div>
  );
}

export default App;