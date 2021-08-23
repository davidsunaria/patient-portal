import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ADD_PET_IMG from "patient-portal-images/add-pet.svg";
import EDIT_PET_IMG from "patient-portal-images/editPet.svg";
import DELETE_PET_IMG from "patient-portal-images/deletePet.svg";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const PetInfoCard = (props) => {
  const history = useHistory();
  const goToProfile = (id) => {
    history.push(`/pet-profile/${id}`);
  }
  const renderImage = (props) => {
    let baseUrl;
    if(props.pet_image && props.pet_image !== undefined){
      baseUrl = `${process.env.REACT_APP_MEDIA_URL}${props.pet_image}`;
    }
    else{
      baseUrl = props.pet_default_img;
    }
    return baseUrl;
  }
  const renderAge = (age) => {
    let string = [];
    if(age.y){
      string.push(`${age.y}Y`);
    }
    if(age.m){
      string.push(`${age.m}M`);
    }
    if(age.d){
      string.push(`${age.d}D`);
    }
    return string.join(',');
  }
  const delPet = (id) => {
    confirmAlert({
      message: 'Are you sure to remove this pet?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => props.onDeletePet(id)
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };
  return (
    <React.Fragment>
      {props.mode === "edit" ? (
        <div className="PetBlock" >

          <div className="petActions">
          <Link title="Edit pet" to={`/edit-pet/${props.data.id}`}><img src={EDIT_PET_IMG} /></Link>
           <a title="Delete pet">
              <img src={DELETE_PET_IMG} onClick={() => delPet(props.data.id)} />
           </a>
          </div>

          <div onClick={() => goToProfile(props.data.id)} className="onHover">
          <img src={renderImage(props.data)} />
          
          <span className="breed">{props.data?.breedmap?.name}</span>
          <div className="petDetail">
            <div>
              <strong>{props.data?.name}</strong> | {props.data?.gender} | {renderAge(props.data?.age)}
            </div>
            <div className="ml-auto">{props.data?.speciesmap?.species}</div>
          </div>
        </div>
        </div>
      ) : (
        <div className="petCard">
          <a className="addPet" onClick={history.push("/create-pet")}>
            <div>
              <img src={ADD_PET_IMG} />
              Add Pet
            </div>
          </a>
        </div>
      )}
    </React.Fragment>
  );
};
export default PetInfoCard;
