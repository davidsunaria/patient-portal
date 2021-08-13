import React, { useState, useEffect } from "react";
import { useStoreActions } from "easy-peasy";
import { Link, useHistory, useLocation } from "react-router-dom";
import Input from "patient-portal-components/Input/Input.js";
import { ToastContainer, toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";

import { TITLE_ERROR_MESSAGE } from "patient-portal-message";

// Meter className that generates a number correlated to audio volume.
// The meter className itself displays nothing, but it makes the
// instantaneous and time-decaying volumes available for inspection.
// It also reports on the fraction of samples that were at or near
// the top of the measurement range.

//let mediaRecorder = null;
const FPS = 60;
const ROI_X = 0;
const ROI_Y = 0;
const ROI_WIDTH = 480; // Max resolution.
const ROI_HEIGHT = 640;

let cameraStream = null;
let processingStream = null;
let mediaRecorder = null;
let processingPreviewIntervalId = null;
let shareableLink = "";
let audioStream = null;

const QuestionDetail = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [showSubmenu, setShowSubMenu] = useState(false);
  const [hideLeftSection, setHideLeftSection] = useState(false);
  const [menu, setMenu] = useState("");
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recorderObj, setRecorderObj] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [mediaRecorderMain, setMediaRecorder] = useState(null);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const [questionType, setQuestionType] = useState("TEXT");
  const [answerType, setAnswerType] = useState("yesno");
  const [questionData, setQuestionData] = useState("");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionTitleError, setQuestionTitleError] = useState(false);
  const [cameraView, setCameraView] = useState(false);
  const [mediaRecorded, setMediaRecorded] = useState(false);
  const [srcObject, setSrcObject] = useState("");
  const [singleOptions, setSingleOptions] = useState([{ id: 1, value: "" }]);
  const [multipleOptions, setMultipleOptions] = useState([
    { id: 1, value: "" },
  ]);

  useEffect(() => {
    if (props.question._id) {
      setQuestionType(props.question.type);
      if (props.question.type == "AUDIO" || props.question.type == "VIDEO") {
        setMediaRecorded(true);
      }
      setQuestionData(
        props.question.type == "AUDIO"
          ? props.question.audioURL
          : props.question.videoURL
      );
      if (props.question.responseType == "single") {
        setSingleOptions(JSON.parse(props.question.responseOptions));
      }

      if (props.question.responseType == "multiple") {
        setMultipleOptions(JSON.parse(props.question.responseOptions));
      }
      setQuestionTitle(props.question.text);
      setAnswerType(props.question.responseType);
    } else {
      setQuestionData("");
      setQuestionTitle("");
      setQuestionType("TEXT");
    }
  }, [props.question]);

  useEffect(() => {
    if (questionData) {
      if (questionType == "AUDIO" && mediaRecorded) {
        let recordingAudioPreview = document.getElementById("audio-player");
        recordingAudioPreview.load();
        //recordingAudioPreview.play();
      } else if (questionType == "VIDEO" && mediaRecorded) {
        let recordingVideoPreview = document.getElementById("recordingPreview");
        recordingVideoPreview.load();
      }
    }
  }, [questionData]);

  useEffect(() => {
    if (questionType === "VIDEO") {
      showCameraView();
    }
  }, [questionType]);

  const selectQuestionType = (e) => {};

  /*const processFrame = () => {
    let cameraPreview = document.getElementById("cameraPreview");

    var processingPreview = document.getElementById("processingPreview");

    if (processingPreview) {
      processingPreview
        .getContext("2d")
        .drawImage(cameraPreview, ROI_X, ROI_Y, ROI_WIDTH, ROI_HEIGHT);
    }
    processingPreviewIntervalId = window.requestAnimationFrame(processFrame);
  };*/

  const handleAnswerChange = (e) => {
    let val = e.target.value;
    if (val == "yesno" || val == "patient-response") {
      //setSingleOptions([{ id: 1, value: "" }]);
      setMultipleOptions([{ id: 1, value: "" }]);
    }
    setAnswerType(val);
  };

  const handleSingleOptions = (e, index) => {
    let val = e.target.value;
    /*if (val == "" || val.trim() == "") {
      return false;
    }*/

    let options = JSON.parse(JSON.stringify(singleOptions));
    options[index].value = val;
    setSingleOptions(options);
  };

  const removeSingleOption = (index) => {
    let options = JSON.parse(JSON.stringify(singleOptions));
    options.splice(index, 1);
    setSingleOptions(options);
  };

  const addSingleOption = () => {
    let options = JSON.parse(JSON.stringify(singleOptions));
    options.push({ id: options.length + 1, value: "" });
    setSingleOptions(options);
  };

  const handleMultipleOptions = (e, index) => {
    let val = e.target.value;
    /*if (val == "" || val.trim() == "") {
      return false;
    }*/

    let options = JSON.parse(JSON.stringify(multipleOptions));
    options[index].value = val;
    setMultipleOptions(options);
  };

  const removeMultipleOption = (index) => {
    let options = JSON.parse(JSON.stringify(multipleOptions));
    options.splice(index, 1);
    setMultipleOptions(options);
  };

  const addMultipleOption = () => {
    let options = JSON.parse(JSON.stringify(multipleOptions));
    options.push({ id: options.length + 1, value: "" });
    setMultipleOptions(options);
  };

  const showCameraView = () => {
    setCameraView(true);
    const constraints = {
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 },
        facingMode: { ideal: "environment" },
        aspectRatio: { exact: 1.3333333 },
      },
      audio: true,
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      if (stream.getVideoTracks().length > 0) {
        let cameraPreview = document.getElementById("cameraPreview");
        //setQuestionData(stream);
        if (cameraPreview) {
          cameraPreview.srcObject = stream;
          cameraPreview.style.zIndex = 2;
        }
      }
    });
  };
  const recordMedia = (mediaType) => {
    let constraints = {
      video: mediaType == "VIDEO" ? true : false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (mediaType == "AUDIO") {
          if (stream.getAudioTracks().length > 0) {
            const options = { mimeType: "audio/webm" };
            //const recordedChunksTmp = recordedChunks;

            let mediaRecorder = new MediaRecorder(stream, options);
            let mc = [];
            mediaRecorder.addEventListener("dataavailable", function (e) {
              if (e.data.size > 0) {
                //mc = recordedChunksTmp;
                mc.push(e.data);
                setRecordedChunks(mc);
              }
            });

            mediaRecorder.addEventListener("stop", function () {
              let recordingAudioPreview = document.getElementById(
                "audio-player"
              );
              let recordingAudioPreviewSrc = document.getElementById(
                "audio-player-src"
              );
              recordingAudioPreview.muted = false;
              recordingAudioPreview.pause();
              recordingAudioPreview.removeAttribute("src"); // empty source
              recordingAudioPreviewSrc.src = URL.createObjectURL(new Blob(mc));
              recordingAudioPreview.load();
              recordingAudioPreview.play();
            });

            mediaRecorder.start();
            setMediaRecorder(mediaRecorder);
          }
        } else {
          const constraints = {
            video: {
              width: { ideal: 4096 },
              height: { ideal: 2160 },
              facingMode: { ideal: "environment" },
              aspectRatio: { exact: 1.3333333 },
            },
            audio: true,
          };

          if (stream.getVideoTracks().length > 0) {
            let cameraStream = stream;
            /*var processingPreview = document.getElementById(
              "processingPreview"
            );

            processingStream = processingPreview.captureStream(FPS);
            processingStream.addTrack(cameraStream.getAudioTracks()[0]);*/

            try {
              window.AudioContext =
                window.AudioContext || window.webkitAudioContext;
              window.audioContext = new AudioContext();
            } catch (e) {
              console.log("Web Audio API not supported.");
            }

            /*var soundMeter = (window.soundMeter = new SoundMeter(
              window.audioContext
            ));
            soundMeter.connectToSource(cameraStream, function (e) {
              if (e) {
                console.log(e);
                return;
              } else {
              }
            });*/

            if (typeof MediaRecorder.isTypeSupported == "function") {
              if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
                var options = { mimeType: "video/webm;codecs=vp9" };
              } else if (
                MediaRecorder.isTypeSupported("video/webm;codecs=h264")
              ) {
                var options = { mimeType: "video/webm;codecs=h264" };
              } else if (MediaRecorder.isTypeSupported("video/webm")) {
                var options = { mimeType: "video/webm" };
              } else if (MediaRecorder.isTypeSupported("video/mp4")) {
                //Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default
                var options = { mimeType: "video/mp4" };
              }
              console.log("Using " + options.mimeType, processingStream);
              mediaRecorder = new MediaRecorder(stream, options);
            } else {
              console.log("Using ", processingStream);
              mediaRecorder = new MediaRecorder(stream);
            }

            let tmpChunks = recordedChunks;
            let mc = [];
            mediaRecorder.ondataavailable = function (event) {
              mc = tmpChunks;
              mc.push(event.data);
              setRecordedChunks(mc);
            };

            mediaRecorder.addEventListener("stop", function () {
              /*let recordingVideoPreviewSrc = document.getElementById(
                "audio-player-src"
              );*/
              let recordingPreview = document.getElementById(
                "recordingPreview"
              );
              let recordingPreviewSrc = document.getElementById(
                "recordingPreviewSrc"
              );
              if (recordingPreview) {
                recordingPreview.style.zIndex = 1;
              }
              recordingPreview.muted = false;
              recordingPreview.pause();
              recordingPreview.removeAttribute("src"); // empty source
              recordingPreviewSrc.src = URL.createObjectURL(new Blob(mc));
              recordingPreview.load();
              recordingPreview.play();
            });

            mediaRecorder.start();
            setMediaRecorder(mediaRecorder);
            //processFrame();
          }
        }
      })
      .catch((err) => {
        alert("No media device found!" + err);
      });
  };

  /* const recordAudio = () =>
    new Promise(async (resolve) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      const start = () => mediaRecorder.start();

      const stop = () =>
        new Promise((resolve) => {
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            localStorage.setItem("audioUrl", audioUrl);
            const actionPlayer = document
              .getElementById("audio-player")
              .setAttribute("src", audioUrl);
            setQuestionData(audioUrl);
            const audio = new Audio(audioUrl);
            const play = () => audio.play();
            resolve({ audioBlob, audioUrl, play });
          });

          mediaRecorder.stop();
        });

      resolve({ start, stop });
    });*/

  const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

  const startRecording = async () => {
    recordMedia(questionType);
    /*setRecorderObj(recorder);
     */
    setRecordingStarted(true);
    const actionButton = document.getElementById("action");
    //actionButton.disabled = true;
    //recorder.start();
    //actionButton.disabled = false;
  };

  const stopRecording = () => {
    if (mediaRecorderMain != null) {
      if (mediaRecorderMain.state == "recording") {
        mediaRecorderMain.stop();
      }
    }
    setMediaRecorder(mediaRecorderMain);
    setRecordingStarted(false);
    setMediaRecorded(true);
  };

  const saveQuestion = async () => {
    setQuestionTitleError(false);

    if (questionTitle == "" || questionTitle.trim() == "") {
      setQuestionTitleError(true);
      return false;
    }

    let mediaBlob = new Blob(recordedChunks, {
      type: questionType == "AUDIO" ? "audio/mp3" : "video/webm",
    });
    var data = new FormData();
    data.append("video", mediaBlob);
    data.append("responseType", answerType);

    if (answerType == "single") {
      let options = singleOptions.filter((obj) => obj.value != "");
      if (options.length == 0) {
        toast.error(
          <ToastUI message={"Add atleast one option!"} type={"Error"} />
        );
        return false;
      }
      data.append("responseOptions", JSON.stringify(options));
    }
    if (answerType == "multiple") {
      let options = multipleOptions.filter((obj) => obj.value != "");
      if (options.length == 0) {
        toast.error(
          <ToastUI message={"Add atleast one option!"} type={"Error"} />
        );
        return false;
      }
      data.append("responseOptions", JSON.stringify(options));
    }

    data.append("text", questionTitle);
    data.append("type", questionType);
    data.append("questionnaireId", props.questionnaireId);
    if (props.question && props.question._id) {
      data.append("id", props.question._id);
      data.append("order", props.question.order);
      data.append(
        "mediaURL",
        props.question.type == "AUDIO"
          ? props.question.audioURL
          : props.question.videoURL
      );
    } else {
      data.append("order", parseInt(props.totalQuestions) + 1);
    }

    await props.saveQuestion(data);
    setQuestionData("");
    setQuestionTitle("");
    setQuestionType("TEXT");
  };

  console.log(singleOptions);

  return (
    <React.Fragment>
      <div className="editorOuter">
        <Input
          label={"Question Title"}
          type={"text"}
          value={questionTitle}
          handleInputChange={(e) => setQuestionTitle(e.target.value)}
          error={questionTitleError}
          placeholder={"Add question title"}
          errorMessage={TITLE_ERROR_MESSAGE}
        />
        <div className="form-group text-left">
          <label htmlFor="exampleFormControlSelect1">Question</label>
          <select
            onChange={(e) => setQuestionType(e.target.value)}
            value={questionType}
          >
            <option value="VIDEO">Record Video</option>
            <option value="AUDIO">Record Audio</option>
            <option value="TEXT">Record Only Text</option>
          </select>
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleFormControlSelect1">Type of Answer</label>
          <select onChange={(e) => handleAnswerChange(e)} value={answerType}>
            <option value="yesno">Yes/No</option>
            <option value="single">Single Choice</option>
            <option value="multiple">Multiple Choice</option>
            <option value="patient-response">Patient’s Open Response</option>
          </select>
        </div>
        {answerType == "single" && (
          <div className="form-group text-left">
            <label htmlFor="exampleInputEmail1">Add Options</label>
            {singleOptions.map((obj, idx) => {
              return (
                <>
                  <input
                    type="text"
                    className="options-input"
                    placeholder="Add option"
                    onChange={(e) => handleSingleOptions(e, idx)}
                    value={obj.value}
                  />
                  {idx < singleOptions.length - 1 && (
                    <a
                      className="edit"
                      title="Edit"
                      onClick={() => removeSingleOption(idx)}
                    >
                      <i className="fa fa-minus" />
                    </a>
                  )}
                  {idx == singleOptions.length - 1 && (
                    <a
                      className="edit"
                      title="Edit"
                      onClick={() => addSingleOption(idx)}
                    >
                      <i className="fa fa-plus" />
                    </a>
                  )}
                </>
              );
            })}
          </div>
        )}
        {answerType == "multiple" && (
          <div className="form-group text-left">
            <label htmlFor="exampleInputEmail1">Add Options</label>
            {multipleOptions.map((obj, idx) => {
              return (
                <>
                  <input
                    type="text"
                    className="options-input"
                    placeholder="Add option"
                    onChange={(e) => handleMultipleOptions(e, idx)}
                    value={obj.value}
                  />
                  {idx < multipleOptions.length - 1 && (
                    <a
                      className="edit"
                      title="Edit"
                      onClick={() => removeMultipleOption(idx)}
                    >
                      <i className="fa fa-minus" />
                    </a>
                  )}
                  {idx == multipleOptions.length - 1 && (
                    <a
                      className="edit"
                      title="Edit"
                      onClick={() => addMultipleOption(idx)}
                    >
                      <i className="fa fa-plus" />
                    </a>
                  )}
                </>
              );
            })}
          </div>
        )}
        {(questionType == "AUDIO" || questionType == "VIDEO") && (
          <React.Fragment>
            <div className="recordingOuter">
              <button
                id="action"
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  recordingStarted ? stopRecording() : startRecording()
                }
              >
                {recordingStarted ? "Stop Recording" : "Record " + questionType}{" "}
              </button>
              {recordingStarted ? <button className="Rec"></button> : ""}
            </div>
            {mediaRecorded && questionType == "AUDIO" && (
              <audio id="audio-player" controls="controls">
                <source
                  id="audio-player-src"
                  type="audio/mp3"
                  src={questionData}
                />
              </audio>
            )}
            {questionType == "VIDEO" && (
              <>
                {mediaRecorded && (
                  <video id="recordingPreview" controls>
                    <source
                      src={questionData}
                      id="recordingPreviewSrc"
                      type="video/webm"
                    />
                  </video>
                )}
                {cameraView && (
                  <video
                    id="cameraPreview"
                    autoPlay
                    src={questionData}
                    muted
                  ></video>
                )}
              </>
            )}
          </React.Fragment>
        )}
        <div className="text-center mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => saveQuestion()}
          >
            Submit
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default QuestionDetail;
