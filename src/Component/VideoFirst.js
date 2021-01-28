import { Component } from "react";
import { Button, message } from 'antd';

export default class VideoFirst extends Component {
  componentDidMount() {
    document
      .getElementById("showVideo")
      .addEventListener("click", (e) => init(e));
  }

  SnapShot = () => {
    const video = document.getElementById("gum-local");
    const canvas = (window.canvas = document.querySelector("canvas"));
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.className = this.props.value;
  };

  render() {
    return (
      <>
      <div class="select">
        <label for="videoSource">Video source: </label><select id="videoSource"></select>
    </div>
      <div>
        {/* React 에서는 jsx 문법을 사용하므로 autoplay -> autoPlay , playsinline -> playsInline */}
        {/* 또한 한번 오픈한 태그는 반드시 닫아주어야 하며, 두개 이상의 부모 태그가 열릴 경우 반드시 최상의 부모가 존재하여야 한다. ( 최상단 <> 태그 ) */}
        <video id="gum-local" autoPlay playsInline></video>
        <Button id="showVideo">테스트</Button>
        {/* <Button
          style={{ marginLeft: "10px" }}
          onClick={this.SnapShot}
          id="snapShot"
        >
          Take snapshot
        </Button> */}
      </div>
      </>
    );
  }
}

const constraints = (window.constraints = {
  audio: false,
  video: true,
});

function handleSuccess(stream) {
  const video = document.querySelector("video");
  const videoTracks = stream.getVideoTracks();
  console.log("Got stream with constraints:", constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;

  message.success("카메라가 정상적으로 설정되었습니다!");

}

function handleError(error) {
  if (error.name === "ConstraintNotSatisfiedError") {
    const v = constraints.video;
    errorMsg(
      `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`
    );
  } else if (error.name === "PermissionDeniedError") {
    errorMsg(
      "Permissions have not been granted to use your camera and " +
        "microphone, you need to allow the page access to your devices in " +
        "order for the demo to work."
    );
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);

  message.error("카메라 설정에서 오류가 발생하였습니다");

}

function errorMsg(msg, error) {
  const errorElement = document.querySelector("#errorMsg");
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== "undefined") {
    console.error(error);
  }
}

async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    e.target.disabled = true;
  } catch (e) {
    handleError(e);
  }
}
