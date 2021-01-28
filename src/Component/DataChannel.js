import React, { Component } from "react";
import { Button } from "antd";

export default class DataChannel extends Component {
  componentDidMount() {
    var localConnection;
    var remoteConnection;
    var sendChannel;
    var receiveChannel;
    var pcConstraint;
    var dataConstraint;
    var dataChannelSend = document.querySelector("textarea#dataChannelSend");
    var dataChannelReceive = document.querySelector(
      "textarea#dataChannelReceive"
    );
    var startButton = document.querySelector("button#startButton");
    var sendButton = document.querySelector("button#sendButton");
    var closeButton = document.querySelector("button#closeButton");

    startButton.onclick = createConnection;
    sendButton.onclick = sendData;
    closeButton.onclick = closeDataChannels;

    function enableStartButton() {
      startButton.disabled = false;
    }

    function disableSendButton() {
      sendButton.disabled = true;
    }

    function createConnection() {
      dataChannelSend.placeholder = "";
      var servers = null;
      pcConstraint = null;
      dataConstraint = null;
      trace("Using SCTP based data channels");
      // For SCTP, reliable and ordered delivery is true by default.
      // Add localConnection to global scope to make it visible
      // from the browser console.
      window.localConnection = localConnection = new RTCPeerConnection(
        servers,
        pcConstraint
      );
      trace("PeerConnection 생성...");

      sendChannel = localConnection.createDataChannel(
        "sendDataChannel",
        dataConstraint
      );
      trace("DataChannel 생성...");

      localConnection.onicecandidate = iceCallback1;
      sendChannel.onopen = onSendChannelStateChange;
      sendChannel.onclose = onSendChannelStateChange;

      // Add remoteConnection to global scope to make it visible
      // from the browser console.
      window.remoteConnection = remoteConnection = new RTCPeerConnection(
        servers,
        pcConstraint
      );
      trace("RemotePeerConnection 생성...");

      remoteConnection.onicecandidate = iceCallback2;
      remoteConnection.ondatachannel = receiveChannelCallback;

      localConnection
        .createOffer()
        .then(gotDescription1, onCreateSessionDescriptionError);
      startButton.disabled = true;
      closeButton.disabled = false;
    }

    function onCreateSessionDescriptionError(error) {
      trace("Failed to create session description: " + error.toString());
    }

    function sendData() {
      var data = dataChannelSend.value;
      sendChannel.send(data);
      trace("Sent Data: " + data);
    }

    function closeDataChannels() {
      trace("Closing data channels");
      sendChannel.close();
      trace("Closed data channel with label: " + sendChannel.label);
      receiveChannel.close();
      trace("Closed data channel with label: " + receiveChannel.label);
      localConnection.close();
      remoteConnection.close();
      localConnection = null;
      remoteConnection = null;
      trace("Closed peer connections");
      startButton.disabled = false;
      sendButton.disabled = true;
      closeButton.disabled = true;
      dataChannelSend.value = "";
      dataChannelReceive.value = "";
      dataChannelSend.disabled = true;
      disableSendButton();
      enableStartButton();
    }

    function gotDescription1(desc) {
      localConnection.setLocalDescription(desc);
      trace("localConnection 에 대한 정보.... \n" + desc.sdp);
      remoteConnection.setRemoteDescription(desc);
      remoteConnection
        .createAnswer()
        .then(gotDescription2, onCreateSessionDescriptionError);
    }

    function gotDescription2(desc) {
      remoteConnection.setLocalDescription(desc);
      trace("remoteConnection 에 대한 정보... \n" + desc.sdp);
      localConnection.setRemoteDescription(desc);
    }

    function iceCallback1(event) {
      trace("local ice callback");
      if (event.candidate) {
        remoteConnection
          .addIceCandidate(event.candidate)
          .then(onAddIceCandidateSuccess, onAddIceCandidateError);
        trace("Local ICE candidate: \n" + event.candidate.candidate);
      }
    }

    function iceCallback2(event) {
      trace("remote ice callback");
      if (event.candidate) {
        localConnection
          .addIceCandidate(event.candidate)
          .then(onAddIceCandidateSuccess, onAddIceCandidateError);
        trace("Remote ICE candidate: \n " + event.candidate.candidate);
      }
    }

    function onAddIceCandidateSuccess() {
      trace("AddIceCandidate 성공!");
    }

    function onAddIceCandidateError(error) {
      trace("Failed to add Ice Candidate: " + error.toString());
    }

    function receiveChannelCallback(event) {
      trace("Receive Channel Callback");
      receiveChannel = event.channel;
      receiveChannel.onmessage = onReceiveMessageCallback;
      receiveChannel.onopen = onReceiveChannelStateChange;
      receiveChannel.onclose = onReceiveChannelStateChange;
    }

    function onReceiveMessageCallback(event) {
      trace("Received Message");
      dataChannelReceive.value = event.data;
    }

    function onSendChannelStateChange() {
      var readyState = sendChannel.readyState;
      trace("Send channel state is: " + readyState);
      if (readyState === "open") {
        dataChannelSend.disabled = false;
        dataChannelSend.focus();
        sendButton.disabled = false;
        closeButton.disabled = false;
      } else {
        dataChannelSend.disabled = true;
        sendButton.disabled = true;
        closeButton.disabled = true;
      }
    }

    function onReceiveChannelStateChange() {
      var readyState = receiveChannel.readyState;
      trace("Receive channel state is: " + readyState);
    }

    function trace(text) {
      if (text[text.length - 1] === "\n") {
        text = text.substring(0, text.length - 1);
      }
      if (window.performance) {
        var now = (window.performance.now() / 1000).toFixed(3);
        console.log(now + ": " + text);
      } else {
        console.log(text);
      }
    }
  }

  render() {
    return (
      <div>
        <h1>채팅하기</h1>
        <textarea
          id="dataChannelSend"
          disabled
          placeholder="보낼 메세지를 입력하세요."
          style={{width:"50%"}}
        ></textarea>
        <hr />
        <textarea id="dataChannelReceive" disabled style={{width:"50%"}} placeholder="수신된 메세지는 여기에 표시됩니다."></textarea>

        <div id="buttons" style={{marginTop:10}}>
          <Button id="startButton" style={{marginRight:"10px"}}>Start</Button>
          <Button id="sendButton" style={{marginRight:"10px"}}>Send</Button>
          <Button id="closeButton" style={{marginRight:"10px"}}>Stop</Button>
        </div>
      </div>
    );
  }
}
