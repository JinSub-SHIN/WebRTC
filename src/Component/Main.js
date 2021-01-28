import React from "react";
import "../App.css";
import "../StyleSheet/main.css";
import "antd/dist/antd.css";

// import VideoFirst from "../Component/VideoFirst";
// import Filter from "../Component/Filter";
// import AudioTest from "./AudioTest";
// import MyAudio from "./MyAudio";
import SelectVideo from "./SelectVideo";
import SelectAudio from "./SelectAudio";
import Capture from "./Capture";

class Main extends React.Component {
  state = {
    value: "",
  };

  StateChange = (value) => {
    this.setState({
      value: value,
    });
  };

  render() {
    if (this.props.current === 0) {
      return (
          <div>
            {/* <VideoFirst value={this.state.value} /> */}
            <SelectVideo />
            {/* <hr />
            <Filter value={this.state.value} StateChange={this.StateChange} />
            <hr />
            <canvas />
            <hr />

            <AudioTest />

            <hr />

            <MyAudio />

            <div id="errorMsg" /> */}
          </div>
      );
    } else if (this.props.current === 1) {
      return (
        <div>          
          <SelectAudio />
        </div>
      )      
    } else if (this.props.current === 2) {
      return (
        <div>
          <Capture />
        </div>
      );
    }
  }
}

export default Main;
