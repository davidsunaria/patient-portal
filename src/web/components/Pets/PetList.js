import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import PetInfoCard from "patient-portal-components/Pets/PetInfoCard.js";
import { getLoggedinUserId } from "patient-portal-utils/Service";
import { useStoreActions, useStoreState } from "easy-peasy";

const PetList = (props) => {
  const history = useHistory();
  const [deletedPetId, setDeletedPetId] = useState("");
  const [petsData, setPetsData] = useState({});
  const getPets = useStoreActions((actions) => actions.pet.getPets);
  const deletePet = useStoreActions((actions) => actions.pet.deletePet);
  const response = useStoreState((state) => state.pet.response);
  const isPetDeleted = useStoreState((state) => state.pet.isPetDeleted);
  
  useEffect(async () => {
    await getPets(getLoggedinUserId());
  }, []);

  useEffect(() => {
    if (response) {
      let { status, statuscode, data } = response;
      if (statuscode && statuscode === 200) {
        if (data?.pets) {
          setPetsData(data?.pets);//
        }
      }
    }
  }, [response]);

  const onDeletePet = async (id) => {
    setDeletedPetId(id);
    await deletePet(id);
  }
  useEffect(() => {
      if(isPetDeleted && deletedPetId){
        let array = [...petsData]
        let newarray = array.filter(element => element.id !== deletedPetId);
        setPetsData(newarray);
      }
  }, [isPetDeleted, deletedPetId]);
  return (
    <React.Fragment>
      <div className="petListOuter">

        {petsData && petsData.length > 0 ? (
          petsData.map((result, index) => (
            <PetInfoCard onDeletePet={onDeletePet} mode="edit" data={result} key={index} />
          ))
        ) : (
          <div className="box p-0 noRecord">
          <p>No data found</p>
        </div>
        )}
      </div>
    </React.Fragment>
  );
};
export default PetList;
