import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Article from "patient-portal-components/Dashboard/Article.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLoggedinUserId, getUser, setLastPetId } from "patient-portal-utils/Service";
import Notifications from "patient-portal-components/Dashboard/Notifications"
import APPOINTMENT_BOOK_IMG from "patient-portal-images/appointmentBtn.svg";
import Header from "patient-portal-components/Header/Header.js";

const Dashboard = (props) => {
  const history = useHistory();
  const [userData, setUserData] = useState(getUser());
  const [articles, setArticles] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [petId, setPetId] = useState(null);
  const [visitId, setVisitId] = useState(null);

  const getPetIdInfo = useStoreActions((actions) => actions.dashboard.getPetIdInfo);
  const getPetByVisit = useStoreActions((actions) => actions.dashboard.getPetByVisit);
  const getDashboard = useStoreActions((actions) => actions.dashboard.getDashboard);
  const response = useStoreState((state) => state.dashboard.response);
  

  useEffect(async () => {
    await getDashboard(getLoggedinUserId());
  }, []);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.articles) {
          setArticles(data.articles);
        }
        if (data?.upcoming_data) {
          setUpcoming(data.upcoming_data);
        }
        if (data?.completed_data) {
          setCompleted(data.completed_data);
        }
        if(data?.lastPetId){
          setLastPetId(data?.lastPetId);
        }
      }
    }
  }, [response]);


  const onDelete = useCallback((id, type) => {
    if (type == "upcoming") {
      const newUpcoming = upcoming.filter((row) => row.id !== id);
      setUpcoming(newUpcoming);
    }
    else {
      const newCompleted = completed.filter((row) => row.id !== id);
      setCompleted(newCompleted);
    }
  },
    [upcoming, completed],
  )

  const handleNotiEvent = useCallback((event) => {
    switch (event.event_type) {

      case "appointment_questionnarie":
        history.push(`/questionnaire/${event.event_id}/appointment-questionnaire`);
        break;

      case "questionnaire":
        history.push(`/questionnaire/${event.event_id}/questionnaire`);
        break;
      case "appointment_cancel":
        history.push(`/appointment-detail/${event.event_id}`);
        break;

      case "appointment_reschedule":
        history.push(`/appointment-detail/${event.event_id}`);
        break;
      case "appointment_reminder":
        history.push(`/appointment-detail/${event.event_id}`);
        break;

      case "appointment":
        history.push(`/appointment-detail/${event.event_id}`);
        break;
      case "treatment_instruction":
        history.push(`/treatments/${event.event_id}`);
        break;

      case "deworming":
        getPetId(event, "new");
        break;

      case "anti_ectoparasite":
        if(event.type == "upcoming"){
          //Book appointment page
          getPetId(event, "new");
        }
        else{
          getPetId(event);
        }
        break;
      case "vaccination":
        getPetId(event, "new");
        break;
      case "invoice":
        history.push(`/invoice-detail/${event.event_id}`);
        break;

      case "visit":
        getPetId(event);
        break;

      case "report":
        getPetId(event, "new");
        break;

      case "feedback":
        history.push(`/feedback/${event.event_id}`);
        break;
    }
  },
    [history],
  )
  const getPetId = useCallback(async (event, type) => {
    if (type && type == "new") {
      //console.log("Heloo", event.event_id, event.event_type, type);
      await getPetIdInfo({ id: event.event_id, event: event.event_type, history, type: event?.type });
    }
    else {
      //alert("1")
      await getPetByVisit({ id: event.event_id, event: event.event_type, history });
    }
  },
    [history],
  )

  const articlePage = useCallback(() => {
      history.push("/articles")
   } )




  return (
    <React.Fragment>
      <div className="content_outer">

        <Sidebar activeMenu="dashboard" />
        <div className="right_content_col">
          <main>
            <Header
              backEnabled={false}
              heading={`Hello, ${ (!userData?.firstname) ? "there!" : userData?.firstname} ${" "} ${!userData?.lastname ? "" : userData?.lastname}`}
              subHeading={"Today’s Recommendations"}
              hasBtn={true}
              btnName={"calendar"}
              btnTitle="Book an Appointment"
              onClick={"book-appointment"}
            />

            <div className="box mb-4">
              <div className="row">
                <Notifications onNotiEvent={handleNotiEvent} onDelete={onDelete} type={"upcoming"} data={upcoming} />
                <Notifications onNotiEvent={handleNotiEvent} onDelete={onDelete} type={"completed"} data={completed} />
              </div>
            </div>

            <div className="formSubtitle d-flex"><span className="pt-2">Articles</span> <button className="breed button primary ml-auto" onClick={() => articlePage()}>View All</button></div>
            <div className="articleOuter">
              <Article data={articles} />
            </div>
          </main>
        </div>
      </div>

    </React.Fragment>
  );
};

export default Dashboard;
