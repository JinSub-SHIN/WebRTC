import { Component } from "react";
import { Row, Col , Button } from "antd";

export default class PeerConnection extends Component {
  // 돔 ready function
  componentDidMount() {
    // video 속성값
    const mediaStreamConstraints = {
      video: true,      
    };

    // 우선 video 만 교환하도록 설정
    const offerOptions = {
      offerToReceiveVideo: 1,
    };

    // 호출 초기시간
    let startTime = null;

    // 비디오 요소 가져오기.
    const localVideo = document.getElementById("localVideo");
    const remoteVideo = document.getElementById("remoteVideo");

    let localStream;
    let remoteStream;

    let localPeerConnection;
    let remotePeerConnection;

    localVideo.addEventListener("loadedmetadata", logVideoLoaded);
    remoteVideo.addEventListener("loadedmetadata", logVideoLoaded);
    remoteVideo.addEventListener("onresize", logResizedVideo);

    // 버튼값 가져오기
    const startButton = document.getElementById("startButton");
    const callButton = document.getElementById("callButton");
    const hangupButton = document.getElementById("hangupButton");

    // 버튼 이벤트
    callButton.disabled = true;
    hangupButton.disabled = true;

    // 버튼 이벤트
    startButton.addEventListener("click", startAction);
    callButton.addEventListener("click", callAction);
    hangupButton.addEventListener("click", hangupAction);

    // Define MediaStreams callbacks.

    // MedialStream 을 동영상 src 요소로 설정
    function gotLocalMediaStream(mediaStream) {
      localVideo.srcObject = mediaStream;
      localStream = mediaStream;
      trace("Received local stream.");
      callButton.disabled = false;
    }

    // 에러콘솔
    function handleLocalMediaStreamError(error) {
      trace(`navigator.getUserMedia error: ${error.toString()}.`);
    }

    // remoteVideo src로 설정 MediaStream 성공 처리
    function gotRemoteMediaStream(event) {
      const mediaStream = event.stream;
      remoteVideo.srcObject = mediaStream;
      remoteStream = mediaStream;
      trace("Remote peer connection received remote stream.");
    }

    // 동영상 Log ( ID / 크기 ) 값 콘솔
    function logVideoLoaded(event) {
      const video = event.target;
      trace(
        `${video.id} videoWidth: ${video.videoWidth}px, ` +
          `videoHeight: ${video.videoHeight}px.`
      );
    }

    // 스트리밍이 시작되면 이벤트 실행
    function logResizedVideo(event) {
      logVideoLoaded(event);

      if (startTime) {
        const elapsedTime = window.performance.now() - startTime;
        startTime = null;
        trace(`Setup time: ${elapsedTime.toFixed(3)}ms.`);
      }
    }

    // * 중요 * PeerConnection

    // 새로운 연결을 시도
    function handleConnection(event) {
      const peerConnection = event.target;
      const iceCandidate = event.candidate;

      if (iceCandidate) {
        const newIceCandidate = new RTCIceCandidate(iceCandidate);
        const otherPeer = getOtherPeer(peerConnection);

        otherPeer
          .addIceCandidate(newIceCandidate)
          .then(() => {
            handleConnectionSuccess(peerConnection);
          })
          .catch((error) => {
            handleConnectionFailure(peerConnection, error);
          });

        trace(
          `${getPeerName(peerConnection)} ICE candidate:\n` +
            `${event.candidate.candidate}.`
        );
      }
    }

    // 성공 콘솔
    function handleConnectionSuccess(peerConnection) {
      trace(`${getPeerName(peerConnection)} addIceCandidate 성공!.`);
    }

    // 실패 콘솔
    function handleConnectionFailure(peerConnection, error) {
      trace(
        `${getPeerName(peerConnection)} ICE Candidate 실패!:\n` +
          `${error.toString()}.`
      );
    }

    // 연결 상태에 대한 변경 사항 기록
    function handleConnectionChange(event) {
      const peerConnection = event.target;
      console.log("ICE state change event: ", event);
      trace(
        `${getPeerName(peerConnection)} ICE state: ` +
          `${peerConnection.iceConnectionState}.`
      );
    }

    // SDP 오류 콘솔
    function setSessionDescriptionError(error) {
      trace(`Failed to create session description: ${error.toString()}.`);
    }

    // SDP 성공 콘솔
    function setDescriptionSuccess(peerConnection, functionName) {
      const peerName = getPeerName(peerConnection);
      trace(`${peerName} ${functionName} 의 호출이 성공적으로 연결되었습니다.`);
    }

    // LocalDescription 성공 기록
    function setLocalDescriptionSuccess(peerConnection) {
      setDescriptionSuccess(peerConnection, "setLocalDescription");
    }

    // RemoteDescription 성공 기록
    function setRemoteDescriptionSuccess(peerConnection) {
      setDescriptionSuccess(peerConnection, "setRemoteDescription");
    }

    // 피어 연결 SessionDescription 설정
    function createdOffer(description) {
      trace("==================== localPeerConnection 정보 ==============================")
      trace(`Offer from localPeerConnection:\n${description.sdp}`);

      trace("localPeerConnection 의 setLocalDescription 호출됨...");
      localPeerConnection
        .setLocalDescription(description)
        .then(() => {
          setLocalDescriptionSuccess(localPeerConnection);
        })
        .catch(setSessionDescriptionError);

      trace("remotePeerConnection 의 setRemoteDescription 호출됨...");
      remotePeerConnection
        .setRemoteDescription(description)
        .then(() => {
          setRemoteDescriptionSuccess(remotePeerConnection);
        })
        .catch(setSessionDescriptionError);

      trace("remotePeerConnection 의 createAnswer 호출됨...");
      remotePeerConnection
        .createAnswer()
        .then(createdAnswer)
        .catch(setSessionDescriptionError);
    }

    // 응답 기록 ( 피어 연결 SessionDescription 설정 )
    function createdAnswer(description) {
      trace(`Answer from remotePeerConnection:\n${description.sdp}.`);

      trace("remotePeerConnection 의 setLocalDescription 호출됨...");
      remotePeerConnection
        .setLocalDescription(description)
        .then(() => {
          setLocalDescriptionSuccess(remotePeerConnection);
        })
        .catch(setSessionDescriptionError);

      trace("localPeerConnection 의 setRemoteDescription 호출됨...");
      localPeerConnection
        .setRemoteDescription(description)
        .then(() => {
          setRemoteDescriptionSuccess(localPeerConnection);
        })
        .catch(setSessionDescriptionError);
    }

    // 시작
    function startAction() {
      startButton.disabled = true;
      navigator.mediaDevices
        .getUserMedia(mediaStreamConstraints)
        .then(gotLocalMediaStream)
        .catch(handleLocalMediaStreamError);
      trace(" 스트림 Start !");
    }

    // PeecConnection Start
    function callAction() {
      callButton.disabled = true;
      hangupButton.disabled = false;

      trace(" Call 시작...");
      startTime = window.performance.now();

      // Get local media stream tracks.
      const videoTracks = localStream.getVideoTracks();
      const audioTracks = localStream.getAudioTracks();
      if (videoTracks.length > 0) {
        trace(`Using video device: ${videoTracks[0].label}.`);
      }
      if (audioTracks.length > 0) {
        trace(`Using audio device: ${audioTracks[0].label}.`);
      }

      const servers = null; // Allows for RTC server configuration.

      // 피어 연결 생성 및 동작 추가
      localPeerConnection = new RTCPeerConnection(servers);
      // trace("Created local peer connection object localPeerConnection.");
      trace("localPeer 피어연결 생성됨...")

      localPeerConnection.addEventListener("icecandidate", handleConnection);
      localPeerConnection.addEventListener(
        "iceconnectionstatechange",
        handleConnectionChange
      );

      remotePeerConnection = new RTCPeerConnection(servers);
      // trace("Created remote peer connection object remotePeerConnection.");
      trace("RemotePeer 연결 생성됨...")

      remotePeerConnection.addEventListener("icecandidate", handleConnection);
      remotePeerConnection.addEventListener(
        "iceconnectionstatechange",
        handleConnectionChange
      );
      remotePeerConnection.addEventListener("addstream", gotRemoteMediaStream);

      // Add local stream to connection and create offer to connect.
      localPeerConnection.addStream(localStream);
      // trace("Added local stream to localPeerConnection.");
      trace("localStream 을 localPeerConnection 에 추가...")

      trace("localPeerConnection 의 createOffer 함수 호출됨...");
      localPeerConnection
        .createOffer(offerOptions)
        .then(createdOffer)
        .catch(setSessionDescriptionError);
    }

    // 종료
    function hangupAction() {
      localPeerConnection.close();
      remotePeerConnection.close();
      localPeerConnection = null;
      remotePeerConnection = null;
      hangupButton.disabled = true;
      callButton.disabled = false;
      trace(" 연결 종료...");
    }

    // Gets the "other" peer connection.
    function getOtherPeer(peerConnection) {
      return peerConnection === localPeerConnection
        ? remotePeerConnection
        : localPeerConnection;
    }

    // Gets the name of a certain peer connection.
    function getPeerName(peerConnection) {
      return peerConnection === localPeerConnection
        ? "localPeerConnection"
        : "remotePeerConnection";
    }

    // 발생 시간과 콘솔찍는 함수
    function trace(text) {
      text = text.trim();
      const now = (window.performance.now() / 1000).toFixed(3);

      console.log(now, text);
    }
  }

  render() {
    return (
      <>
        <Row>
          <Col span={11} style={{marginRight:20}}>
            <video id="localVideo" autoPlay playsInline></video>
          </Col>
          <Col span={11}>
            <video id="remoteVideo" autoPlay playsInline></video>
          </Col>
        </Row>

        <div>
          <Button type="primary" id="startButton" style={{marginRight:10}}>Start</Button>
          <Button type="primary" id="callButton" style={{marginRight:10}}>Call</Button>
          <Button type="primary" id="hangupButton" danger>Hang Up</Button>
        </div>
      </>
    );
  }
}
