import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import PetList from "patient-portal-components/Pets/PetList.js";
import Header from "patient-portal-components/Header/Header.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import { getLoggedinUserId } from "patient-portal-utils/Service";
import { useStoreActions, useStoreState } from "easy-peasy";

const ProfileView = (props) => {
  const history = useHistory();

  const handleAddPet = () => {
    history.push("/create-pet");
  }
  
  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="pets" />
        <div className="right_content_col">
          <main>
            <Header
              backEnabled={false}
              heading={"Pets"}
              subHeading={"Here we can get detail of pet"}
              hasBtn={true}
              btnName={"plus"}
              btnTitle="Add Pet"
              onClick={"create-pet"}
            />
            <PetList />
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProfileView;
