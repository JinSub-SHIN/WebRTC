import React, { Component } from "react";
import { Button } from "antd";

export default class Capture extends Component {
  componentDidMount() {
    function handleSuccess(stream) {
      startButton.disabled = true;
      const video = document.querySelector("video");
      video.srcObject = stream;

      // demonstrates how to detect that the user has stopped
      // sharing the screen via the browser UI.
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        errorMsg("The user has ended sharing the screen");
        startButton.disabled = false;
      });
    }

    function handleError(error) {
      errorMsg(`getDisplayMedia error: ${error.name}`, error);
    }

    function errorMsg(msg, error) {
      const errorElement = document.querySelector("#errorMsg");
      errorElement.innerHTML += `<p>${msg}</p>`;
      if (typeof error !== "undefined") {
        console.error(error);
      }
    }

    const startButton = document.getElementById("startButton");
    startButton.addEventListener("click", () => {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then(handleSuccess, handleError);
    });

    if (navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices) {
      startButton.disabled = false;
    } else {
      errorMsg("getDisplayMedia is not supported");
    }
  }

  render() {
    return (
      <div>
        <div id="container">
          <video id="gum-local" autoPlay playsInline muted></video>
          <Button id="startButton" disabled>
            화면공유
          </Button>

          <div id="errorMsg" style={{display:"none"}}></div>
        </div>
      </div>
    );
  }
}
