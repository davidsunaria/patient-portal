import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";

import Input from "patient-portal-components/Input/Input.js";
import Button from "patient-portal-components/Button/Button.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Header from "patient-portal-components/Header/Header.js";
import Question from "patient-portal-components/Question/Question.js";
import Overlay from "patient-portal-components/Overlay/Overlay.js";

import QuestionDetail from "patient-portal-components/Question/QuestionDetail.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import {} from "patient-portal-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = (props) => {
  const history = useHistory();
  const newQuestion = { type: "text", title: "", data: "" };
  const newQuestionSet = { questions: [], title: "" };
  //const doctorId = "6066e312916fabaeea59fcbd";

  const [allQuestions, setAllQuestions] = useState([]);
  const [allQuestionSets, setAllQuestionSets] = useState([]);
  const [showQuestionnaireInput, setShowQuestionnaireInput] = useState(false);
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [qMode, setQMode] = useState(null);
  const [intakeURL, setIntakeURL] = useState(null);
  const [tokenGenerated, setTokenGenerated] = useState(false);
  const [openCopyDropdown, setOpenCopyDropdown] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState(null);
  const [editQuestion, setEditQuestion] = useState(0);
  const [mode, setMode] = useState("add");
  const [loaderText, setLoaderText] = useState("Loading");
  const [showLoader, setShowLoader] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const loggedInUser = useStoreState((state) => state.doctor.loggedInUser);
  const questions = useStoreState((state) => state.doctor.questions);
  const questionnaires = useStoreState(
    (state) => state.doctor.allQuestionnaires
  );
  const createQuestionnaire = useStoreActions(
    (actions) => actions.doctor.createQuestionnaire
  );
  const updateQuestionnaire = useStoreActions(
    (actions) => actions.doctor.updateQuestionnaire
  );
  const setQuestionnaires = useStoreActions(
    (actions) => actions.doctor.setQuestionnaires
  );
  const getQuestionnaires = useStoreActions(
    (actions) => actions.doctor.getQuestionnaires
  );
  const createQuestion = useStoreActions(
    (actions) => actions.doctor.createQuestion
  );
  const getQuestionsByQuestionnaireId = useStoreActions(
    (actions) => actions.doctor.getQuestionsByQuestionnaireId
  );
  const deleteQuestionById = useStoreActions(
    (actions) => actions.doctor.deleteQuestionById
  );
  const updateQuestion = useStoreActions(
    (actions) => actions.doctor.updateQuestion
  );
  const updateQuestionsOrder = useStoreActions(
    (actions) => actions.doctor.updateQuestionsOrder
  );
  const deleteQuestionnaire = useStoreActions(
    (actions) => actions.doctor.deleteQuestionnaire
  );
  const generateIntake = useStoreActions(
    (actions) => actions.doctor.generateIntake
  );

  useEffect(async () => {
    let id = loggedInUser ? loggedInUser._id : localStorage.getItem("doctorId");

    setDoctorId(id);

    if (!questionnaires || questionnaires.length == 0) {
      setShowLoader(true);
      setLoaderText("Loading doctor's data");
      getQuestionnaires({ doctorId: id });
    }
  }, []);

  useEffect(async () => {
    if (questionnaires) {
      hideLoader();
      setAllQuestionSets(questionnaires);
    }
  }, [questionnaires]);

  useEffect(async () => {
    if (allQuestionSets && allQuestionSets.length) {
      let qSet = allQuestionSets[0];
      if (qMode == null && selectedQuestionSet) {
        qSet = selectedQuestionSet;
      } else if (qMode == "add") {
        qSet = allQuestionSets[allQuestionSets.length - 1];
      } else if (qMode == "delete") {
        qSet = allQuestionSets[0];
      } else if (qMode == null && selectedQuestionSet == null) {
        qSet = allQuestionSets[0];
      }
      setSelectedQuestionSet(qSet);
      startLoader("Fetching Question");
      setIntakeURL(null);
      setTokenGenerated(false);
      await getQuestionsByQuestionnaireId({ questionnaireId: qSet.id });
      hideLoader();
    } else {
      setSelectedQuestionSet(null);
    }
  }, [allQuestionSets]);

  useEffect(() => {
    if (questions) {
      setAllQuestions(questions);
      setSelectedQuestion(null);
    }
    hideLoader();
  }, [questions]);

  const addNewQuestion = () => {
    setMode("add");
    setSelectedQuestion(newQuestion);
  };

  const hideLoader = () => {
    setShowLoader(false);
    setLoaderText("");
  };

  const startLoader = (txt) => {
    setShowLoader(true);
    setLoaderText(txt);
  };

  const saveQuestion = async (question) => {
    if (mode == "add") {
      startLoader("Saving question");
      await createQuestion(question);
      hideLoader();
    } else {
      startLoader("Updating question");
      await updateQuestion(question);
      hideLoader();
    }
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 2,
    margin: `0 0 4px 0`,

    // change background colour if dragging
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = async (result) => {
    // dropped outside the list

    if (!result.destination) {
      return;
    }

    const items = reorder(
      allQuestions,
      result.source.index,
      result.destination.index
    );
    let updatedOrder = [];
    await items.map((obj, idx) => {
      updatedOrder.push({ id: obj._id, order: idx + 1 });
    });
    startLoader("Updating questions order");
    setAllQuestions(items);
    await updateQuestionsOrder({
      questions: updatedOrder,
      questionnaireId: selectedQuestionSet._id,
    });
    hideLoader();
  };

  const getListStyle = (isDraggingOver) => ({});

  const selectQuestionSet = async (id) => {
    let selectedQset = allQuestionSets.find((e) => e._id == id);
    setSelectedQuestionSet(selectedQset);
    startLoader("Fetching questions");
    await getQuestionsByQuestionnaireId({ questionnaireId: id });
    setIntakeURL(null);
    setTokenGenerated(false);
    hideLoader();
    //setAllQuestions(selectedQset.questions);
  };

  const selectQuestion = (id) => {
    let selectedQ = allQuestions.find((e) => e._id == id);
    setSelectedQuestion(selectedQ);
    setMode("edit");
  };

  const deleteQuestion = async (id) => {
    startLoader("Deleting question");
    await deleteQuestionById({
      qId: id,
      questionnaireId: selectedQuestionSet._id,
    });
    hideLoader();
  };

  const createQuestionSet = async () => {
    let qSets = JSON.parse(JSON.stringify(allQuestionSets));
    let newSet = JSON.parse(JSON.stringify(newQuestionSet));
    setQMode("add");
    let newTitle = "Intake Question Set " + parseInt(qSets.length);

    if (allQuestionSets.find((e) => e.title == newTitle)) {
      newSet.title = newTitle + Math.floor(Math.random() * 6) + 1;
    } else {
      newSet.title = newTitle;
    }

    newSet.doctorId = doctorId;
    startLoader("Creating Questionnaire");
    await createQuestionnaire(newSet);
    hideLoader();
  };

  const editQuestionnaireTitle = (id) => {
    setQuestionnaireTitle(selectedQuestionSet.title);
    setShowQuestionnaireInput(true);
  };

  const saveQuestionnaireTitle = async (id) => {
    startLoader("Updating questionnaire");
    setQMode(null);
    await updateQuestionnaire({
      title: questionnaireTitle,
      id: selectedQuestionSet._id,
      doctorId: doctorId,
    });
    hideLoader();
    setShowQuestionnaireInput(false);
  };

  const deleteHandler = (id) => {
    setShowDelete(true);
  };

  const deleteFormCall = async () => {
    startLoader("Deleting questionnaire");
    setQMode("delete");
    let response = await deleteQuestionnaire({
      questionnaireId: selectedQuestionSet._id,
      doctorId: doctorId,
    });
    //await setQuestionnaires(response);
    hideLoader();
    setDisableButton(false);
    setShowDelete(false);
  };

  const generateIntakeURL = async () => {
    startLoader("Generating intake URL");
    let intake = await generateIntake({
      questionnaireId: selectedQuestionSet._id,
      doctorId: doctorId,
      patientId: "608c0037e1eff81273fdfb32",
    });
    setIntakeURL(intake);
    setTokenGenerated(true);
    hideLoader();
  };

  const copyURL = async (domain) => {
    await navigator.clipboard.writeText(domain + intakeURL);
    setOpenCopyDropdown(false);
    toast.success(
      <ToastUI message={"URL copied to clipboard!"} type={"Success"} />
    );
  };

  return (
    <React.Fragment>
      <Sidebar
        activeMenu={"questionnaires"}
        questionSets={allQuestionSets}
        selectQuestionSet={(id) => selectQuestionSet(id)}
        selectedQuestionSet={selectedQuestionSet}
        createQuestionSet={() => createQuestionSet()}
      />
      <Header />
      {selectedQuestionSet != null && (
        <React.Fragment>
          {showQuestionnaireInput ? (
            <>
              <div className="title-input-container">
                <input
                  className={"title"}
                  type="text"
                  placeholder="Type Questionnaire Title"
                  onChange={(e) => setQuestionnaireTitle(e.target.value)}
                  value={questionnaireTitle}
                />
                <a
                  className="edit"
                  onClick={() =>
                    saveQuestionnaireTitle(selectedQuestionSet._id)
                  }
                >
                  <i className="fa fa-floppy-o" />
                  Save
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="title">
                <div className="float-left">
                  {selectedQuestionSet.title}
                  <a
                    className="edit ml-2"
                    onClick={() =>
                      editQuestionnaireTitle(selectedQuestionSet._id)
                    }
                  >
                    <i className="fa fa-pencil" />
                  </a>
                  <a className="edit ml-2" onClick={() => deleteHandler()}>
                    <i className="fa fa-trash" />
                  </a>
                </div>
                {!tokenGenerated ? (
                  <div className="generateIntake">
                    <div className="patientEmail mr-sm-2">
                      <input type="text" name placeholder="Patients Email" />
                      <i className="fa fa-envelope" />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => generateIntakeURL()}
                    >
                      Generate Intake URL
                    </button>
                  </div>
                ) : (
                  <div className="generateIntake">
                  <div className="dropdown generate-dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" onClick={() => setOpenCopyDropdown(true)}>
                      Copy Link
                      <i className="fa fa-chain ml-2" />
                    </button>
                    {openCopyDropdown && 

                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" onClick={() => copyURL('https://realtime.telepsy.ai/')} >Realtime.telepsy</a>
                        <a className="dropdown-item" onClick={() => copyURL('https://test.telepsy.ai/')}>Test.telepsy</a>
                      </div>
                    }
                  </div>

                    <button
                      type="button"
                      className="btn btn-primary ml-2"
                      onClick={() => setTokenGenerated(false)}
                    >
                      Generate New URL
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
          <div className="sectionOuter">
            <section className="leftSection">
              <div className="previewContainer">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                      >
                        {allQuestions.map((item, index) => (
                          <Draggable
                            key={item._id}
                            draggableId={item._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <Question
                                  questionData={item}
                                  selectQuestion={(id) => selectQuestion(id)}
                                  deleteQuestion={(id) => deleteQuestion(id)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                {/*{allQuestions.map((obj, idx) => {
                  return (
                    <Question
                      questionData={obj}
                      selectQuestion={() => selectQuestion(idx)}
                    />
                  );
                })}*/}
              </div>
              <div className="leftFooter text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => addNewQuestion()}
                >
                  Add Question
                </button>
              </div>
            </section>
            <section className="rightSection">
              {selectedQuestion != null && (
                <QuestionDetail
                  question={selectedQuestion}
                  saveQuestion={(q) => saveQuestion(q)}
                  mode={mode}
                  questionnaireId={selectedQuestionSet._id}
                  totalQuestions={allQuestions.length}
                />
              )}
            </section>
          </div>
        </React.Fragment>
      )}
      {showLoader && (
        <div className="loaderOuter">
          <div className="loaderOuter">
            <div className="loader">
              <div className="spinner-border text-primary" role="status"></div>
              <p>{loaderText} ...</p>
            </div>
          </div>
        </div>
      )}
      {showDelete && (
        <Overlay
          title={"Are you sure?"}
          subTitle={"Are you sure you want to delete this questionnaire?"}
          closeOverlay={() => setShowDelete(false)}
          cancelOverlay={() => setShowDelete(false)}
          submitOverlay={() => deleteFormCall()}
          disableBtn={disableButton}
          isDelete={true}
        ></Overlay>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default Home;
