import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header";
import Divider from "patient-portal-components/Divider/Divider";
import Sidebar from "patient-portal-components/Sidebar/Sidebar";
import { useStoreActions, useStoreState } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import _, { forEach } from "lodash";
import { getLoggedinUserId } from "patient-portal-utils/Service";
import { FILE_SELECT, FILE_UNSELECT } from "patient-portal-message";
import { FIELD_REQUIRED } from "patient-portal-message";

const Questionnaire = () => {
  const { id, type } = useParams();
  const history = useHistory();
  const [selectedScale, setSelectedScale] = useState(0);
  const [file, setFile] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [patientQuestionnaireId, setPatientQuestionnaireId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [questions, setQuestions] = useState([]);

  const getAppointmentQuestionnaireDetail = useStoreActions((actions) => actions.appointment.getAppointmentQuestionnaireDetail);
  const getQuestionnaireDetail = useStoreActions((actions) => actions.appointment.getQuestionnaireDetail);
  const saveQuestionnaire = useStoreActions((actions) => actions.appointment.saveQuestionnaire);
  const saveAppointmentQuestionnaire = useStoreActions((actions) => actions.appointment.saveAppointmentQuestionnaire);

  const uploadFile = useStoreActions((actions) => actions.appointment.uploadFile);
  const response = useStoreState((state) => state.appointment.response);
  const isQuestionnaireSubmitted = useStoreState((state) => state.appointment.isQuestionnaireSubmitted);


  useEffect(() => {
    if (isQuestionnaireSubmitted) {
      history.push("/dashboard");
    }
  }, [isQuestionnaireSubmitted]);

  useEffect(async () => {
    if (id && type == "questionnaire") {
      await getQuestionnaireDetail(id);
    }
    if (id && type == "appointment-questionnaire") {
      await getAppointmentQuestionnaireDetail(id);
    }
  }, [id, type]);
  const formatOptions = (qoptions, answer) => {
    _.forOwn(qoptions, (value, index) => {
      qoptions[index]['checked'] = false;
      forEach(answer, (v, k) => {
        if (v == value.id) {
          qoptions[index]['checked'] = true;
        }
      })
    });
    return qoptions;
  }
  const formatOpinionOptions = (qoptions, answer) => {
    let returnVal;
    _.forOwn(qoptions, (value, index) => {
      if (value.id == answer) {
        returnVal = parseInt(value.question_option);
      }
    });
    return returnVal;
  }
  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {

        if (data?.details?.id) {
          setCanEdit(false);
          //setCanEdit(data?.details?.can_edit);
          setPatientQuestionnaireId(data?.details?.id);
        }
        if (data?.details?.questionnaire?.questions) {
          let json = data?.details?.questionnaire?.questions;

          _.forOwn(json, (value, index) => {
            if (value.question_type == "Multiple Choice") {
              json[index]['qoptions'] = formatOptions(value.qoptions, value.answer);
            }
            if (value.question_type == "Opinion Scale") {
              setSelectedScale(formatOpinionOptions(value.qoptions, value.answer));
            }
            json[index]['error'] = (!value.answer && value.required == 1) ? true : false;
          });


          setQuestions(json);
        }
        if (data?.file_name) {
          setFile(data?.file_name);
        }
      }
    }
  }, [response]);
  const handleInputChange = (e, index, type) => {
    let val = [...questions];
    if (type == "text") {
      val[index]['answer'] = e.target.value;
      val[index]['error'] = (e.target.value) ? false : true;
    }

    if (type == "yesno") {
      val[index]['answer'] = e.target.value === 'Yes' ? 'Yes' : 'No';
      val[index]['error'] = (e.target.value) ? false : true;
    }
    if (type == "single") {
      val[index]['answer'] = e.target.value;
      val[index]['error'] = (e.target.value) ? false : true;
    }
    setQuestions(val);
  }
  const handleChange = (e, index, type, innerIndex) => {
    let val = [...questions];
    if (e.target.checked) {
      val[index]['answer'].push(e.target.value);
      val[index]['error'] = false;
    }
    else {
      let elmentIndex = val[index]["answer"].indexOf(e.target.value);
      val[index]["answer"].splice(elmentIndex, 1);
    }
    val[index]['qoptions'][innerIndex]['checked'] = e.target.checked;
    setQuestions(val);
    let updatedData = [...questions];
    if (updatedData && updatedData[index]["answer"].length == 0) {
      val[index]['error'] = true;
      setQuestions(val);
    }
  }
  const onselectScale = (i, index, id) => {
    setSelectedScale(i + 1);
    let val = [...questions];
    val[index]['answer'] = id;
    val[index]['error'] = false;
    setQuestions(val);
  }
  const onFileChange = async (event, index) => {
    const imageFile = event.target.files[0];
    if (imageFile) {

      if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        toast.error(<ToastUI message={FILE_SELECT} type={"Error"} />);
        return false;
      }

      const payload = new FormData();
      payload.append("file", imageFile);
      await uploadFile(payload);
      setSelectedIndex(index);
    } else {
      let val = [...questions];
      val[index]['answer'] = "";
      val[index]['error'] = val[index]['required'] == 1 ? true : false;
      setQuestions(val);
      toast.dismiss();
      toast.error(<ToastUI message={FILE_UNSELECT} type={"Error"} />);
    };
  };

  useEffect(() => {
    if (file && selectedIndex) {
      let val = [...questions];
      val[selectedIndex]['answer'] = file;
      val[selectedIndex]['error'] = false;
      setQuestions(val);
    }
  }, [file, selectedIndex]);

  const handleSubmit = async () => {
    setSubmitted(true);
    let allQuestions = [...questions];
    let totalError = allQuestions.filter((row) => row.error == true);
    if (totalError && totalError.length == 0) {
      let patientAnswers = [];
      _.forOwn(allQuestions, (value, index) => {
        patientAnswers.push({
          question_id: value?.id,
          question_type: value?.question_type,
          answer: value?.answer ?? "",
          comment: ""
        });
      });


      if (type == "appointment-questionnaire") {
        let formData = {
          appointment_questionnarire_id: patientQuestionnaireId,
          client_id: getLoggedinUserId(),
          patient_answers: patientAnswers
        }
        await saveAppointmentQuestionnaire(formData);
      }
      else {
        let formData = {
          patient_questionnarire_id: patientQuestionnaireId,
          client_id: getLoggedinUserId(),
          patient_answers: patientAnswers
        }
        await saveQuestionnaire(formData);
      }
    }
  }

  const getMultipleChoiceAnswer = (answers) => {
    let result = [];
    _.forOwn(answers, (value, index) => {
      if(value.answer_title){
        result.push(value.answer_title.question_option);
      }
    });
    return result.join(", ");
  }
  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="treatments" />
        <div className="right_content_col">
          <main>
            <Header
              backEnabled={true}
              backTitle={`Back to dashboard`}
              backAction={"dashboard"}
              heading={"Please share your valuable feedback with us."}
              hasBtn={false} />
            <Divider showIcon={false} />

            <div className="box">
              {
                questions && questions.length > 0 && questions.map((result, index) => (
                  <div key={index} className="fieldOuter">
                    <label className="fieldLabel">
                      {result?.question}
                    </label>
                    {canEdit && <div className="questionFont">{result.description > 0 && result?.description_text}</div>}
                    {
                      canEdit && result?.question_type == "Textbox" && <div className="fieldBox">
                        <textarea className="fieldTextarea" name={`Textbox`} value={result?.answer} onChange={(e) => handleInputChange(e, index, 'text')}></textarea>
                        {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">{FIELD_REQUIRED}</span>}
                      </div>
                     
                    }
                    {!canEdit  && result?.question_type == "Textbox" &&  <div>{result?.answer} </div>}
                    {
                      canEdit && result?.question_type == "Yes/No" && <div className="fieldBox  fieldIcon mt-2">
                        {result.qoptions && result.qoptions.length > 0 && result.qoptions.map((v, innerIndex) => (
                          <label key={innerIndex} className="customRadio d-inline-block mr-3">
                            <input type="radio" name={`Yes/No`} checked={v?.question_option == result?.answer} value={v?.question_option} onChange={(e) => handleInputChange(e, index, 'yesno')} /> {v?.question_option}
                          </label>
                        ))

                        }
                        {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">{FIELD_REQUIRED}</span>}
                      </div>
                    }
                    {!canEdit  && result?.question_type == "Yes/No" &&  <div>{result?.answer} </div>}

                    {
                      canEdit && result?.question_type == "Single Choice" && <div className="fieldBox fieldIcon mt-2">
                        {result.qoptions && result.qoptions.length > 0 && result.qoptions.map((v, innerIndex) => (
                          <label key={innerIndex} className="customRadio d-inline-block mr-3">
                            <input type="radio" name={`SingleChoice`} checked={v?.id == result?.answer} value={v?.id} onChange={(e) => handleInputChange(e, index, 'single')} /> {v?.question_option}
                          </label>
                        ))
                        }
                        {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">{FIELD_REQUIRED}</span>}
                      </div>
                    }
                    {!canEdit  && result?.question_type == "Single Choice" &&  <div>{getMultipleChoiceAnswer(result?.app_question_answer  )} </div>}

                    
                    {
                     canEdit &&  result?.question_type == "Multiple Choice" && <div className="fieldBox">
                        {result.qoptions && result.qoptions.length > 0 && result.qoptions.map((v, innerIndex) => (
                         
                          <label key={innerIndex} className="customCheckbox1 d-inline-block mr-3">
                            <input type="checkbox" name={`MultipleChoice`} checked={v?.checked} value={v?.id} onChange={(e) => handleChange(e, index, 'multiple', innerIndex)} /> {v?.question_option}
                          </label>
                        ))
                        }
                        {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">{FIELD_REQUIRED}</span>}
                      </div>
                    }
                    {!canEdit  && result?.question_type == "Multiple Choice" &&  <div>{getMultipleChoiceAnswer(result?.app_question_answer  )} </div>}

                    {
                      canEdit &&  result?.question_type == "Opinion Scale" && <div className="fieldBox appRating">
                        {result.qoptions && result.qoptions.length > 0 && result.qoptions.map((item, i) => {
                          const selected = i < selectedScale;
                          return (
                            <div onClick={() => onselectScale(i, index, item.id)} key={i} className={selected ? "active" : ""}><span>{i + 1}</span></div>
                          )
                        })}
                        {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">{FIELD_REQUIRED}</span>}
                      </div>

                    }
                    {!canEdit  && result?.question_type == "Opinion Scale" &&  <div>{selectedScale} </div>}
                    {
                      result?.question_type == "File Upload" &&
                      <div className="fieldBox row">
                        <div className=" col-sm-4">
                          {result.answer && <img height="100" src={`${process.env.REACT_APP_MEDIA_URL}questionnarie/${result.answer}`}/>}
                          {canEdit && <input type="file" name="file" onChange={(e) => onFileChange(e, index)} className="fieldInput p-2" />}

                          {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">{FIELD_REQUIRED}</span>}
                        </div>
                      </div>
                    }
                  </div>
                ))
              }
              { canEdit && <div className="mt-2 mb-3">
                <button className="button primary" onClick={handleSubmit} >Submit</button>
              </div>}
            </div>
          </main>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Questionnaire;