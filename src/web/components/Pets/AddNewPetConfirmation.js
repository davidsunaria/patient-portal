import React, { useState, useEffect, useCallback, useMemo, forwardRef, useRef } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CROSS_IMAGE from "patient-portal-images/cross.svg";
const AddNewPetConfirmation = (props) => {

  return (
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
              <p className="p-text mt-4">Do you wish to add details for another pet?</p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="button primary" onClick={() => props.onAddPet()}>Yes</Button>{' '}
          <Button className="button secondary" onClick={() => props.onCancelPet()}>No</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
}

export default AddNewPetConfirmation;