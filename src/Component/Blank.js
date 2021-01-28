import { Component } from "react";
import Main from "../Component/Main";
import DataChannel from "./DataChannel";
// import WebRTCimg from "../Image/WebRTC.png";
import MyCheck from "./MyCheck";
import PeerConnection from "./PeerConnection";

export default class Blank extends Component {
  render() {
    if (this.props.keyName === "0") {
      return (
          <MyCheck />
      );
    } else if (this.props.keyName === "1") {
      return <Main />;
    } else if (this.props.keyName === "2") {
      return (
        <>
        <h1>일대일 화상채팅을 진행합니다.</h1>
        <PeerConnection />
        </>
      )
    } else if (this.props.keyName === "3") {
      return (
           <DataChannel />
      )
    } else {
      return <h3>{this.props.keyName}</h3>;
    }
  }
}
