import React, { useState, useEffect } from 'react';
import { Form, Icon, Loader } from "semantic-ui-react";
import { useFormik } from "formik"

import "./Configuration.scss"

import { initialValues, validationSchema } from './Configuration.data';
import { UserList } from "../UserList";
import { Worker, Workerplace } from "../../../api";

const workerController = new Worker();
const workplaceController = new Workerplace();

export function Configuration() {

  const [selectorPlace, setPlaceSelector] = useState("Sala 1");
  let [workers, setWorkers] = useState([]);
  let [workplaces, setWorkplaces] = useState([]);
  let [loading, setLoading] = useState(true);
  let workersAux = [];
  let workplaceAux = [];

  useEffect(() => {
    (async () => {
        try{
            const workerResponse = await workerController.getAll();
            const workplaceResponse = await workplaceController.getAll();
            console.log(workerResponse)
            workerResponse.forEach(worker => {
              workersAux.push(worker);
            })

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


  if(loading){
    return (
        <Loader active inline="centered" size="large">
            Cargando
        </Loader>
    )
}

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

      <UserList workers={workers}/>

    </div>
  )
}
