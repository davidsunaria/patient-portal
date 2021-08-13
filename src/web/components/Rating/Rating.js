import React, { useState } from "react";

const Rating = (props) => {
    return (
        <div className="ratingOuter">
            <a className="star active"  />
            <a className="star active"  />
            <a className="star"  />
            <a className="star"  />
            <a className="star"  />
        </div>
    );
};
export default Rating;
