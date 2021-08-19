import React, { useState } from "react";
import StarRatings from 'react-star-ratings';

const Rating = (props) => {
    const [rating, setRating] = useState();
    const changeRating = (newRating, name) => {
        setRating(newRating);
        props.onSelectRating(newRating, props.index)
    }

    return (
        <div className="ratingOuter">
            {/* <a className="star active"  />
            <a className="star active"  />
            <a className="star"  />
            <a className="star"  />
            <a className="star"  /> */}
            <StarRatings
                rating={rating}
                className="star"
                starRatedColor="green"
                starHoverColor={"green"}
                changeRating={changeRating}
                numberOfStars={5}
                name={"rating"}
            />
        </div>
    );
};
export default Rating;
