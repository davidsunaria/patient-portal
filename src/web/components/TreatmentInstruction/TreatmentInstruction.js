import React from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { getLoggedinUserId, showFormattedDate, formatDate } from "patient-portal-utils/Service";
import NoRecord from "patient-portal-components/NoRecord";

const TreatmentInstruction = (props) => {
  const history = useHistory();
  const getDate = (result, type) => {
    if (result.date && result.time) {
      return formatDate(`${result.date}${" "}${result.time} `, type, false);
    }
  }
  return (
    <React.Fragment>
      {props.data && props.data.length > 0 ? (
        props.data.map((result, index) => (

          <div key={index} className="box treatmentInstruction onHover" onClick={() => props.onTreatmentDetail(result.treatment_instruction_id)}>
            <div className="instrutionName">{result?.title}</div>
            <div className="instrutionDate">{getDate(result, 3)} | {getDate(result, 4)}</div>
          </div>
        ))
      ) : (
        <NoRecord />
      )}
    </React.Fragment>
  );
}

export default TreatmentInstruction;