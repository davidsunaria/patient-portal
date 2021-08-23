import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import { } from "patient-portal-message";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SHARE_IMG from "patient-portal-images/share1.svg";

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
            <div className="articleImg">
            {!result.image && <img  src={`https://via.placeholder.com/150`} />}

            {result.image && <img src={`${process.env.REACT_APP_MEDIA_URL}articles/${result.image}`} />}
             
            </div>
            <p>{result?.title}</p>
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
