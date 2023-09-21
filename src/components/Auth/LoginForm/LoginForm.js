import React, { useState } from 'react'
import { Form, Icon } from "semantic-ui-react";
import { useFormik } from "formik"

import { initialValues, validationSchema } from './LoginForm.data';
import { Auth } from "../../../api";
import "./LoginForm.scss";

const auth = new Auth();

export function LoginForm(props) {
  const {openRegister} = props;
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)

  const onShowHiddenPassword = () => setShowPassword((prevState) => !prevState);
  
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try{
        await auth.login(formValue.email, formValue.password);
      }catch(error){
        setError(true);
        console.error(error);
      }
    }
  })

  return (
    <div className='login-options'>
      <h1>Bienvenido</h1>

      <p className="description">Sistema de monitoreo de riesgos auditivos en trabajadores expuestos a altos niveles de ruidos</p>

      <Form onSubmit={formik.handleSubmit}>
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

        {error && <p className='error'>Correo electrónico o contraseña incorrecta</p>}

      
        <Form.Button type="submit" loading={formik.isSubmitting}>
          Iniciar sesión
        </Form.Button>
      </Form>
      
      <p className='justify center'>
        <span className="register" onClick={openRegister}>¿No tienes una cuenta?</span>
      </p>
    </div>
  )
}
