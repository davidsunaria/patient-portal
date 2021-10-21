import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { } from "patient-portal-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SHARE_IMG from "patient-portal-images/share1.svg";
import { truncate } from "patient-portal-utils/Service";
import DCCLOGO from "patient-portal-images/dcc-logo.svg";

const Article = (props) => {
  const history = useHistory();
  const go = (id) => {
    history.push(`/article-detail/${id}`);
  }
  return (
    <React.Fragment>

      {props.data && props.data.length > 0 ? (
        props.data.map((result, index) => (
          <div key={index} className="box p-0 articleBlock onHover" onClick={() => go(result.id)}>
            <div className={!result.image ? "articleImg aricleWithLogo" : "articleImg"} >
            {!result.image && <img src={DCCLOGO} />}

            {result.image && <img src={`${process.env.REACT_APP_MEDIA_URL}articles/${result.image}`} />}
             
            </div>
            <p>{truncate(result?.title, 50, 45)}</p>
          </div>
        ))
      ) : (
        <div className="box p-0 noRecord">
          <p>No data found</p>
        </div>
      )}
     
    </React.Fragment>
  );
};

export default Article;
