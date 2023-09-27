import React, { useState, useEffect } from 'react';
import { Form, Icon, Table } from "semantic-ui-react";
import { useFormik } from "formik"

import "./Configuration.scss"

import { initialValues, validationSchema } from './Configuration.data';
import { UserList } from "../UserList";
import { Worker } from "../../../api";
import { map } from 'lodash';

const workerController = new Worker();

const options = [
  { key: 'sala1', text: 'Sala 1', value: 'Sala 1' },
  { key: 'sala2', text: 'Sala 2', value: 'Sala 2' },
];

const cameras = [
  { key: 'cam1', text: 'Camara 1', value: 'Camara 1' },
  { key: 'cam2', text: 'Camara 2', value: 'Camara 2' },
];

export function Configuration() {

  const [selectorPlace, setPlaceSelector] = useState(options[0].value);

  let [workers, setWorkers] = useState([]);
  let workersAux = []

  console.log(workers)

  useEffect(() => {
    (async () => {
        try{
            const response = await workerController.getAll();
            response.forEach(worker => {
              workersAux.push(worker)
            })
            setWorkers(workersAux)
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
        console.log( "nuevo usuario",
          formValue.email, formValue.username, selectorPlace
        )
        setWorkers([...workers, {
          username: formValue.username,
          place: formValue.email,
          email: selectorPlace,
          created: new Date(),
        }])
        //setorkers([...workers, { email:formValue.email, username:formValue.username, place:selectorPlace}])
        //await workerController.create(formValue.email, formValue.username, selectorPlace)
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
                    placeholder='place'
                    options={options}
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
        <div className='cam-update'>
              <Icon className='icon' name='video camera'/>
              <p className='info'>Cambiar ubicación cámara y micrófono: </p>
        </div>
      </div>

      <UserList workers={workers}/>


    </div>
  )
}
