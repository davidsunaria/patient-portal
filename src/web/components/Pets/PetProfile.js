import React, { useState, useEffect, useCallback, useMemo } from "react";
import EDIT_PET_PROFILE_IMG from "patient-portal-images/edit-profile.svg";
import { Link, useHistory, useParams } from "react-router-dom";

const PetProfile = (props) => {
  const renderImage = (props) => {
    let baseUrl;
    if (props.pet_image && props.pet_image !== undefined) {
      baseUrl = `${process.env.REACT_APP_MEDIA_URL}${props.pet_image}`;
    }
    else {
      baseUrl = props.pet_default_img;
    }
    return baseUrl;
  }

  return (
    <React.Fragment>

      <div className="profileInfo">
        <div className="profilePic"><img src={renderImage(props.data)} /></div>
        <div className="profileName">{props.data?.name}
          <Link className="editProfile" to={`/edit-pet/${props.data.id}`}><img src={EDIT_PET_PROFILE_IMG} /></Link>


        </div>
        <div className="profileDetail">

          <div className="profileDetailCol">
            <label>Gender</label>
            <span>{props.data?.gender}</span>
          </div>
          <div className="profileDetailCol">
            <label>Species</label>
            <span>{props.data?.speciesmap?.species}</span>
          </div>
          <div className="profileDetailCol">
            <label>Breed</label>
            <span>{props.data?.breedmap?.name}</span>
          </div>
          <div className="profileDetailCol">
            <label>DOB</label>
            <span>{props.data?.dob}</span>
          </div>
          <div className="profileDetailCol address">
            <label>Weight (KG)</label>
            <span>{props.data?.weight}</span>
          </div>

        </div>
      </div>
    </React.Fragment>
  );
}
export default PetProfile;