import React, { useState, useEffect, useCallback, useMemo, forwardRef, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import EDIT_PROFILE_IMAGE from "patient-portal-images/edit-profile.svg";
import DOG_IMAGE from "patient-portal-images/dog.png";
import CALENDER_IMAGE from "patient-portal-images/app-calendar.svg";

import Header from "patient-portal-components/Header/Header.js";
import Sidebar from "patient-portal-components/Sidebar/Sidebar.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePetValidation } from "patient-portal-utils/validations/pets/AddEditPetSchema";
import { Formik, ErrorMessage } from "formik";
import { useStoreActions, useStoreState } from "easy-peasy";
import _ from "lodash";
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import { getLoggedinUserId } from "patient-portal-utils/Service";
import ToastUI from "patient-portal-components/ToastUI/ToastUI.js";
import DEFAULT_PET from "patient-portal-images/default-pet.png";


// https://stackoverflow.com/questions/57594045/validation-using-formik-with-yup-and-react-select
const EditPet = (props) => {
  const {id} = useParams();
  const history = useHistory();
  const calendarRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState("");
  const [showBreedName, setShowBreedName] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    species: {value: '', label: ''},
    breed: {value: '', label: ''},
    breed_name: "",
    gender: '',
    dob: '',
    weight: '',
    microchip_no: '',
    tags: '',
    neutered: '',
    profile_image: ''
  });
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [allSpecies, setAllSpecies] = useState([]);
  const [allBreeds, setAllBreeds] = useState([]);
  const { AddEditPetSchema } = usePetValidation();
  const updatePet = useStoreActions((actions) => actions.pet.updatePet);
  const getPet = useStoreActions((actions) => actions.pet.getPet);
  const getSpecies = useStoreActions((actions) => actions.pet.getSpecies);
  const getBreeds = useStoreActions((actions) => actions.pet.getBreeds);
  const response = useStoreState((state) => state.pet.response);

  const editPet = async (payload) => {
    let pageData = { ...payload };
    pageData.breed = pageData.breed.value;
    pageData.species = pageData.species.value;

    let formData = new FormData();
    
    formData.append("pet_id", pageData.id);
    formData.append("name", pageData.name);
    formData.append("species", pageData.species);
    formData.append("breed", (pageData.breed == "other") ? "Other" :  pageData.breed);
    formData.append("breed_name",pageData.breed == "other" ? pageData.breed_name : "");
    formData.append("gender", pageData.gender);
    formData.append("dob", pageData.dob);
    formData.append("neutered", (pageData.neutered) ? pageData.neutered : "");
    if(file){
      formData.append("profile_image", (file) ? file : '');
    }
    formData.append("client_id", getLoggedinUserId());
    formData.append("weight", pageData.weight);
    formData.append("tags", (pageData.tags) ? pageData.tags : "");
    formData.append("microchip_no", (pageData.microchip_no) ? pageData.microchip_no : '');
    formData.append("mcd_no", (pageData.mcd_no) ? pageData.mcd_no : '');
    formData.append("is_aggressive", "");
    formData.append("allergic_medicine", "");
    formData.append("antibiotic_reaction", "");

    await updatePet(formData);
  }
  useEffect(async () => {
    await getSpecies();
    await getPet(id);
  }, []);

  useEffect(() => {
    if (response) {
      let { message, statuscode, data } = response;
      if (statuscode && statuscode === 200) {

        if (data?.pet) {
          let pageData = { ...data?.pet };
          pageData.breed = {label: pageData.breedmap.name,value: pageData.breedmap.id};
          pageData.species = {label: pageData.speciesmap.species,value: pageData.speciesmap.id};
          if(pageData.pet_image){
            pageData.pet_image = `${process.env.REACT_APP_MEDIA_URL + pageData.pet_image}`;
          }
          else{
            pageData.pet_image = DEFAULT_PET;
          }
          setFormData(pageData);
        }

        let result = [];
        if (data?.species) {
          _.forOwn(data?.species, function (value, key) {
            result.push({
              value: value.id, label: value.species
            });
          });
          setAllSpecies(result);
        }
        let resultSet = [];
        if (data.breeds) {
          _.forOwn(data.breeds, function (value, key) {
            resultSet.push({
              value: value.id, label: value.name
            });
          });
          resultSet.push({
            value: "other", label: "Other"
          });
        }
       
        setAllBreeds(resultSet);
      }
    }
  }, [response]);


  useEffect(async () => {
    if (selectedSpecies) {
      setAllBreeds([]);
      await getBreeds({ species: selectedSpecies });
    }
  }, [selectedSpecies]);

  useEffect(async () => {
    await getSpecies();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    calendarRef.current.setOpen(!isOpen)
  };

  const onFileChange = async event => {
    const imageFile = event.target.files[0];
    if (imageFile) {

      if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
        toast.error(<ToastUI message={'Please select a valid image.'} type={"Error"} />);
        return false;
      }
      setFile(imageFile);
    } else {
      toast.dismiss();
      toast.error(<ToastUI message={'Upload canceled, no files selected.'} type={"Error"} />);
    };
  };

  return (
    <React.Fragment>
      <div className="content_outer">
        <Sidebar activeMenu="pets" />
        <div className="right_content_col">
          <main>
          <Header
              backEnabled={true}
              backTitle={"Back to pets"}
              backAction={"pets"}
              heading={"Edit Pet"}
              subHeading={"Here we can edit pet information"}
              hasBtn={false}
            />

            
            <div className="box">
              <Formik
                enableReinitialize={true}
                initialValues={formData}
                onSubmit={async (values, {resetForm}) => {
                  //setFormData(JSON.stringify(values, null, 2))
                  editPet(values);
                }}
                validationSchema={AddEditPetSchema}
              >
                {props => {
                  const {
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset
                  } = props;
                  return (
                   
                    <form className="profileForm" onSubmit={handleSubmit}>
                       
                      <div className="editPic">
                        <img src={values.pet_image} />
                        <a className="editPicOverlay">
                          <img src={EDIT_PROFILE_IMAGE} />
                          <input type="file" onChange={onFileChange} />
                        </a>
                        <p>Please upload pet photo</p>
                      </div>

                      <div className="formSubtitle">Profile Information</div>
                      
                      <div className="row mb-2">
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Name<span className="required">*</span></label>
                            <div className="fieldBox">
                              <input
                                className={
                                  errors.name && touched.name
                                    ? "fieldInput error"
                                    : "fieldInput"
                                }
                                placeholder="Enter first name"
                                id="name"
                                name="name"
                                type="text"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="name" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Species<span className="required">*</span></label>
                            <div className="fieldBox">
                              <Select
                                className={
                                  errors.species && errors.species
                                    ? "customSelectBox error"
                                    : "customSelectBox"
                                }
                                isSearchable={true}
                                id="species"
                                name="species"
                                value={values.species}
                                options={allSpecies}
                                onBlur={handleBlur}
                                onChange={selectedOption => {
                                  let event = { target: { name: 'species', value: selectedOption } }
                                  handleChange(event);
                                  setSelectedSpecies(selectedOption.value);
                                  if(selectedOption.value != "Other"){
                                    props.setFieldValue("breed_name", "");
                                    setShowBreedName(false);
                                  }
                                  props.setFieldValue("breed", {});
                                }}
                                onBlur={() => {
                                  handleBlur({ target: { name: 'species' } });
                                }}
                              />
                              
                              <ErrorMessage name="[species.value]" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>


                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Breed<span className="required">*</span></label>
                            <div className="fieldBox">
                              <Select
                                className={
                                  errors.breed && touched.breed
                                    ? "customSelectBox error"
                                    : "customSelectBox"
                                }
                                isSearchable={true}
                                id="breed"
                                name="breed"
                                value={values.breed}
                                options={allBreeds}
                                onBlur={handleBlur}
                                onChange={selectedOption => {
                                  let event = { target: { name: 'breed', value: selectedOption } }
                                  handleChange(event);
                                  if(selectedOption.value == "other"){
                                    props.setFieldValue("breed_name", "");
                                    setShowBreedName(true);
                                  }
                                  else{
                                    props.setFieldValue("breed_name", "");
                                    setShowBreedName(false);
                                  }
                                }}
                                onBlur={() => {
                                  handleBlur({ target: { name: 'breed' } });
                                }}
                              />
                              <ErrorMessage name="[breed.value]" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>

                        { showBreedName && <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Breed Name<span className="required">*</span></label>
                            <div className="fieldBox">
                              <input
                                className={
                                  errors.name && touched.name
                                    ? "fieldInput error"
                                    : "fieldInput"
                                }
                                placeholder="Enter breed name"
                                id="breed_name"
                                name="breed_name"
                                type="text"
                                value={values.breed_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <ErrorMessage name="breed_name" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>}

                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Gender<span className="required">*</span></label>
                            <div className="fieldBox fieldIcon mt-2">
                              <label className="customRadio d-inline-block mr-3 mb-0">
                                <input type="radio" checked={values.gender === 'Male'} name="gender" value={"Male"}
                                  onChange={handleChange}
                                  onBlur={handleBlur} /> Male</label>
                              <label className="customRadio d-inline-block mb-0">
                                <input type="radio" checked={values.gender === 'Female'} name="gender" value={"Female"}
                                  onChange={handleChange}
                                  onBlur={handleBlur} /> Female</label>

                              <ErrorMessage name="gender" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">DOB<span className="required">*</span></label>
                            <div className="fieldBox fieldIcon">

                              <DatePicker
                                ref={calendarRef}
                                className="fieldInput"
                                value={values.dob}
                                onBlur={handleBlur}
                                onChange={selectedOption => {
                                  let event = { target: { name: 'dob', value: moment(selectedOption).format("YYYY-MM-DD") } }
                                  handleChange(event);
                                }}
                                onBlur={() => {
                                  handleBlur({ target: { name: 'dob' } });
                                }}
                              />
                              <img src={CALENDER_IMAGE} onClick={(e) => handleClick(e)} />
                           
                            <ErrorMessage name="dob" component="span" className="errorMsg" />
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Weight</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                placeholder="Enter weight"
                                id="weight"
                                name="weight"
                                type="text"
                                value={values.weight}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Microchip Number</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                placeholder="Enter microchip no"
                                id="microchip_no"
                                name="microchip_no"
                                type="text"
                                value={values.microchip_no}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">MCD Registration Number</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                placeholder="Enter mcd no"
                                id="mcd_no"
                                name="mcd_no"
                                type="text"
                                value={values.mcd_no}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Tags</label>
                            <div className="fieldBox">
                              <input
                                className="fieldInput"
                                placeholder=""
                                id="tags"
                                name="tags"
                                type="text"
                                value={values.tags}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />

                            </div>
                          </div>
                        </div>

                        <div className="col-sm-6">
                          <div className="fieldOuter">
                            <label className="fieldLabel">Neutered?</label>
                            <div className="fieldBox fieldIcon mt-2">
                              <label className="customRadio d-inline-block mr-3 mb-0">
                                <input type="radio" checked={values.neutered == "Yes"} name="neutered" value={"Yes"}
                                  onChange={handleChange}
                                  onBlur={handleBlur} /> Yes</label>
                              <label className="customRadio d-inline-block mb-0">
                                <input type="radio" checked={values.neutered == "No"} name="neutered" value={"No"}
                                  onChange={handleChange}
                                  onBlur={handleBlur} /> No</label>
                            </div>

                          </div>
                        </div>

                      </div>

                      <div className="mt-2 mb-3">
                        <button type="submit" className="button primary  mr-2">Save</button>
                        <button className="button default" onClick={ () => history.push(`/pet-profile/${id}`)}>Cancel</button>
                      </div>
                    </form>
                  );
                }}
              </Formik>
            </div>
          </main>
        </div>
      </div>

    </React.Fragment>
  );
};
export default EditPet;
