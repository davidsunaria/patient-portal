import React, { useState, useEffect, useCallback } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import Article from "patient-portal-components/Dashboard/Article.js";
import { useStoreActions, useStoreState } from "easy-peasy";
import { } from "patient-portal-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLoggedinUserId, getUser } from "patient-portal-utils/Service";
import Notifications from "patient-portal-components/Dashboard/Notifications"
import APPOINTMENT_BOOK_IMG from "patient-portal-images/appointmentBtn.svg";
import Header from "patient-portal-components/Header/Header.js";

const Dashboard = (props) => {
  const history = useHistory();
  const getDashboard = useStoreActions((actions) => actions.dashboard.getDashboard);
  const response = useStoreState((state) => state.dashboard.response);
  const [userData, setUserData] = useState(getUser());
  const [articles, setArticles] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(async () => {
    await getDashboard(getLoggedinUserId());
  }, []);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        setArticles(data.articles);//
        setUpcoming(data.upcoming_data);
        setCompleted(data.completed_data);
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


  return (
    <React.Fragment>
      <div className="content_outer">
        
        <Sidebar activeMenu="dashboard" />
        <div className="right_content_col">
          <main>
            <Header
              backEnabled={false}
              heading={`Hello , ${userData?.firstname} ${" "} ${userData?.lastname}`}
              subHeading={"Today’s Recommendations"}
              hasBtn={true}
              btnName={"calendar"}
              btnTitle="Book an Appointment"
              onClick={"book-appointment"}
            />
            
            <div className="box mb-4">
              <div className="row">
                <Notifications onDelete={onDelete} type={"upcoming"} data={upcoming} />
                <Notifications onDelete={onDelete} type={"completed"} data={completed} />
              </div>
            </div>

            <div className="articleTitle">Articles</div>
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
