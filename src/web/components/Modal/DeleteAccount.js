import React, { useState, useRef, forwardRef, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CROSS_IMAGE from "patient-portal-images/cross.svg";
import { useStoreActions, useStoreState } from "easy-peasy";

const DeleteAccount = (props) => {

  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const deleteProfile = useStoreActions((actions) => actions?.profile?.deleteProfile);
  const setDeletedModal = useStoreActions((actions) => actions?.profile?.setDeletedModal);
  const deletedModal = useStoreState((state) => state?.profile?.deletedModal);
  const deleteConfirmation = () => {
    setConfirmModal(true)
  }
  const openDeleteModal = () => {
    setConfirmModal(false)
    setDeletedModal(true)
  }
  const handleChange = (e) => {
    setPassword(e?.target?.value)
    if (password !== "") {
      setError("")
    }
  }
  const deleteAccount = async () => {
    console.log("password", password)
    if (password === "") {
      setError("please enter the password")
    }
    else {
      await deleteProfile({ password: password })
      setError("")
      setPassword("")
     // setDeletedModal(false)
    }
  }
  const deleteModalClose = () => {
    setError("")
    setPassword("")
    setDeletedModal(false)
  }
  return (
    <React.Fragment>
      <p className="deleteAccount text-danger" onClick={deleteConfirmation}>Delete Account</p>
      <Modal isOpen={confirmModal}  >
        <ModalBody className="p-0">
          <div className="popupWrapper">
            <div className="popupTitle mb-3">Confirmation required
              <a className="cross" onClick={() => setConfirmModal(false)}>
                <img src={CROSS_IMAGE} />
              </a>
            </div>
            <div>
              <p className="p-text mt-4">Are you sure you want to delete your account ? This process cannot be undone. </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="button bg-danger" onClick={openDeleteModal}>Delete</Button>{' '}
          <Button className="button bg-secondary" onClick={() => setConfirmModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>


      <Modal isOpen={deletedModal}  >
        <ModalBody className="p-0 modal-body">
          <div className="popupWrapper">
          <div className="popupTitle mb-3"><span className="">Delete Account</span>
              <a className="cross " onClick={deleteModalClose}>
                <img src={CROSS_IMAGE} />
              </a>
            </div>

            <div className="popupTitle"><span className="deletedTitle">Once you confirm, your account will be deleted and will be logged out from all the devices. If you wish to proceed, please re-enter your password below.</span>
            </div>


            <div className={
              "fieldBox"
            }>
              <input
                placeholder="Enter your password"
                className="fieldInput"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handleChange}
                autoComplete="off"
              />
              <p className="deleteAccount text-danger ml-1">{error}</p>
            </div>

          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="button bg-danger" onClick={deleteAccount}>Delete Account</Button>{' '}
        </ModalFooter>
      </Modal>



    </React.Fragment>
  );
}
export default DeleteAccount