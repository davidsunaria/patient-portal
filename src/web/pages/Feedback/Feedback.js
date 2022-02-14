import React, { useState, useEffect } from "react";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Rating from "patient-portal-components/Rating/Rating";
import { useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { formatDate } from "patient-portal-utils/Service";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getLoggedinUserId } from "patient-portal-utils/Service";
import { SELECT_ANSWER } from "patient-portal-message";
import { FIELD_REQUIRED } from "patient-portal-message";
//import {FeedbackModal} from "./FeedbackModal.js"
import FeedbackModal from "patient-portal-pages/Feedback/FeedbackModal"
import Select from 'react-select';
import _ from "lodash";
import { useCallback } from "react";

const Feedback = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const [visit, setVisit] = useState({});
    const [questions, setQuestions] = useState({});
    const [invoiceId, setInvoiceId] = useState(id);
    const [submitted, setSubmitted] = useState(false);
    const [selectedScale, setSelectedScale] = useState(0);
    const [selectedScaleSecond, setSelectedSecond] = useState(0);
    const getFeedbackDetail = useStoreActions((actions) => actions.appointment.getFeedbackDetail);
    const saveFeedback = useStoreActions((actions) => actions.appointment.saveFeedback);
    const response = useStoreState((state) => state.appointment.response);
    const isFeedbackGiven = useStoreState((state) => state.appointment.isFeedbackGiven);
    const [singleFeedback, setSingleFeedback] = useState({ value: "", label: "Select any one option" });
    const [flag, setFlag] = useState("dropdown");
    const [FeedbackPopup, setFeedbackPopup] = useState(false);
    const [ratingValue, setRatingValue] = useState(0);

    useEffect(() => {
        if (isFeedbackGiven) {
            history.push("/dashboard");
        }
    }, [isFeedbackGiven]);
    useEffect(async () => {
        if (id) {
            await getFeedbackDetail(id);
        }
    }, [id]);

    useEffect(() => {
        if (response) {
            let { message, statuscode, data } = response;
            if (statuscode && statuscode === 200) {
                if (data?.pet_visit) {
                    setVisit(data?.pet_visit);
                    let json = data?.feedback_questions;
                    Object.keys(json).map(function (object) {
                        json[object]["answer"] = '';
                        json[object]["error"] = true;
                    });
                    setQuestions(json);
                }
            }
        }
    }, [response]);

    const onSelectRating = (rating, index) => {
        let val = [...questions];
        val[index]['answer'] = rating;
        val[index]['error'] = false;
        setQuestions(val);
    }
    const handleInputChange = (e, index, type) => {
        let val = [...questions];
        if (type == "text") {
            val[index]['answer'] = e.target.value;
            val[index]['error'] = (e.target.value) ? false : true;
        }
        if (type == "yesno") {
            val[index]['answer'] = e.target.value;
            val[index]['error'] = (e.target.value) ? false : true;
        }

        if (type == "single_choice") {
            val[index]['answer'] = e.target.value;
            val[index]['error'] = (e.target.value) ? false : true;
        }

        // if (type == "yesno") {
        //     val[index]['answer'] = e.value;
        //     setSingleFeedback(e)
        //     val[index]['error'] = (e.value) ? false : true;
        // }
        setQuestions(val);
    }

    const onselectScale = (i, index, id, length) => {
        setRatingValue(i + 1)
        // if (length == 5 && i > 2) {
        // setFeedbackPopup(true);
        setSelectedScale(i + 1)
        let val = [...questions];
        val[index]['answer'] = i + 1;
        val[index]['color'] = true;
        val[index]['error'] = false;
        setQuestions(val);
        // }
        // else {
        //     setSelectedScale(i + 1)
        //     let val = [...questions];
        //     val[index]['answer'] = i + 1;
        //     val[index]['color'] = true;
        //     val[index]['error'] = false;
        //     setQuestions(val);

        // }

    }


    const saveFeedbackAnswer = async () => {
        setSubmitted(true);
        let val = [...questions];
        const isError = val.filter((row) => row.error == true);
        if (isError && isError.length > 0) {
            toast.error(<ToastUI message={SELECT_ANSWER} type={"Error"} />);
        }
        else {
            let payload = [];
            val.map((value, index) => {
                payload.push({
                    question_id: value.id,
                    answer: value.answer
                });
            })
            await saveFeedback({ clientId: getLoggedinUserId(), invoiceId: invoiceId, formData: { client_feedback: payload } });
        }
    }

    const closeFeedbackPopup = () => {
        setFeedbackPopup(false);
    };

    const handleChange = (e, index, type, innerIndex) => {
        let val = [...questions];
        if (!val[index]['answer']) {
            val[index]['answer'] = []
        }
        if (e.target.checked) {
            val[index]['answer'].push(e.target.value);
            val[index]['error'] = false;
        }
        else {
            let elmentIndex = val[index]["answer"].indexOf(e.target.value);
            val[index]["answer"].splice(elmentIndex, 1);
        }
        val[index]['question_option'][innerIndex]['checked'] = e.target.checked;
        setQuestions(val);
        let updatedData = [...questions];
        if (updatedData && updatedData[index]["answer"].length == 0) {
            val[index]['error'] = true;
            setQuestions(val);
        }
    }


    // const rating = (length) =>{
    //     console.log("length",length)
    //     let finaldata = null
    //     for (let index = 1; index < length; index++) {
    //        // const element = array[index];

    //        finaldata=  <div key={index} ><span>{index + 1}grtgrtyrt</span></div>
    //        console.log(index)

    //     }
    //     return finaldata
    // }
    // let arr =[{ value: "Yes", label: "Yes" },{ value: "NO", label: "NO" }]
    return (<React.Fragment>
        {<FeedbackModal modal={FeedbackPopup} toggle={closeFeedbackPopup} />}
        <div className="content_outer">
            <Sidebar activeMenu="appointment" />
            <div className="right_content_col">
                <main>

                    {/*a className="backTo"><img src="assets/img/goBack.svg"/> Back to Pre-Treatment</a*/}
                    <div className="titleBtn">
                        <h1 className="title">Feedback</h1>
                        <div className="titleDiscription">
                            Please share your valuable feedback with us.
                        </div>
                    </div>
                    <div className="box feedbackPage">
                        <div className="formSubtitle">Visit Details</div>
                        <div className="row">
                            <div className="col-xl-2 col-lg-2 mb-4">
                                <div className="profileDetailCol">
                                    <label>Time</label>
                                    <span>{formatDate(visit?.visit_date, 3)} | {formatDate(visit?.visit_date, 4)}</span>
                                </div>
                            </div>
                            <div className="col-xl-3 col-lg-5 mb-4">
                                <div className="profileDetailCol">
                                    <label>Clinic</label>
                                    <span>{visit?.clinic?.clinic_name}</span>
                                </div>
                            </div>
                            <div className="col-xl-7 col-md-4 mb-4">
                                <div className="profileDetailCol">
                                    <label>Doctor</label>
                                    <span>{visit?.doctor?.firstname} {visit?.doctor?.lastname}</span>
                                </div>
                            </div>
                        </div>

                        {

                            questions && questions.length > 0 && questions.map((result, index) => (
                                <div key={index} className={`fieldOuter mb-2 ${result.max_rating == "5" ? "pb-3 " : ""}`}>
                                    <label className="fieldLabel">
                                        {result?.question}
                                    </label>
                                    {result.question_type == "yes_no" &&
                                        <>
                                            <label className="customRadio d-inline-block mr-3">
                                                <input type="radio" name={`yes_no`} value="yes" onChange={(e) => handleInputChange(e, index, 'yesno')} /> Yes
                                           </label>
                                            <label className="customRadio d-inline-block mr-3">
                                                <input type="radio" name={`yes_no`} value="no" onChange={(e) => handleInputChange(e, index, 'yesno')} /> No
                                            </label>
                                        </>

                                    }

                                    {result.question_type == "single_choice" && result.input_type == "dropdown"
                                        && <div className="fieldBox pb-3">


                                            <select name="single_choice" id="cars" className={"customSelectBox petSelect fieldInput"} onChange={(e) => handleInputChange(e, index, 'single_choice')}>
                                                {
                                                    result.question_option.map((val, i) => {
                                                        return (
                                                            <option value={val.question_option} key={i}>{val.question_option}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    }


                                    {result.question_type == "single_choice" && result.input_type == "radio" && <div className="fieldBox">

                                        {
                                            result.question_option.map((val, i) => {
                                                return (
                                                    <label className="customRadio d-inline-block mr-3">
                                                        <input type="radio" name={`single_choice`} value={val.question_option} onChange={(e) => handleInputChange(e, index, 'single_choice')} />{val.question_option}
                                                    </label>
                                                )
                                            })
                                        }

                                    </div>
                                    }



                                    {result.question_type == "textbox" && <div className="fieldBox mb-3">
                                        <input type="text" value={result?.answer} name={`rating_${result.id}`} className="fieldInput" onChange={(e) => handleInputChange(e, index, 'text')} />
                                    </div>}


                                    {result.question_type == "multi_choice" && <div className="fieldBox">
                                        {result.question_option && result.question_option.length > 0 && result.question_option.map((v, innerIndex) => (
                                            <label key={innerIndex} className="customCheckbox1 d-inline-block mr-3">
                                                <input key={innerIndex} type="checkbox" name={`MultipleChoice`} checked={v?.checked} value={v?.question_option} onChange={(e) => handleChange(e, index, 'multiple', innerIndex)} /> {v?.question_option}
                                            </label>
                                        ))
                                        }
                                    </div>}



                                    {result.question_type == "rating" && <div className="fieldBox appRating">

                                        {result.question_type == "rating" && new Array(result.max_rating).fill(1).map((_, i) => (
                                            <div key={i} onClick={() => onselectScale(i, index, result.id)} key={i} className={result.color && (i + 1 <= result.answer) ? "active" : ""}><span>{i + 1}</span></div>
                                        ))
                                            //  _.times(result.max_rating, (i) => {
                                            //     const selected = i + 1 <= result.answer;
                                            //     return <div key={i} onClick={() => onselectScale(i, index, result.id)} key={i} className={result.color && selected ? "active" : ""}><span>{i + 1}</span></div>
                                            // })
                                        }
                                    </div>
                                    }
                                    {(submitted == true && result?.is_mendatory == 1 && result.error == true) && <span className="errorMsg">{FIELD_REQUIRED}</span>}
                                    {result?.comment != null && <label className="feedbackComment d-inline-block mr-3">
                                        {result?.comment}
                                    </label>}
                                </div>

                            ))

                        }
                        <div className="mt-2 mb-3">
                            <button className="button primary" onClick={saveFeedbackAnswer}>Submit</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </React.Fragment>
    );
};
export default Feedback;
