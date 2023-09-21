import React from 'react'
import { Button } from "semantic-ui-react"
import "./AuthOptions.scss";

export function AuthOptions(props) {

  const {openLogin, openRegister} = props;

  return (
    <div className='auth-options'>
      <h1>Bienvenido</h1>
      <Button className='login' onClick={openLogin}>Iniciar sesión</Button>
      
      <p className="register"  onClick={openRegister}>
        ¿No tienes una cuenta?
      </p>
    </div>
  )
}
