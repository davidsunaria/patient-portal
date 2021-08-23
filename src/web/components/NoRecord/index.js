import React from "react";

const NoRecord = (props) => {
  return (
    <React.Fragment>
      <div className={(props.extraClass) ?  props.extraClass : "box mb-2 text-center"}>
        <p>No data found</p>
      </div>
    </React.Fragment>
  )
}
export default NoRecord;