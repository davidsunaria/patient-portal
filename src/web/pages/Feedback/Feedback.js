import React, { useState, useEffect } from "react";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Rating from "patient-portal-components/Rating/Rating";
import { useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { formatDate } from "patient-portal-utils/Service";
import { toast } from "react-toastify";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import { getLoggedinUserId } from "patient-portal-utils/Service";

const Feedback = (props) => {
    const { id } = useParams();
    const history = useHistory();
    const [visit, setVisit] = useState({});
    const [questions, setQuestions] = useState({});
    const [invoiceId, setInvoiceId] = useState(id);
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
    const handleInputChange = (e, index) => {
        let val = [...questions];
        val[index]['answer'] = e.target.value;
        val[index]['error'] = false;
        setQuestions(val);
    }
    const saveFeedbackAnswer = async () => {
        let val = [...questions];
        const isError = val.filter((row) => row.error == true);
        if (isError && isError.length > 0) {
            toast.error(<ToastUI message={"Please answer each question"} type={"Error"} />);
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
                                    <span>{visit?.doctor}</span>
                                </div>
                            </div>
                        </div>
                        
                        {
                            questions && questions.length > 0 && questions.map((result, index) => (
                                <div key={index} className="fieldOuter mb-2">
                                    <label className="fieldLabel">
                                        {result?.question}
                                    </label>
                                    {result.question_type == "textbox" && <div className="fieldBox">
                                        <input type="text" value={result?.answer} name={`rating_${result.id}`} className="fieldInput" onChange={(e) => handleInputChange(e, index)} />
                                    </div>}

                                    {result.question_type == "rating" && <Rating key={index} onSelectRating={onSelectRating} index={index} data={result} />}
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
