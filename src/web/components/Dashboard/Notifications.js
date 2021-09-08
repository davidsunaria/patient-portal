import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { } from "patient-portal-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import APPOINTMENT_IMG from "patient-portal-images/noti-appointment.svg";
import INSTRUCTION_IMG from "patient-portal-images/noti-instruction.svg";
import VACCINATION_IMG from "patient-portal-images/noti-vaccination.svg";
import DEWORMING_IMG from "patient-portal-images/noti-deworming.svg";
import ANTI_IMG from "patient-portal-images/noti-antitick.svg";
import INVOICE_IMG from "patient-portal-images/noti-invoice.svg";
import VISIT_IMG from "patient-portal-images/noti-visit.svg";
import FEEDBACK_IMG from "patient-portal-images/noti-feedback.svg";
import QUESTIONNAIRE_IMG from "patient-portal-images/noti-questionnaire.svg";
import NOTI_CROSS from "patient-portal-images/noti-cross.svg";
import SMILY from "patient-portal-images/smily.svg";

const Notifications = (props) => {
  const history = useHistory();
  const deleteNotification = useStoreActions((actions) => actions.dashboard.deleteNotification);
  const isNotificationDeleted = useStoreState((actions) => actions.dashboard.isNotificationDeleted);
  const [deletedId, setDeletedId] = useState(null);
  const [type, setType] = useState();

  const removeNotification = async (id, type) => {
    setDeletedId(id);
    setType(type);
    await deleteNotification(id);
  }
  useEffect(() => {
    if (isNotificationDeleted) {
      updateNotofication();
    }
  }, [isNotificationDeleted]);
  const updateNotofication = () => {
    props.onDelete(deletedId, type);
  }
  const getImage = (value) => {
    let src, class_used;

    if (value.event_type === "appointment_reminder" || value.event_type === "appointment" || value.event_type === "appointment_cancel" || value.event_type === "appointment_reschedule") {
      src = APPOINTMENT_IMG;
      class_used = "appointmentNotification";
    }
    if (value.event_type === "treatment_instruction") {
      src = INSTRUCTION_IMG;
      class_used = "instructionNotification";
    }
    if (value.event_type === "vaccination") {
      src = VACCINATION_IMG;
      class_used = "vaccinationNotification";
    }
    if (value.event_type === "deworming") {
      src = DEWORMING_IMG;
      class_used = "dewormingNotification";
    }
    if (value.event_type === "anti_ectoparasite") {
      src = ANTI_IMG;
      class_used = "antitickNotification";
    }
    if (value.event_type === "invoice" || value.event_type === "report" ) {
      src = INVOICE_IMG;
      class_used = "invoiceNotification";
    }
    if (value.event_type === "questionnaire") {
      src = QUESTIONNAIRE_IMG;
      class_used = "questionnaireNotification";
    }

    if (value.event_type === "visit") {
      src = VISIT_IMG;
      class_used = "visitNotification";
    }
    if (value.event_type === "feedback") {
      src = FEEDBACK_IMG;
      class_used = "feedbackNotification";
    }
    return { src, class_used };
  }

 
  return (
    <React.Fragment>

      {props.type && props.type == "upcoming" && (<div className="col-sm-6">
        <div className="dashboardTitle">UPCOMING</div>
        <div className="dashboardNotification">
          {props.data && props.data.length > 0 ? (
            props.data.map((result, index) => (
              <div key={index} className={`notiRow ${getImage(result).class_used}`}>
                <div className="notify onHover" onClick={() => props.onNotiEvent(result)}>
                  <span><img src={getImage(result).src} /></span>
                  <p>{result?.grammar}</p>
                </div>
                <a title="Delete notification" className="notiCross" onClick={() => removeNotification(result.id, "upcoming")}><img src={NOTI_CROSS} /></a>
              </div>
            ))
          ) : (
            <div className="notify border-0 p-0 justify-content-center">
              <p>No recommendations <img src={SMILY}/></p>
            </div>
          )}
        </div>

      </div>)}

      {props.type && props.type == "completed" && (<div className="col-sm-6">
        <div className="dashboardTitle">Completed</div>
        <div className="dashboardNotification">
          {props.data && props.data.length > 0 ? (
            props.data.map((result, index) => (
              <div key={index} className={`notiRow ${getImage(result).class_used}`}>
                <div className="notify onHover" onClick={() =>  props.onNotiEvent(result)}>
                  <span><img src={getImage(result).src} /></span>
                  <p>{result?.grammar}</p>
                </div>
                <a title="Delete notification" className="notiCross" onClick={() => removeNotification(result.id, "completed")}><img src={NOTI_CROSS} /></a>
              </div>
            ))
          ) : (
            <div className="notify border-0 p-0 justify-content-center">
              <p>No recommendations <img src={SMILY}/></p>
            </div>
          )}
        </div>

      </div>)}
    </React.Fragment>
  )
}

export default Notifications;
