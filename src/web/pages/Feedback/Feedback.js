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
import _ from "lodash";

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
        setQuestions(val);
        console.log(questions)
    }

    const onselectScale = (i, index,id) => {
        console.log("index",index,i+1,id)
        setSelectedScale(i+1)
        let val = [...questions];
        val[index]['answer'] = i+1;
        val[index]['color'] = true;
        val[index]['error'] = false;
        setQuestions(val);
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
            console.log(payload);
            await saveFeedback({ clientId: getLoggedinUserId(), invoiceId: invoiceId, formData: { client_feedback: payload } });
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

    return (<React.Fragment>
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
                    <div className="box">
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
                                <div key={index} className="fieldOuter mb-2">
                                    <label className="fieldLabel">
                                        {console.log("questions", questions)}
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
                                            {  result?.comment != null && <label className="customRadio d-inline-block mr-3">
                                                {result?.comment}
                                            </label>}
                                            {(submitted == true && result?.is_mendatory == 1 && result.error == true) && <span>{FIELD_REQUIRED}</span>}
                                        </>
                                    }
                                    {result.question_type == "textbox" && <div className="fieldBox">
                                        <input type="text" value={result?.answer} name={`rating_${result.id}`} className="fieldInput" onChange={(e) => handleInputChange(e, index, 'text')} />
                                    </div>}
                                    {  result?.comment != null && <label className="customRadio d-inline-block mr-3">
                                        {result?.comment}
                                    </label>}
                                    {(submitted == true && result?.is_mendatory == 1 && result.error == true) && <span className="errorMsg">{FIELD_REQUIRED}</span>}
                                    <div className="fieldBox appRating">
                                     {result.question_type == "rating" && _.times(result.max_rating, (i) => {
                                         console.log("selected",selectedScale,i)
                                        const selected = i < selectedScale;
                                        console.log("selected",selected)
                                       return  <div key={i} onClick={() => onselectScale(i, index,result.id)} key={i} className={result.color && selected ? "active" : ""}><span>{i + 1}</span></div>
                                     })} 
                                    </div>
                                    {/* {result.question_type == "rating" && <Rating key={index} onSelectRating={onSelectRating} index={index} data={result} />}
                                    {  result?.comment != null && <label className="customRadio d-inline-block mr-3">
                                        {result?.comment}
                                    </label>}
                                    {(submitted == true && result?.is_mendatory == 1 && result.error == true) && <span className="errorMsg">{FIELD_REQUIRED}</span>} */}
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
