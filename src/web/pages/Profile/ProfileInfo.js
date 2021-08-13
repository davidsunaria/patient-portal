import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import Overlay from "patient-portal-components/Overlay/Overlay.js";
import USER_IMAGE from "patient-portal-images/user.png";
import EDIT_PROFILE_IMG from "patient-portal-images/edit-profile.svg";


const ProfileInfo = (props) => {
  const history = useHistory();

  return (
    <div className="profileInfo">
      <div className="profilePic">
        <img src={USER_IMAGE} />
      </div>
      <div className="profileName">
        Aoyama Tanemichi - Male{" "}
        <Link className="editProfile" to="/edit-pet"><img src={EDIT_PROFILE_IMG} /></Link>

       
      </div>
      <div className="profileDetail">
        <div className="profileDetailCol">
          <label>Phone:</label>
          <span>+81 8799978585</span>
        </div>
        <div className="profileDetailCol">
          <label>Email:</label>
          <span>aoyamatememichi@gmail.com</span>
        </div>
        <div className="profileDetailCol address">
          <label>Address:</label>
          <span>296-1019, Kandasudacho, Chiyoda-ku, Tokyo</span>
        </div>
      </div>
    </div>
  );
};
export default ProfileInfo;
