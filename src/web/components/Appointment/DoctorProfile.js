import React, { useState, useRef, forwardRef, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CROSS_IMAGE from "patient-portal-images/cross.svg";
import DEFAULT_USER_IMG from "patient-portal-images/default-user.png";

const DoctorProfile = (props) => {

  const [doctorImage, setDoctorImage] = useState("");

  useEffect(() => {
    if(props.data){
      if(props?.data?.doctor_image){
        setDoctorImage(`${process.env.REACT_APP_MEDIA_URL}/userprofiles/${props?.data?.doctor_image}`);
      }
      else{
        setDoctorImage(DEFAULT_USER_IMG);
      }
    }
  }, [props.data]);
  return (

    <React.Fragment>
      <Modal isOpen={props.modal}  >
        <ModalBody className="p-0">
          <div className="popupWrapper servicePopupOuter">
            <div className="popupTitle mb-3">
              <a onClick={props.toggle} className="cross">
                <img src={CROSS_IMAGE} />
              </a>
            </div>
            <div className="servicesDetail">
            
              <img className="servicesDetailPic" src={doctorImage} />
              <div className="doctorName">{props?.data?.title}</div>
              <div className="doctorSpecilist">{props?.data?.sub_title}</div>
              <p className="p-text">{props?.data?.bio}</p>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

export default DoctorProfile;