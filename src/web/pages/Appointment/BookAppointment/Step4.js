import React, { useState, useEffect } from "react";
import { getLoggedinUserId, showFormattedDate, formatDate, setLastPetId } from "patient-portal-utils/Service";
import { useStoreActions, useStoreState } from "easy-peasy";
import Other from "patient-portal-pages/Appointment/BookAppointment/Other.js"

const Step4 = (props) => {
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

    return (
        <div>
            <div className="subtitle mt-4 mb-3">Select Pet</div>
            <div className="row">
                <div className="col-md-8">
                    <div className="box">
                        <div className="checkboxOuter petSetMaxLimit">
                            {
                                allPets && allPets.length > 0 && allPets.map((val, index) => (
                                    <label key={index} className="customCheckbox d-flex justify-content-between">
                                        <input type="radio" name="pet_id"  checked={val?.id == props.formData.pet_id ? true : false} value={val?.id} onChange={(e) => props.onSubmit(e, "pet", val)} />
                                        <span className="serviceName">
                                            {val?.name}
                                            <label className="appointmentSpecies">
                                                {val?.speciesmap?.species}
                                            </label>
                                        </span>
                                    </label>
                                ))
                            }


                        </div>
                    </div>
                    <div className="subtitle mt-4 mb-3">
                        Add Appointment Note
                    </div>
                    <div className="box">
                        <textarea
                            value={props.formData?.appointment_notes}
                            name="appointment_notes"
                            className="appointmentNote"
                            onChange={(e) => props.onSubmit(e)}
                        />
                    </div>


                    <div className="appointmentBtns">
                        <button className="button default mr-2" onClick={() => props.onBack(3)}>Back</button>
                        <button className="button primary ml-auto" onClick={() => props.onNext(5)}>
                            Continue
                        </button>
                    </div>
                </div>
                <Other other={props.other} />
            </div>
        </div>
    );
};
export default Step4;
