import React, { useState, useEffect } from 'react';
import { Form, Icon } from "semantic-ui-react";
import { useFormik } from "formik"

import "./Configuration.scss"

import { initialValues, validationSchema } from './Configuration.data';
import { UserList } from "../UserList";
import { CameraForm } from "../CameraForm";
import { Worker, Workerplace, Camera } from "../../../api";

const workerController = new Worker();
const workplaceController = new Workerplace();
const cameraController = new Camera();

const cameras1 = [
  { key: '1', text: 'Camara 1', value: 'Camara 1', place:'Sala 1' },
  { key: '2', text: 'Camara 2', value: 'Camara 2', place:'Sala 2' },
];

const workplaces1 = [
  { key: '1', text: 'Sala 1', value: 'Sala 1' },
  { key: '2', text: 'Sala 2', value: 'Sala 2' },
];

export function Configuration() {

  const [selectorPlace, setPlaceSelector] = useState("Sala 1");
  let [workers, setWorkers] = useState([]);
  let [workplaces, setWorkplaces] = useState([]);
  let [cameras, setCameras] = useState([]);
  let [loading, setLoading] = useState(true);
  let workersAux = [];
  let workplaceAux = [];
  let cameraAux = [];

  useEffect(() => {
    (async () => {
        try{
            const workerResponse = await workerController.getAll();
            const workplaceResponse = await workplaceController.getAll();
            //const cameraResponse = await cameraController.collectionName.getAll();
            console.log(workerResponse)
            workerResponse.forEach(worker => {
              workersAux.push(worker);
            })
            //cameraResponse.forEach(camera => {
              //cameraAux.push(camera);
            //})

            if(workplaceResponse.length !== 0){
              setPlaceSelector(workplaceResponse[0].value)
            }
            workplaceResponse.forEach(workplace => {
              workplaceAux.push({
                key: workplace.id,
                text: workplace.place,
                value: workplace.place,
              });
            })
            setWorkers(workersAux);
            setWorkplaces(workplaceAux);
            //setCameras(cameraAux);
            setLoading(false);
        } catch (error){
            console.log(error)
        }
    })()
}, [])

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try{

        setWorkers([...workers, {
          username: formValue.username,
          place: selectorPlace,
          email: formValue.email,
          created: new Date(),
        }])
        await workerController.create(formValue.email, formValue.username, selectorPlace)
      }catch(error){
        console.error(error);
      }
    }
  })

  const handleChange = (event, { value }) => {
    setPlaceSelector(value);
  };


  return (
    <div className='configuration-container'>
      <h2 className='configuration-container__title'>Configuración de trabajadores</h2>
      <div className='configuration-container__worker'>
          <div className='worker-add'>
              <Icon className='icon' name='add user'/>
              <p className='info'>Añadir trabajador: </p>
          </div>
          <div className='form-add-worker'>
            <Form onSubmit={formik.handleSubmit}>
                <Form.Input 
                  name="username"
                  type="text"
                  placeholder="Nombre y apellido del trabajador"
                  onChange={formik.handleChange}
                  error={formik.errors.username}/>

                <Form.Input 
                  name="email"
                  type="text"
                  placeholder="Correo electrónico"
                  onChange={formik.handleChange}
                  error={formik.errors.email}/>

                <Form.Select
                    placeholder='Lugar de trabajo'
                    options={workplaces}
                    required={true}
                    value={selectorPlace}
                    onChange={handleChange}
                />

                <Form.Button className='worker' type="submit" loading={formik.isSubmitting}>
                  Añadir
                </Form.Button>
              </Form>
          </div>
          
      </div>
      <h2 className='configuration-container__title'>Configuración de cámaras y micrófonos</h2>
      <div className='configuration-container__cam'>
        <CameraForm cameras={cameras1} workplaces={workplaces1}/>
      </div>

      <UserList workers={workers} loading={loading}/>

    </div>
  )
}
