import React, { useState, useRef, forwardRef, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CROSS_IMAGE from "patient-portal-images/cross.svg";
import * as _ from "lodash";
const PetProfilePic = (props) => {
  const [name, setName] = useState("");
  useEffect(() => {
    if(props.data){
      setName(props?.data?.get('name'));
    }
  }, [props.data]);
  
  return(
    <React.Fragment>
      <Modal isOpen={props.modal}  >
        <ModalBody className="p-0">
          <div className="popupWrapper">
            <div className="popupTitle mb-3">Confirmation required?
              <a className="cross" onClick={props.toggle}>
                <img src={CROSS_IMAGE} />
              </a>
            </div>


            <div>
              <p className="p-text mt-4">We noticed that you hadn’t added a picture for "{name}". We recommend that you upload a picture as it becomes easier for our doctors to identify . Would you like to do so now?</p>
            </div>

          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="button primary" onClick={() => props.onAction('yes')}>Yes</Button>{' '}
          <Button className="button secondary" onClick={() => props.onAction('no')}>No</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );  
}
export default PetProfilePic

