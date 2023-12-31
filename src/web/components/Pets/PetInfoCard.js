import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import ADD_PET_IMG from "patient-portal-images/add-pet.svg";
import EDIT_PET_IMG from "patient-portal-images/editPet.svg";
import DELETE_PET_IMG from "patient-portal-images/deletePet.svg";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import DeletePet from "patient-portal-components/Pets/DeletePet"
const PetInfoCard = (props) => {
  const [deletePetModal, setDeletePetModal] = useState(false);
  const [petId, setPetId] = useState();
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
    if(!age.y && !age.m){
      string.push(`${age.d}D`);
    }
    return string.join(', ');
  }
  const delPet = (id) => {
    setPetId(id);
    setDeletePetModal(!deletePetModal);
  };
  
  const removePet = (id) => {
    props.onDeletePet(id)
  }
  //Close The Confimation Modal
  useEffect(() => {
    if(props.onDeleted){
      setDeletePetModal(false);
    }
  }, [props.onDeleted]);
  return (
    <React.Fragment>
        <DeletePet modal={deletePetModal} petId={petId} toggle={delPet} onDeletePet={removePet} />
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
          
          <span className="breed">{props.data?.name}</span>
          <div className="petDetail">
            <div>
              <strong>{props.data?.breedmap?.name}</strong> | {props.data?.gender} | {renderAge(props.data?.age)}
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
