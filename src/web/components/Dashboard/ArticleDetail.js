import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";

import { useStoreActions, useStoreState } from "easy-peasy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GO_BACK_IMG from "patient-portal-images/goBack.svg";
import APPOINTMENT_BOOK_IMG from "patient-portal-images/appointmentBtn.svg";
import SHARE_IMG from "patient-portal-images/share1.svg";
import Header from "patient-portal-components/Header/Header.js";

const ArticleDetail = (props) => {
  const history = useHistory();
  let { id } = useParams()
  const getArticleDetail = useStoreActions((actions) => actions.dashboard.getArticleDetail);
  const response = useStoreState((state) => state.dashboard.response);
  const [article, setArticle] = useState();
  
  const goToDashboard = () => {
    history.push("/dashboard");
  }
  useEffect( async () => {
    if(id){
      await getArticleDetail(id);
    }
  }, [id]);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
       setArticle(data.article);
      }
    }
  }, [response]);

  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="dashboard" />
        <div className="right_content_col">
          <main>
          <Header
              backEnabled={true}
              backTitle={"Back to dashboard"}
              backAction={"dashboard"}
              heading={"Article Detail"}
              subHeading={""}
              hasBtn={true}
              btnName={"calendar"}
              btnTitle="Book an Appointment"
              onClick={"book-appointment"}
            />
            

            <div className="articleOuter">
              <div className="box articleBlock articleDetail">
                <div className="articleImg">
                {!article?.image && <img  src={`https://via.placeholder.com/560`} />}
                {article?.image &&   <img src={`${process.env.REACT_APP_MEDIA_URL}articles/${article?.image}`} />}
                  </div>
                <h5>{article?.title}</h5>
                <p dangerouslySetInnerHTML={{  __html:article?.content}}/>
              </div>
            </div>
          </main>
        </div>
      </div>
      
    </React.Fragment>
  );
};

export default ArticleDetail;
