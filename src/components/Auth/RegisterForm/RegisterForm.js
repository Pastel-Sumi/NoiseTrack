import React, { useState } from 'react'
import { Form, Icon } from "semantic-ui-react";
import { useFormik } from "formik"

import { initialValues, validationSchema } from './RegisterForm.data';
import { Auth } from "../../../api";
import "./RegisterForm.scss"

const auth = new Auth();

export function RegisterForm(props) {

  const {openLogin} = props;
  const [showPassword, setShowPassword] = useState(false);

  const onShowHiddenPassword = () => setShowPassword((prevState) => !prevState);
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try{
        await auth.register(formValue.email, formValue.password)
      }catch(error){
        console.error(error);
      }
    }
  })

  return (
    <div className='register-options'>
      <h1>Registro</h1>

      <Form onSubmit={formik.handleSubmit}>
        <Form.Input 
          name="username"
          type="text"
          placeholder="Nombre y apellido"
          onChange={formik.handleChange}
          error={formik.errors.username}/>

        <Form.Input 
          name="enterprise"
          type="text"
          placeholder="Nombre empresa"
          onChange={formik.handleChange}
          error={formik.errors.enterprise}/>

        <Form.Input 
          name="email"
          type="text"
          placeholder="Correo electrónico"
          onChange={formik.handleChange}
          error={formik.errors.email}/>

        <Form.Input 
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Contraseña" 
          onChange={formik.handleChange}
          error={formik.errors.password}
          icon={<Icon 
                  name={showPassword ? "eye slash" : "eye"} 
                  link onClick={onShowHiddenPassword}
                />} 
          />
      
        <Form.Button type="submit" loading={formik.isSubmitting}>
          Enviar
        </Form.Button>
      </Form>
      
      <p className='justify center'>
        <span className="register" onClick={openLogin}>¿Ya tienes una cuenta?</span>
      </p>
    
    </div>
  )
}


