import React, { useState } from "react";

const Divider = (props) => {
    return (
        <div className="divider">
        {props.showIcon && 
            <span className="dividerBtn minus" />
        }
        </div>
    );
};
export default Divider;
