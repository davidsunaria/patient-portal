import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Header from "patient-portal-components/Header/Header";
import Divider from "patient-portal-components/Divider/Divider";
import Sidebar from "patient-portal-components/Sidebar/Sidebar";
import { useStoreActions, useStoreState } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import _ from "lodash";
import { getLoggedinUserId } from "patient-portal-utils/Service";

const Questionnaire = () => {
  const { id } = useParams();
  const history = useHistory();
  const [selectedScale, setSelectedScale] = useState(0);
  const [file, setFile] = useState(null);
  const [patientQuestionnaireId, setPatientQuestionnaireId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [questions, setQuestions] = useState([]);
  const getQuestionnaireDetail = useStoreActions((actions) => actions.appointment.getQuestionnaireDetail);
  const saveQuestionnaire = useStoreActions((actions) => actions.appointment.saveQuestionnaire);
  const uploadFile = useStoreActions((actions) => actions.appointment.uploadFile);
  const response = useStoreState((state) => state.appointment.response);
  const isQuestionnaireSubmitted = useStoreState((state) => state.appointment.isQuestionnaireSubmitted);


  useEffect(() => {
    if (isQuestionnaireSubmitted) {
        history.push("/dashboard");
    }
}, [isQuestionnaireSubmitted]);

  useEffect(async () => {
    if (id) {
      await getQuestionnaireDetail(id);
    }
  }, [id]);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {

        if (data?.details?.id) {
          setPatientQuestionnaireId(data?.details?.id);
        }
        if (data?.details?.questionnaire?.questions) {
          let json = data?.details?.questionnaire?.questions;
          _.forOwn(json, (value, index) => {
            json[index]['error'] = value.required == 1 ? true : false;
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
      ;
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
    setQuestions(val);
    let updatedData = [...questions];
    if (updatedData && updatedData[index]["answer"].length == 0) {
      val[index]['error'] = true;
      setQuestions(val);
    }
  }
  const onselectScale = (i, index, id) => {
    setSelectedScale(i+1);
    let val = [...questions];
    val[index]['answer'] = id;
    val[index]['error'] = false;
    setQuestions(val);
  }
  const onFileChange = async (event, index) => {
    const imageFile = event.target.files[0];
    if (imageFile) {

      if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        toast.error(<ToastUI message={'Please select a valid image.'} type={"Error"} />);
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
      toast.error(<ToastUI message={'Upload canceled, no files selected.'} type={"Error"} />);
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

  const handleSubmit = async() => {
    setSubmitted(true);
    let allQuestions = [...questions];
    let totalError = allQuestions.filter((row) => row.error == true);
    if (totalError && totalError.length == 0) {
      let patientAnswers = [];
      _.forOwn(allQuestions, (value, index) => {
        patientAnswers.push({
          question_id: value?.id,
          question_type: value?.question_type,
          answer: value?.answer,
          comment: ""
        });
      });

      let formData = {
        patient_questionnarire_id: patientQuestionnaireId,
        client_id: getLoggedinUserId(),
        patient_answers: patientAnswers
      }
      await saveQuestionnaire(formData);
    }
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
                    <div className="questionFont">{result.description > 0 && result?.description_text}</div>
                    {
                      result?.question_type == "Textbox" && <div className="fieldBox">
                        <textarea className="fieldTextarea" name={`Textbox`} value={result?.answer} onChange={(e) => handleInputChange(e, index, 'text')}></textarea>
                        {(submitted == true && result?.required == 1 && result.error == true ) && <span className="errorMsg">This field is required</span>}
                      </div>
                    }

                    {
                      result?.question_type == "Yes/No" && <div className="fieldBox  fieldIcon mt-2">
                        {result.qoptions && result.qoptions.length > 0 && result.qoptions.map((v, innerIndex) => (
                          <label key={innerIndex} className="customRadio d-inline-block mr-3">
                            <input type="radio" name={`Yes/No`} value={v?.question_option} onChange={(e) => handleInputChange(e, index, 'yesno')} /> {v?.question_option}
                          </label>
                        ))

                        }
                        {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">This field is required</span>}
                      </div>
                    }

                    {
                      result?.question_type == "Single Choice" && <div className="fieldBox fieldIcon mt-2">
                        {result.qoptions && result.qoptions.length > 0 && result.qoptions.map((v, innerIndex) => (
                          <label key={innerIndex} className="customRadio d-inline-block mr-3">
                            <input type="radio" name={`SingleChoice`} value={v?.id} onChange={(e) => handleInputChange(e, index, 'single')} /> {v?.question_option}
                          </label>
                        ))
                        }
                        {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">This field is required</span>}
                      </div>
                    }

                    {
                      result?.question_type == "Multiple Choice" && <div className="fieldBox">
                        {result.qoptions && result.qoptions.length > 0 && result.qoptions.map((v, innerIndex) => (
                          <label key={innerIndex} className="customCheckbox1 d-inline-block mr-3">
                            <input type="checkbox" name={`MultipleChoice`} value={v?.id} onChange={(e) => handleChange(e, index, 'multiple', innerIndex)} /> {v?.question_option}
                          </label>
                        ))
                        }
                        {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">This field is required</span>}
                      </div>
                    }

                    {
                      result?.question_type == "Opinion Scale" && <div className="fieldBox appRating">
                        {result.qoptions && result.qoptions.length > 0 && result.qoptions.map((item, i) => {
                          const selected = i < selectedScale;
                          return (
                            <div onClick={() => onselectScale(i, index, item.id)} key={i} className={selected ? "active" : ""}><span>{i + 1}</span></div>
                          )
                        })}
                        {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">This field is required</span>}
                      </div>

                    }
                    {
                      result?.question_type == "File Upload" &&
                      <div className="fieldBox row">
                        <div className=" col-sm-4">
                          <input type="file" name="file" onChange={(e) => onFileChange(e, index)} className="fieldInput p-2" />

                          {(submitted == true && result?.required == 1 && result.error == true) && <span className="errorMsg">This field is required</span>}
                        </div>
                      </div>
                    }
                  </div>
                ))
              }
              <div className="mt-2 mb-3">
                <button className="button primary" onClick={handleSubmit} >Submit</button>
              </div>
            </div>

          </main>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Questionnaire;