import React, { useState } from 'react';
import { Form, Icon, Label, Modal, Button, Header } from "semantic-ui-react";
import { useFormik } from "formik"
import { Camera } from "../../../api";

import "./CameraForm.scss";

import { initialValues } from './CameraForm.data';

const cameraController = new Camera();

export function CameraForm(props) {

    const { cameras, workplaces } = props;
    const [selectorPlace1, setPlaceSelector1] = useState(cameras[0].place);
    const [selectorPlace2, setPlaceSelector2] = useState(cameras[1].place);
    const [placeChange, setPlaceChange] = useState({})
    const [showModal, setShowModal] = useState(false);

    const handleChange = (event, { value }) => {
        setPlaceSelector1(value);
    };

    const handleClose = () => {setShowModal(false)}


    const formik1 = useFormik({
        initialValues: initialValues(),
        validateOnChange: false,
        onSubmit: async (formValue) => {
          try{
            let id_place = ""
            for(let i=0; i < workplaces.length; i++){
                if(workplaces[i].value === selectorPlace1){
                    id_place = workplaces[i].key;
                    break;
                }
            }
            console.log(cameras[0].key, selectorPlace1, id_place )
            setPlaceChange({camera: cameras[0].value, place:selectorPlace1 })
            setShowModal(true);
            //await cameraController.update(cameras[0].key, selectorPlace1, id_place)
          }catch(error){
            console.error(error);
          }
        }
      })

      const formik2 = useFormik({
        initialValues: initialValues(),
        validateOnChange: false,
        onSubmit: async (formValue) => {
          try{
            try{
                let id_place = ""
                for(let i=0; i < workplaces.length; i++){
                    if(workplaces[i].value === selectorPlace1){
                        id_place = workplaces[i].key;
                        break;
                    }
                }
                console.log(cameras[1].key, selectorPlace1, id_place )
                setPlaceChange({camera: cameras[1].value, place:selectorPlace1 })
                setShowModal(true);
                //await cameraController.update(cameras[0].key, selectorPlace1, id_place)
              }catch(error){
                console.error(error);
              }
          }catch(error){
            console.error(error);
          }
        }
      })

      console.log(showModal)

  return (
    <div>
      
      <div className='configuration-container__cam'>
        <div className='cam-update'>
              <Icon className='icon' name='video camera'/>
              <p className='info'>Cambiar ubicación cámara y micrófono: </p>
        </div>

            <Form onSubmit={formik1.handleSubmit}>
                <Label>
                    {cameras[0].text}
                </Label>

                <Form.Select
                    className='selector'
                    placeholder={cameras[0].place}
                    options={workplaces}
                    required={true}
                    value={selectorPlace1}
                    onChange={handleChange}
                />

                <Form.Button className='worker' type="submit" loading={formik1.isSubmitting}>
                    Añadir
                </Form.Button>
            </Form>

            <Form onSubmit={formik2.handleSubmit}>
                <Label className='label'>
                    {cameras[1].text}
                </Label>

                <Form.Select
                    className='selector'
                    placeholder={cameras[1].place}
                    options={workplaces}
                    required={true}
                    value={selectorPlace2}
                    onChange={handleChange}
                />

                <Form.Button className='cam' type="submit" loading={formik2.isSubmitting}>
                    Añadir
                </Form.Button>
            </Form>

                            
      </div>

        <Modal
            open={showModal}
            onClose={handleClose}
            size='small'
        >
            <Header className='header' content= {`Cámara "${placeChange.camera}" cambiada a ${placeChange.place}`}/>
            <Modal.Actions>
                <Button  onClick={handleClose}>Aceptar</Button>
            </Modal.Actions>
        </Modal>
    </div>
  )
}
