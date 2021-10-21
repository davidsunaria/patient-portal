import React, { useState, useEffect } from "react";
import { getLoggedinUserId, showFormattedDate, formatDate, setLastPetId } from "patient-portal-utils/Service";
import { useStoreActions, useStoreState } from "easy-peasy";
import Other from "patient-portal-pages/Appointment/BookAppointment/Other.js"
import EDIT_PROFILE_IMG from "patient-portal-images/edit-profile.svg";

const Step5 = (props) => {
    const getPets = useStoreActions((actions) => actions.pet.getPets);
    const responsePet = useStoreState((state) => state.pet.response);
    const [allPets, setAllPets] = useState([]);

    useEffect(async () => {
        await getPets(getLoggedinUserId());
    }, []);

    useEffect(() => {
        if (responsePet) {
            let { status, statuscode, data } = responsePet;
            if (statuscode && statuscode === 200) {
                if (data?.pets) {
                    setAllPets(data?.pets);
                   // console.log(data?.pets.length, data?.lastPetId, props.formData.pet_id);
                    if(data?.lastPetId){
                        let petId = data?.lastPetId;
                        setLastPetId(petId);
                        const updatePetInfo = data?.pets.filter((row) => row.id === petId);
                        if(updatePetInfo.length > 0){
                            props.onSubmit('','pet_id',updatePetInfo[0]);
                        }
                        
                    }
                    else if(data?.pets.length > 0 && !data?.lastPetId && !props.formData.pet_id){
                        props.onSubmit('','pet_id',data?.pets[0]);
                    }
                }
            }
        }
    }, [responsePet]);
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
    return (
        <div>
            <div className="subtitle mt-4 mb-3">Select Pet</div>
            <div className="row mt-3">
                <div className="col-md-8">
                    <div className="box">
                        <div className="checkboxOuter petSetMaxLimit">
                            {
                                allPets && allPets.length > 0 && allPets.map((val, index) => (
                                    <label key={index} className="customCheckbox d-flex">
                                        <div className="appointemntPetPic"><img src={renderImage(val)}/></div>
                                        <input type="radio" name="pet_id"  checked={val?.id == props.formData.pet_id ? true : false} value={val?.id} onChange={(e) => props.onSubmit(e, "pet", val)} />
                                        <span className="serviceName">
                                            {val?.name}
                                            <label className="appointmentSpecies">
                                                {val?.speciesmap?.species}
                                            </label>

                                            <label className="appointmentSpecies">
                                                {val?.gender}
                                            </label>

                                            <label className="appointmentSpecies">
                                            {renderAge(val?.age)}
                                            </label>

                                        </span>
                                    </label>
                                ))
                            }


                        </div>
                    </div>
                   
                    <div className="appointmentBtns">
                        <button className="button secondary mr-2" onClick={() => props.onBack(4)}>Back</button>
                        <button className="button primary ml-auto" onClick={() => props.onNext(6)}>
                            Continue
                        </button>
                    </div>
                </div>
                <Other other={props.other} />
            </div>
        </div>
    );
};
export default Step5;
