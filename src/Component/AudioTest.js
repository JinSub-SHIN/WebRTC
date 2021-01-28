import { Component } from "react";

export default class AudioTest extends Component {
  // 돔을 그린후에 호출하여 오디오를 실행하도록 한다.
  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError);
  }

  render() {
    return (
      <div>
        <audio id="gum-local" controls></audio>
      </div>
    );
  }
}

const constraints = (window.constraints = {
  audio: true,
  video: false,
});

function handleSuccess(stream) {
  const audio = document.querySelector("audio");
  const audioTracks = stream.getAudioTracks();
  console.log("Got stream with constraints:", constraints);
  console.log("Using audio device: " + audioTracks[0].label);
  stream.oninactive = function () {
    console.log("Stream ended");
  };
  window.stream = stream; // make variable available to browser console
  audio.srcObject = stream;
}

function handleError(error) {
  const errorMessage =
    "navigator.MediaDevices.getUserMedia error: " +
    error.message +
    " " +
    error.name;
  document.getElementById("errorMsg").innerText = errorMessage;
  console.log(errorMessage);
}
